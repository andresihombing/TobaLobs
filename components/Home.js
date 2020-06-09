import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage, RefreshControl,
    TouchableOpacity, ScrollView, FlatList, Image, Alert
} from 'react-native';
import Resource from './network/Resource'
import Tambak from './Tambak'
import IconBadge from 'react-native-icon-badge';
import { set } from 'react-native-reanimated';
import PushNotification from "react-native-push-notification";
import I18n from '../i18n/i18n';
import firebase from 'react-native-firebase';

export default class Home extends React.Component {    

    constructor(props){
        super(props);                
        
        this.state = {
            list_tambak: [],
            tambak : '',
            enableButton: false,
            disableButton: true,
            isFetching: true,
            totalNotif : '',           
            tambakId : '' 
        }          
    }   
    

    goToCreate(){        
        this.props.navigation.navigate('TambahTambak');
        // this.props.navigation.navigate('KebutuhanTambak');
    }

    componentDidMount = async () => {        
    //   this.createNotificationChannel();
    //   this.checkPermission();
      
      this.notif();
      this.getData();                     

      const { navigation } = this.props;        
      this.focusListener = navigation.addListener('didFocus', () => {      
          this.getData();
      });        
    }    
  
    pushPakan = async () => {        
        let body = new FormData();
        body.append('type', 'pagi');
        body.append('tambakID', this.state.tambakId);
        try{                    
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);        
            Resource.save_notif(body, tokenString.token)
                .then((res) => {                
                    this.props.navigation.navigate('DetailNotifikasi', {
                        notifId : res.responseJson.data.notifikasiID,
                    });
                })
                .catch((err) => {                                                                                                
                    console.log("err")
                })
            });
        } catch (error) {            
            console.log(error)
            console.log('AsyncStorage error: ' + error.message);
        } 
      }

    handleNotification(notification){
        //your logic here,
        console.warn(notification);
    
        let isBackground = notification.foreground;
        let id = notification.ID;        
        let tambakId = notification.tambakId
        let type = notification.type
        this.setState({
            tambakId : tambakId
        })        
        console.warn(id)
        if(isBackground != true && type == null){
        //   this.props.navigation.navigate('AllNotifikasi');
            this.props.navigation.navigate('DetailNotifikasi', {
                notifId : id,
            });
        }
        if(isBackground != true && type == 'pagi' ){            
            this.pushPakan()
        }
    };
   
    notif = async () => {        
        const that = this
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
            //   console.warn("TOKEN:", token);
                that.setState({
                    tokenNotif : token
                })                              
            },
            
            onNotification: function(notification) {
                // console.warn("NOTIFICATION:", notification);          
                that.handleNotification(notification);  
            },
            // Android only
            senderID: "931315204931",
            // iOS only
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
        // this.notificationOpenedListener();
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }
    
    getData = async () => {
        try{            
            const role = await AsyncStorage.getItem('role');    
            let rol = JSON.parse(role)

            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.getTambak(tokenString.token)
                .then((res) => {      
                    if(rol != "admin"){
                        if (res.status == 'failed') {                        
                            AsyncStorage.clear();
                            this.props.navigation.navigate('Auth');
                        }
                                             
                        if(res.data.data.length > 0){                        
                            this.setState({
                                enableButton : true,
                                disableButton : false
                            })
                        } else {
                            this.setState({
                                enableButton : false,
                                disableButton : true
                            })
                        }
                        
                        this.setState({isFetching: false, list_tambak: res.data.data, totalNotif : res.data.totalNotif })
                    }else{
                        this.props.navigation.navigate('Manage');
                    }
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
    
    listTambak = async () => {        
        try{            
            await AsyncStorage.getItem('user', (error, result) => {                       
                let list = this.state.tambak;                
                    this.props.navigation.navigate('Tambak', {
                        itemId : list,
                    });
            });   
        } catch (error) {
            console.log('error')
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    render() {
        // console.warn(this.state.list_tambak)
        const { navigate } = this.props.navigation;        
        return (                                    
            <View style={styles.container}>
                {/* <View>
                    <Tambak coba = {this.state.tambak}/>
                </View> */}
                <ScrollView
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}
                      onRefresh={() => this.onRefresh()}
                      tintColor="red"
                    />
                  }>
                <View style={{flexDirection: 'row-reverse',alignItems: 'center', padding: 5}}>
                    <TouchableOpacity 
                        onPress = {() =>{
                            this.props.navigation.navigate('AllNotifikasi');
                        }}
                    >
                        <IconBadge
                            MainElement={
                                <View style={{
                                    backgroundColor:'#489EFE',
                                    width:20,
                                    height:23,
                                    margin:10
                                }}>
                                    <Image 
                                    style = {{paddingRight:9}}
                                    source = {require('./assets/icons/notif.png')} />
                                </View>
                            }
                            BadgeElement={
                                <Text style={{color:'#FFFFFF'}}>{this.state.totalNotif}</Text>
                            }
                            IconBadgeStyle={{
                                width:15,
                                height:15,
                                backgroundColor: '#FF00EE'
                            }}
                            Hidden={this.state.BadgeCount==0}
                        />
                    </TouchableOpacity>
                </View>
                <View style = {styles.infoContainer}>                                        
                    <Text style={styles.textTittle}>{I18n.t('hompage.welcome')}</Text>                    

                    <TouchableOpacity style = {styles.buttonContainer}
                        onPress={() => this.goToCreate()}>
                        <Text style={styles.txtTambah}>{I18n.t('hompage.tambahTambak')}</Text>
                    </TouchableOpacity>                    

                    <View style={styles.tambakContainer}>  
                        <FlatList 
                            style={{ display: this.state.enableButton ? "flex" : "none"}}
                            data = {this.state.list_tambak}
                            // data={this.state.list_tambak.sort((b, a) => b.namaTambak.localeCompare(a.namaTambak))}                        
                            numColumns={2}
                            extraData={this.state.list_tambak}
                            renderItem={({ item, index }) => (                            
                                <TouchableOpacity style={styles.nameTambak}
                                    onPress = {() => {
                                        this.listTambak();
                                        // console.warn(this.state.list_tambak[index])                                    
                                        this.setState({tambak :item.tambakID})                                     
                                    }}
                                >
                                    <Text style= {styles.txtTambah}>{item.namaTambak}</Text>
                                </TouchableOpacity>
                            )}                    
                        />
                        <Text style={{ display: this.state.disableButton ? "flex" : "none", marginTop:150, textAlign: 'center', alignItems: 'center', fontSize: 30 }}>Belum Mempunyai Tambak</Text>
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
    infoContainer: {        
        left: 0,
        right: 0,                   
    },
    textTittle: {
        alignItems: 'center',
        fontSize: 30,
        borderBottomWidth: 3,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 50,
        marginRight: 50,
        color: 'white',
        borderBottomColor: 'white'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
    },
    txtTambah: {
        color: 'white',
    },
    tambakContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',    
        backgroundColor: 'white',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
        padding: 20,
        alignContent: 'center'
    },
    nameTambak: {
        // flex: 1,
        backgroundColor: 'blue',
        paddingVertical: 10,       
        // padding: 30,        
        width: '48%',
        aspectRatio: 2,
        marginBottom: 15,
        justifyContent: 'center',        
        // marginTop: 15,
        alignItems: 'center',
        marginLeft: 5,        
        // height: 200
    },
});