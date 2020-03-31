import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Resource from './network/Resource'
import Home from './Home'

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
            kosong: false
        }
    }
    

    componentDidMount() {        
        this.getData()
        this.getDataNotif()
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
                    // console.warn(res)
                    this.setState({
                        namaTambak: res.data.namaTambak,
                        keterangan: res.data.keterangan,
                        ph: res.data.ph,
                        suhu: res.data.suhu,
                        do: res.data.do,
                        waktuTanggal: res.data.waktuTanggal,
                        tambakId: itemId
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
                    if(res.data.length != 0){
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

    render() {                      

        return (                        
            <View style={styles.container}>
                <ScrollView>                
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
                    <View style={styles.tambakContainer}>  
                        <View style = {styles.monitoring}>
                            <Text style = {styles.textMonitoring}>{this.state.ph ? this.state.ph : 0}</Text>
                            <Text style = {styles.textMonitoring}>{this.state.suhu ? this.state.ph : 0}°</Text>
                            <Text style = {styles.textMonitoring}>{this.state.do ? this.state.do : 0}ppm</Text>
                        </View>
                        <View style = {styles.monitoring}>
                            <Text>PH</Text>
                            <Text>Suhu</Text>
                            <Text>Do</Text>
                        </View>
                    </View>
                    <TouchableOpacity full style = {{backgroundColor: '#f7c744', paddingVertical: 7, marginTop: 10, marginBottom:20}}>
                        <Text style = {styles.txtTambah, {textAlign:'center'}}>Lihat Riwayat Monitoring Tambak</Text>
                    </TouchableOpacity>
                    <View style = {styles.notifContainer}>
                        <Text style={styles.txtNotif}>Notifikasi</Text>
                        <TouchableOpacity style = {styles.buttonLog}
                        onPress = {() => {
                            this.props.navigation.navigate('LogNotifikasi', {
                                tambakId : this.state.tambakId
                            })
                        }}>
                            <Text style={styles.txtTambah}>Log Notifikasi</Text>
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
                                this.setState({notifId :item.ID})                                                                      
                            }}
                            >
                                <Text style = {styles.txtTambah, {padding:5}}>{item.Body}</Text>
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
    tambakContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        // alignItems: 'stretch',    
        backgroundColor: 'white',
        // paddingVertical: 15,
        marginTop: 15,        
        paddingTop: 70,
        paddingBottom: 80,
        height: 200,
        // alignContent: 'center'
    },
    monitoring: {
        flex: 1,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',        
        alignItems: 'center',
        alignContent: 'center',
    },
    textMonitoring: {        
        fontSize: 20,
        fontWeight: 'bold',                                
    },
    txtNotif: {        
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        padding: 5,
        width: '50%'
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
        backgroundColor: '#f7c744',
        paddingVertical: 5,
        alignItems: 'center',
        width: '50%',        
    },
});