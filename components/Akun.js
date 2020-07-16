import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { Button } from 'react-native-paper';
import Resource from './network/Resource'
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../i18n/i18n';
import PushNotification from 'react-native-push-notification';
import PushJadwal from './PushJadwal';
/**
 * Home screen
 */
export default class Akun extends React.Component {        
    constructor(props){
        super(props);
        this.state = {
            name: '',
            alamat: '',
            noHp: '',
            tglLahir: '',
            username: '',
            pengaturan: '',
            panduan: '',
            tentang: '',
            keluar: ''
        }
    }
    
    // handlerSimpleCall = () => {
    //     //Calling a function of other class (without arguments)
    //     new PushJadwal().functionWithoutArg();
    //   };

    static navigationOptions = ({navigation}) => ({
        title: I18n.t('hompage.labelaccount')
    })

    componentDidMount = async() => {              
        console.log(await AsyncStorage.getItem('user'))         
        this.getData()
        this.getUser()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData()       
            this.getUser()            
        });
    }    

    componentWillUnmount() {        
        this.focusListener.remove();        
    }
    
    getData(){
        this.setState({
            pengaturan: I18n.t('hompage.labelpengaturan'),
            panduan: I18n.t('hompage.panduan'),
            tentang: I18n.t('hompage.tentang'),
            keluar: I18n.t('hompage.keluar')
        })
    }

    getUser = async () => {
        try {            
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);                                                                
                Resource.user(tokenString.token)
                .then((res) => {                       
                    this.setState({                        
                        name: res.data.Nama,
                        alamat: res.data.Alamat,
                        noHp: res.data.NoHp,
                        tglLahir: res.data.TanggalLahir,                 
                        username: res.data.Username       
                    })             
                })
                .catch((err) => {
                    alert(err)                
                })            
            });                  
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }    
    };

    _signOutAsync = async () => {
        try {
            let devices = await AsyncStorage.getItem('devices');
            let dev = JSON.parse(devices);
            // console.warn(dev)
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);            
                let body = '';              

                Resource.logout(body, tokenString, dev)
                .then((res) => {                
                    console.log(res)                
                    // AsyncStorage.clear();
                    AsyncStorage.removeItem('user');
                    PushNotification.cancelAllLocalNotifications()   
                    
                    this.props.navigation.navigate('Auth');
                })
                .catch((err) => {
                    alert(err)                
                })            
            });                  
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }    
        console.log(await AsyncStorage.getItem('user'))         
    };

    keluar(){
        Alert.alert(
            "",
            "Apakah anda yakin ingin keluar ?",
            [
              {
                text: "Tidak",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Ya", onPress: () => this._signOutAsync() }
            ],
            { cancelable: false }
          );
    }
    
    render() {
        return (        
        <View style = {styles.container}>
            <ScrollView>                
            <View style = {styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style = {styles.textName}>{this.state.name}</Text>                    
                    <Text style = {styles.text}>{this.state.alamat}</Text>   
                    <Text style = {styles.text}>{this.state.noHp}</Text>   
                    <Text style = {styles.garis}></Text>         
                    {/* <TouchableOpacity style = {styles.buttonContainer} onPress = {() => this.props.navigation.navigate('EditProfile', {
                        name: this.state.name,
                        alamat: this.state.alamat,
                        tglLahir: this.state.tglLahir,
                        noHp : this.state.noHp,
                        username: this.state.username
                    })}>
                        <Text style={styles.txtTambah}>Edit Profile</Text>
                    </TouchableOpacity>                     */}
                </View>          
                <View style={styles.contentContainer}>
                    {/* <Text style = {styles.text}>{this.state.alamat}</Text> */}
                    {/* <Text style = {styles.garis}>{this.state.noHp}</Text>                     */}
                </View>
                <View style={styles.pengaturan}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('Pengaturan', {
                        name: this.state.name,
                        alamat: this.state.alamat,
                        tglLahir: this.state.tglLahir,
                        noHp : this.state.noHp,
                        username: this.state.username
                    })}>
                        <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> {this.state.pengaturan}</Text>
                    </TouchableOpacity>                                        
                </View>
                <View style={styles.pengaturan}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('PanduanAplikasi')}>
                        <Text style = {styles.garis}><Icon size={25} name={'md-help-circle'} /> {this.state.panduan}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pengaturan}>
                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('TentangTobalobs')}>
                        <Text style = {styles.garis}><Icon size={25} name={'md-information-circle'} /> {this.state.tentang}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pengaturan}>
                    <TouchableOpacity onPress = {() => this.keluar()}>
                        <Text style = {styles.garis}> 
                        <Icon size={25} name={'md-log-out'} /> {this.state.keluar}</Text>
                    </TouchableOpacity>
                </View>            
                <View>            
                </View>
            </View>
            </ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#254F6E",    
        position: "relative"
    },
    infoContainer: {        
        left: 0,        
        right: 0,        
        // padding: 15,                
    },
    buttonContainer: {        
        backgroundColor: '#00A9DE',
        paddingVertical: 10,
        alignItems: 'center',
        width: '30%',
        marginBottom: 10,
        borderRadius: 10
    },
    titleContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',     
        paddingLeft : 15,
        paddingRight : 15,
    },
    garis : {
        marginBottom: 10,
        fontSize: 18,
        // fontWeight: 'bold',                
        color: 'white',        
        width: '70%', 
        
    }, 
    contentContainer: {        
        borderBottomColor: 'rgba(255,255,255,0.5)',       
        borderBottomWidth: 1,     
        paddingLeft : 15,
        marginTop: -25,
        paddingBottom: 20
    },
    text : {
        fontSize: 16,
        // fontWeight: 'bold',                
        color: 'white',        
        width: '100%',        
    },
    textName : {
        fontSize: 18,
        fontWeight: 'bold',                
        color: 'white',        
        width: '100%',        
    },
    pengaturan : {
        marginTop: 10,                
        borderBottomColor: 'rgba(255,255,255,0.5)',       
        borderBottomWidth: 1,   
        paddingLeft : 15              
    },
    txtTambah: {
        color: 'white'
    }
});