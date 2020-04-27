import React from 'react'
import {
    View, StyleSheet, ScrollView, Text,
    TouchableOpacity, AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import { Table, Row, Rows } from 'react-native-table-component';

export default class DetailTambak extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          tableHead: ['Waktu', 'Takaran', 'Makanan'],
          tableData: [
            ['08.00 WIB', '... gram', 'Pelet halus'],
            ['11.00 WIB', '... gram', 'Pelet halus'],
            ['18.00WIB', '... gram', 'Pelet halus'],            
          ],
          namaTambak: '',
          panjang: '',
          lebar: '',
          jenisBudidaya: '',
          jumlahLobster: '',
          usiaLobster: '',
          jantan: '',
          betina: '',
          tambakId: ''
        }       
      }

    static navigationOptions = {
        title: 'Detail Tambak'        
    };
    
    componentDidMount() {        
        this.Detail()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.Detail()
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    Detail = async () => {
        const {params} = this.props.navigation.state;
        const tambakId = params ? params.tambakId : null;
        // console.warn(tambakId)

        try{            
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);
                // console.warn(this.state.tambak)
                let list = this.props.coba;
                // console.warn(this.props.coba)
                // console.warn(list)
                Resource.detailTambak(tambakId, tokenString.token)
                .then((res) => {     
                    // console.warn(res)                                                                       
                    this.setState({
                        tambakId: res.data.tambakID,
                        namaTambak: res.data.namaTambak,
                        panjang: res.data.panjang,                        
                        lebar: res.data.lebar,
                        jenisBudidaya: res.data.jenisBudidaya,
                        jumlahLobster: res.data.jumlahLobster,       
                        usiaLobster: res.data.usiaLobster,
                        jantan: res.data.jumlahLobsterJantan,
                        betina: res.data.jumlahLobsterBetina,          
                    })                    
                })
                .catch((err) => {                    
                    console.log('Error:', error);
                })  
            });  
        } catch (error) {            
            console.log(error)
            console.log('AsyncStorage error: ' + error.message);
        }
    }
        
    render() {                
        const state = this.state; 
        return (                        
            <View style={styles.container}>
                <ScrollView>                
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>{this.state.namaTambak}</Text>                                        
                        <TouchableOpacity style = {styles.buttonContainer}
                        onPress = {() => {
                            this.props.navigation.navigate('EditTambak', {
                                tambakId : this.state.tambakId,
                                namaTambak : this.state.namaTambak,
                                panjang : this.state.panjang,
                                lebar : this.state.lebar,
                                jenisBudidaya : this.state.jenisBudidaya,
                                usiaLobster : this.state.usiaLobster
                            })                            
                        }}>
                            <Text style={styles.txtTambah}>Edit</Text>
                        </TouchableOpacity>                                                             
                    </View>                    

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>Ukuran Tambak</Text>
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Panjang :</Text>
                        <Text style = {styles.input}>{this.state.panjang} meter</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Lebar :</Text>
                        <Text style = {styles.input}>{this.state.lebar} meter</Text>
                    </View>      
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Jenis Tambak :</Text>
                        <Text style = {styles.input}>{this.state.jenisBudidaya}</Text>
                    </View>      

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>Jumlah Lobster Pada Tambak</Text>
                    <View>{
                        this.state.jenisBudidaya == 'pembenihan' ?
                        <View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Lobster Betina :</Text>
                                <Text style = {styles.input}>{this.state.betina} ekor</Text>
                            </View>      
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Lobster Jantan :</Text>
                                <Text style = {styles.input}>{this.state.jantan} ekor</Text>
                            </View>
                        </View> : 
                        <View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Jumlah Lobster :</Text>
                                <Text style = {styles.input}>{this.state.jumlahLobster} ekor</Text>
                            </View>
                        </View>
                        }
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Shelter :</Text>
                        <Text style = {styles.input}>{this.state.jumlahLobster} buah</Text>
                    </View>      
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Usia Lobster :</Text>
                        <Text style = {styles.input}>{this.state.usiaLobster} bulan</Text>
                    </View>      

                    <Text style = {{color: 'white', marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>Jadwal Pemberian Pakan</Text>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={state.tableData} textStyle={styles.text}/>
                    </Table>
                </View>
                </ScrollView>
            </View>
            
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',        
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },
    infoContainer: {
        // position: 'absolute',        
        left: 0,
        right: 0,
        // height: 380,        
        padding: 20,                
    },
    textTittle: {        
        fontSize: 20,
        fontWeight: 'bold',                
        color: 'white',        
        width: '70%'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 10,        
        alignItems: 'center',
        width: '30%',
        marginBottom: 10  
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
        height: 40,
        width: 300,        
        color: 'white',        
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        paddingTop: 15
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
    }
});