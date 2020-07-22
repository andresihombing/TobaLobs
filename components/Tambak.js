import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage, RefreshControl,
    TouchableOpacity, ScrollView, FlatList, Alert
} from 'react-native';
import Resource from './network/Resource'
import I18n from '../i18n/i18n';

export default class Tambak extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            namaTambak : '',
            keterangan: '',
            ph: '',
            suhu: '',
            do: '',
            waktuTanggal: '',
            tambakId : '',
            kosong: false,
            isFetching: true,
            pengukuranTerakhir: '',
        }
    }
    
    static navigationOptions = ({navmigation}) => ({
        title: I18n.t('hompage.labeltambak'),
    })

    componentDidMount() {        
        this.getData()
        this.getDataNotif()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData();
            this.getDataNotif()
        });
    }       

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }

    getData = async () => {
        const {params} = this.props.navigation.state;
        const itemId = params ? params.itemId : null;        
        // console.warn(itemId)        

        try{            
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);
                // console.warn(this.state.tambak)
                let list = this.props.coba;
                // console.warn(this.props.coba)
                // console.warn(list)
                Resource.postTambak(itemId, tokenString.token)
                .then((res) => {        
                    console.log(res)                                                                
                    var ph = res.data.ph
                    var suhu = res.data.suhu
                    var Do = res.data.do                    
                    // ph = ph.toFixed(2);
                    // suhu = suhu.toFixed(2);
                    // Do = Do.toFixed(2);
                    this.setState({
                        namaTambak: res.data.namaTambak,
                        keterangan: res.data.keterangan,
                        ph: ph,
                        suhu: suhu,
                        do: Do,
                        waktuTanggal: res.data.waktuTanggal,
                        tambakId: itemId,
                        isFetching: false,
                        pengukuranTerakhir: res.data.waktuTanggal,
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

    getDataNotif = async () => {
        const {params} = this.props.navigation.state;
        const itemId = params ? params.itemId : null;                

        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.getNotif(tokenString.token, itemId, 'unread-per-tambak')
                .then((res) => {                    
                    if(res.data != null){
                        this.setState({
                            kosong : false,                            
                        })
                    } else {
                        this.setState({
                            kosong : true,                            
                        })
                    }
                    
                    this.setState({isFetching: false, listNotif: res.data })
                })
                .catch((err) => {                      
                    this.setState({
                        enableButton : false,
                        disableButton : true
                    })
                    console.log(err)
                })
            });
        } catch (error) {            
            console.log(error)
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    detailNotif = async () => {
        try{            
            await AsyncStorage.getItem('user', (error, result) => {                       
                let list = this.state.tambak;                
                    this.props.navigation.navigate('DetailNotifikasi', {
                        notifId : this.state.notifId,
                    });                
            });   
        } catch (error) {
            console.log('error')
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    monitor(){
        
    }

    save_monitor(ph, suhu, Do, ket){        
        let body = new FormData();
        body.append('tambakID', this.state.tambakId);
        body.append('ph', ph);
        body.append('suhu', suhu);
        body.append('do', Do);
        body.append('keterangan', ket);
        Resource.save_monitor(body)
            .then((res) => {             
                // console.log(res)                
                this.getData()    
                Alert.alert(
                    '',
                    `Berhasil menyipan data monitoring`
                )  
            })
            .catch((err) => {                                      
                console.log(err)
            })        
    }

    monitor = async () => {        
        try{            
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);     
                console.log(tokenString.token)           
                Resource.get_now(tokenString.token)
                .then((res) => {        
                    console.log(res)  
                    if(res.status != 'failed'){
                    var keterangan = res.data.keterangan
                    var ket = keterangan.split(':')
                    var k = ket.join('\n')                                                
                    Alert.alert(
                        "",
            `pH                  : ${res.data.ph}
Suhu              : ${res.data.suhu}°C
Do                  : ${res.data.do}ppm

Keterangan   : 
${k}
Apakah anda ingin menyimpan data monitoring?`,
                        [
                          {
                            text: "Tidak",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          { text: "Ya", onPress: () => this.save_monitor(res.data.ph, res.data.suhu, res.data.do, res.data.keterangan) }
                        ],
                        { cancelable: false }
                    );
                    }
                    else{
                        Alert.alert(
                            '',
                            `Gagal menghubungkan ke perangkat IOT, pastikan perangkat terhubung ke internet.`
                        )  
                    }
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
        var date = this.state.pengukuranTerakhir
        if(date == '1 Jan 0001 - 00:00'){
            date = ' :   -'
        }
        var keterangan = this.state.keterangan
        var ket = keterangan.split(':')
        var k = ket.join('\n')
        console.log(k)

        return (                        
            <View style={styles.container}>
                <ScrollView
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}  
                      onRefresh={() => this.onRefresh()}                    
                      tintColor="red"
                    />
                  }>
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>{this.state.namaTambak}</Text>
                                        
                        <TouchableOpacity style = {styles.buttonContainer}
                            onPress = {() => {
                                this.props.navigation.navigate('DetailTambak', {
                                    tambakId : this.state.tambakId
                                })
                            }}
                        >
                            <Text style={styles.txtTambah}>Detail</Text>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={styles.tanggal}>
                        <Text style = {{fontWeight:'bold'}}>Pengukuran terakhir {date}</Text>
                    </View>
                    <View style={styles.tambakContainer}>                          
                        <View style = {styles.monitoring}>
                            <Text style = {styles.textMonitoring}>{this.state.ph ? this.state.ph : 0}{'\n'}
                                <Text style={{fontSize:17, fontWeight:"normal"}}>pH</Text>
                            </Text>
                            <Text style = {styles.textMonitoring}>{this.state.suhu ? this.state.suhu : 0}°C{'\n'}
                                <Text style={{fontSize:17, fontWeight:"normal"}}>{I18n.t('hompage.suhu')}</Text>
                            </Text>
                            <Text style = {styles.textMonitoring}>{this.state.do ? this.state.do : 0}ppm{'\n'}
                                <Text style={{fontSize:17, fontWeight:"normal"}}>Do</Text>
                            </Text>
                        </View>
                        <View style = {styles.monitoring2}>
                            {/* <Text>PH</Text>
                            <Text>{I18n.t('hompage.suhu')}</Text>
                            <Text>Do</Text> */}
                        </View>                        
                    </View>
                    <View style={styles.keterangan}>
                            <Text style = {{fontWeight:'bold'}}>keterangan :</Text>
                            <Text>{k}</Text>
                        </View>
                    <TouchableOpacity full style = {{backgroundColor: '#00A9DE', paddingVertical: 7, marginTop: 10, marginBottom:5}}
                        onPress = {() => {
                            this.monitor();
                        }}>
                        <Text style = {styles.txtTambah}>{I18n.t('hompage.monitor')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity full style = {{backgroundColor: '#00A9DE', paddingVertical: 7, marginBottom:20}}
                        onPress = {() => {
                            this.props.navigation.navigate('Report', {
                                tambakId : this.state.tambakId
                            })                            
                        }}>
                        <Text style = {styles.txtTambah}>{I18n.t('hompage.riwayat')}</Text>
                    </TouchableOpacity>
                    <View style = {styles.notifContainer}>  
                        <Text style={styles.txtNotif}>{I18n.t('hompage.notif')}</Text>
                        <TouchableOpacity style = {styles.buttonLog}
                        onPress = {() => {
                            this.props.navigation.navigate('LogNotifikasi', {
                                tambakId : this.state.tambakId
                            })
                        }}>
                            <Text style={styles.txtTambah}>{I18n.t('hompage.lognotif')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {styles.notif}>
                    <FlatList                            
                            data = {this.state.listNotif}
                            extraData={this.state.listNotif}
                            renderItem={({item}) => 
                            <TouchableOpacity full style = {styles.notifikasi}
                            onPress = {() => {
                                this.detailNotif();                                
                                this.setState({notifId :item.notifikasiID})                                                               
                            }}
                            >
                                <Text style = {styles.txtTambah, {padding:5}}>{item.body}</Text>
                            </TouchableOpacity>                            
                            }
                        />
                        <Text style={{ display: this.state.kosong ? "flex" : "none", textAlign: 'center', alignItems: 'center', fontSize: 10, color: 'white' }}>Tidak Ada Notifikasi Yang Belum Dibaca</Text>
                    </View>                                                            
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
        backgroundColor: '#00A9DE',
        paddingVertical: 10,        
        alignItems: 'center',
        width: '30%',
        marginBottom: 10 ,
        borderRadius: 10
    },
    tambakContainer: {
        // flex: 1,
        // flexDirection: 'column',
        // // flexWrap: 'wrap',
        // // justifyContent: 'space-between',
        // alignItems: 'stretch',    
        backgroundColor: 'white',
        // // paddingVertical: 40,
        // marginTop: 15,        
        // paddingTop: 70,
        // // paddingBottom: 80,
        // height: 200,
        // // alignContent: 'center'
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    monitoring: {
        flex: 1,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',     
        height: 30,
        marginTop: 40
        // paddingVertical: 40,
        // paddingBottom: 80,
        // alignItems: 'center',
        // alignContent: 'center',
    },
    monitoring2: {
        flex: 1,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',     
        height: 40
        
        // paddingVertical: 40,
        // paddingBottom: 80,
        // alignItems: 'center',
        // alignContent: 'center',
    },
    textMonitoring: {        
        fontSize: 20,
        fontWeight: 'bold',      
        textAlign: 'center'
    },
    txtNotif: {        
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        padding: 5,
        width: '65%'
    },
    notifContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',        
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        backgroundColor: '#455867',       
        padding: 5 
    },
    notif: {
        flex: 1,
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // alignItems: 'flex-start',                
        borderBottomColor: 'white',
        backgroundColor: '#455867',
        padding: 5   
    },
    notifikasi: {
        backgroundColor: 'white', 
        paddingVertical: 7, 
        marginTop: 5,
        marginBottom: 5,
        padding: 5
    },
    buttonLog: {
        backgroundColor: '#00A9DE',
        paddingVertical: 5,
        alignItems: 'center',
        width: '35%',        
        borderRadius: 5
    },
    txtTambah: {
        color: 'white',
        textAlign: 'center'
    },
    keterangan: {
        paddingLeft: 10,
        backgroundColor: 'white',        
        height: 80,        
        flex: 1,
        flexDirection: 'column',        
        alignItems: 'stretch',
    },
    tanggal: {
        paddingLeft: 10,
        height: 30,
        flexDirection: 'column', 
        flexWrap: 'wrap',
        justifyContent: 'center',     
        backgroundColor: '#c7ddef',
        marginTop: 15
    }
});