import React from 'react'
import {
    View, StyleSheet, ScrollView, Text,
    TouchableOpacity, AsyncStorage
} from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import CheckBox from 'react-native-check-box'
import Resource from './network/Resource'
import I18n from '../i18n/i18n';
import moment from 'moment';

export default class DetailTambak extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [I18n.t('hompage.waktu'), I18n.t('hompage.makanan')],
            tableData: [],
            namaTambak : '',
            panjang : '',
            lebar : '',
            jenisBudidaya: '',
            jumlah : '',
            betina : '',
            jantan : '',
            tambakId: '',
            shelter : '',
            usiaLobster : '',          
            isChecked : false,
            errorCheck: false
        }
      }

    static navigationOptions = ({navigation}) => ({
        title: I18n.t('hompage.labelkebutuhan'),            
    })

    componentDidMount() {        
        this.kebutuhanTambak()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.kebutuhanTambak()
        });
        this.setJadwal()
    }

    setJadwal = async() => {
        const {params} = this.props.navigation.state;
        const tambakId = params ? params.tambakId : null;                   
        const pagi = await AsyncStorage.getItem(`pagi${tambakId}`);
        const sore = await AsyncStorage.getItem(`sore${tambakId}`);
        const air = await AsyncStorage.getItem(`gantiAir${tambakId}`);
        const jumlahHari = await AsyncStorage.getItem(`jumlahHari${tambakId}`);
        const pagiParse = JSON.parse(pagi)
        const soreParse = JSON.parse(sore)
        const airParse = JSON.parse(air)
        const hari = JSON.parse(jumlahHari)
        const convertPagi = moment(pagiParse).format('HH:mm')       
        const convertSore = moment(soreParse).format('HH:mm') 
        const convertAir = moment(airParse).format('HH:mm') 
        const table = [[`${convertPagi} WIB`, 'Pakan Pagi'],[`${convertSore} WIB`, 'Pakan Sore'],[`${convertAir} WIB`, `Ganti air 1 x ${hari} hari`]]             
        this.setState({
            tableData: table
        })
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    kebutuhanTambak = async () => {                
        const {params} = this.props.navigation.state;
        const tambakId = params ? params.tambakId : null;
        const namaTambak = params ? params.namaTambak : null;
        const panjang = params ? params.panjang : null;
        const lebar = params ? params.lebar : null;
        const jenisBudidaya = params ? params.jenisBudidaya : null;
        const usiaLobster = params ? params.usiaLobster : null;
        const besaran = panjang * lebar * 10;
        const jantan = 1/4*besaran
        const betina = 3/4*besaran                


        this.setState({
            namaTambak : namaTambak,
            panjang : panjang,
            lebar : lebar,
            jenisBudidaya: jenisBudidaya,
            jumlah : Math.ceil(besaran),
            jantan : Math.ceil(jantan),
            betina : Math.floor(betina),
            shelter : besaran,
            usiaLobster : usiaLobster,            
            tambakId: tambakId
        })        
    }

    editTambak = async () => {        
        let formdata = new FormData();
        formdata.append('namaTambak', this.state.namaTambak);
        formdata.append('panjang', this.state.panjang);
        formdata.append('lebar', this.state.lebar);        
        formdata.append('jenisBudidaya', this.state.jenisBudidaya);
        formdata.append('usiaLobster', this.state.usiaLobster);
        formdata.append('jumlahLobster', this.state.jumlah);
        formdata.append('jumlahLobsterJantan', this.state.jantan);
        formdata.append('jumlahLobsterBetina', this.state.betina);
        
        try{
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);      
                let tambakId = this.state.tambakId                   
                console.warn(tambakId)       
                Resource.edit_tambak(formdata, tokenString, tambakId)
                .then((res) => {                                                               
                    let id = res.responseJson.data                    
                    if (res.responseJson.status == 'failed') {
                        alert('user anda telah expired')
                        AsyncStorage.clear();
                        this.props.navigation.navigate('Auth');
                    }                                        

                    this.props.navigation.navigate('DetailTambak');                    
                })
                .catch((err) => {
                    this.setState({
                        errorForm: true,
                    })
                    console.warn('Error:', error);
                })  
            });   
        } catch (error) {
            console.log('error', error)
            console.log('AsyncStorage error: ' + error.message);
        }            
    }

    jenis(){
        if (this.state.jenisBudidaya == 'pembesaran') {
            return <View style={styles.rowContainer}>
                <Text style={styles.label}>{I18n.t('hompage.jumlahlobster')} :</Text>
                <Text style = {styles.input}>{this.state.jumlah} {I18n.t('hompage.ekor')}</Text>
            </View>  
        }else{
            return <View style={styles.rowContainer}>
                <Text style={styles.label}>{I18n.t('hompage.jumlahbetina')} :</Text>
        <Text style = {styles.input}>{this.state.betina} {I18n.t('hompage.ekor')}</Text>
            </View>                   
        }        
    }

    jantan(){
        if (this.state.jenisBudidaya == 'pembenihan') {
            return <View style={styles.rowContainer}>
                <Text style={styles.label}>{I18n.t('hompage.jumlahjantan')} :</Text>                
        <Text style = {styles.input}>{this.state.jantan} {I18n.t('hompage.ekor')}</Text>
            </View>  
        }
    }

    render() {                
        // var date = new Date().getDate();
        // console.warn(this.state.tanggalMulaiBudidaya)
        const state = this.state; 
        return (                        
            <View style={styles.container}>
                <ScrollView>                
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>{this.state.namaTambak}</Text>                                                                                                                        
                    </View>                    

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>{I18n.t('hompage.juduljumlah')}</Text>
                    {this.jenis()}
                    {this.jantan()}                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>{I18n.t('hompage.shelter')} :</Text>
                    <Text style = {styles.input}>{this.state.shelter} buah</Text>
                    </View>       

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>{I18n.t('hompage.juduljadwal')}</Text>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                        <Rows data={state.tableData} textStyle={styles.text}/>
                    </Table>

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>{I18n.t('hompage.perhatian')}</Text>
                    <Text style={styles.textWarning}>{I18n.t('hompage.warning')}</Text>
                    
                    <View style={styles.rowContainer}>                    
                        <CheckBox
                            style={styles.labelCheck}
                            checkBoxColor = 'white'                    
                            onClick={()=>{
                            this.setState({
                                isChecked:!this.state.isChecked
                            })
                            }}
                            isChecked={this.state.isChecked}                            
                        />
                        <Text style = {styles.check}>{I18n.t('hompage.terpenuhi')}</Text>                        
                    </View>
                    <Text style={{ display: this.state.errorCheck ? "flex" : "none", color: 'red', fontSize: 10, marginTop: -30, paddingBottom: 30, paddingLeft: 30}}>{I18n.t('hompage.centang')}</Text>
                    
                    
                    <TouchableOpacity style = {{backgroundColor: '#00A9DE', borderRadius: 10,paddingVertical: 15, alignItems: 'center',display: this.state.isChecked ? "flex" : "none"}}
                            onPress = {() => {
                                this.editTambak();
                            }}
                        >
                        <Text style={styles.txtTambah}>{I18n.t('hompage.mulai')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{backgroundColor: '#00A9DE', borderRadius: 10, paddingVertical: 15, alignItems: 'center',display: this.state.isChecked ? "none" : "flex"}}
                            onPress = {() => {
                                this.setState({
                                    errorCheck : true
                                })
                            }}
                        >
                        <Text style={styles.txtTambah}>{I18n.t('hompage.mulai')}</Text>
                    </TouchableOpacity>

                    <Text style={styles.note}>Note: {I18n.t('hompage.note')}
                        <Text>  </Text>                        
                            <Text style={{color: '#f7c744'}} onPress={() => this.props.navigation.navigate('Home')}>
                                Cancel
                            </Text>
                    </Text>  
                    
                </View>                
                </ScrollView>
            </View>
            
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#254F6E',
        flexDirection: 'column',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',        
        borderBottomWidth: 3,
        borderBottomColor: 'white',        
        justifyContent: 'center',
        marginLeft: 40,
        marginRight: 40,        
    },
    infoContainer: {
        // position: 'absolute',        
        left: 0,
        right: 0,
        // height: 380,        
        padding: 20,                
    },
    textTittle: {        
        fontSize: 30,
        fontWeight: 'bold',                
        color: 'white',                
    },
    rowContainer: {
        flex: 1,         
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      },  
    label:{
        flex: 1,
        color: 'white',
        marginTop: 15
    },
    input: {    
        flex: 1,
        height: 20,
        width: 300,        
        color: 'white',        
        borderBottomColor: 'white',
        borderBottomWidth: 1,        
        marginTop: 15
    },    
    head: {
        height: 40, 
        backgroundColor: '#f7c744',        
    },
    text: { 
        margin: 6,
        color: 'white',        
    },
    textHead: {
        color: 'black',        
        padding: 20
    },
    textWarning: {
        fontSize: 10,
        color: 'white',
        marginTop: 5
    },
    check: {
        flex: 10,
        flexDirection: "row",
        height: 40,
        width: 300,        
        color: 'white',        
        borderBottomColor: 'white',
        marginTop: 23,
        fontSize: 13
    },
    labelCheck: {
        flex: 1,
        color: 'white',        
    }, 
    buttonContainer: {
        backgroundColor: '#00A9DE',
        paddingVertical: 15,        
        alignItems: 'center',
    },
    note: {
        fontSize: 13,
        color: 'white',
        marginTop: 5
    },
    txtTambah: {
        color: 'white'
    }
});