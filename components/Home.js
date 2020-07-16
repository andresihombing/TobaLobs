import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage, RefreshControl,
    TouchableOpacity, ScrollView, FlatList, Image, Alert
} from 'react-native';
import Resource from './network/Resource'
import Tambak from './Tambak'
import IconBadge from 'react-native-icon-badge';
import { set, cond } from 'react-native-reanimated';
import PushNotification from "react-native-push-notification";
import I18n from '../i18n/i18n';
import firebase from 'react-native-firebase';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

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
    
    static navigationOptions = ({navigation}) => ({
        title: I18n.t('hompage.labelallnotif'),            
    })

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
  
    pushPakan = async (type) => {        
        let body = new FormData();
        body.append('type', type);
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
            this.pushPakan('pagi')
        }else if(isBackground != true && type == 'sore'){
            this.pushPakan('sore')
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
            console.log(tokenString)
            Resource.getTambak(tokenString.token)
                .then((res) => {      
                    console.log(res)
                    if(rol != "admin"){
                        if (res.status == 'failed') {                        
                            AsyncStorage.clear();
                            console.log('masuk')
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
                        this.getNotifTambak()      
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

    getNotifTambak = async () => {                
        var list = this.state.list_tambak;        
        list.forEach(element => {
            var pagi = element.pakanPagi
            var sore = element.pakanSore
            var air = element.gantiAir
            var airDate = moment({ hour: 7 })                        
            var dateNow = moment().format('YYYY-MM-DD')
            var splitPagi = pagi.split(':')
            var splitSore = sore.split(':')
            var setDatePagi = moment(dateNow).set({"hour": splitPagi[0], "minute": splitPagi[1]});
            var setDateSore = moment(dateNow).set({"hour": splitSore[0], "minute": splitSore[1]});
            var dateAir = new Date(airDate)
            var datePagi = new Date(setDatePagi)
            var dateSore = new Date(setDateSore)
            var id = element.tambakID            
            this.handleDatePickedPagi(id, datePagi)
            this.handleDatePickedSore(id, dateSore)
            this.handleDatePickedAir(id, dateAir, air)
        });
    }

    handleDatePickedPagi = (id, date) => {            
        var dateNow = moment().format("MM DD YY");
        var timeNow = moment().format('HH mm');
        var dateSelect = moment(date).format("MM DD YY")
        var timeSelect = moment(date).format("HH mm")
        var dateTommorow = moment(date);        
        
        if (dateSelect == dateNow && timeSelect <= timeNow) {
          var tomorrow = dateTommorow.add(1, 'day');    
          date = new Date(tomorrow)
          console.log('plus 1 pagi')
        }else if(dateSelect > dateNow && timeSelect <= timeNow){
          var yesterday = dateTommorow.subtract(1, 'day');
          var tomorrow = dateTommorow.add(1, 'day');    
          date = new Date(yesterday)
          console.log('tetap')
        }else if(dateSelect > dateNow && timeSelect > timeNow){
          var yesterday = dateTommorow.subtract(1, 'day');      
          date = new Date(yesterday)
          console.log('pas')
        }    
        AsyncStorage.setItem(`pagi${id}`, JSON.stringify(date));
        this.scheduleNotifPagi(id, date)        
    };

    handleDatePickedSore = (id, date) => {            
        var dateNow = moment().format("MM DD YY");
        var timeNow = moment().format('HH mm');
        var dateSelect = moment(date).format("MM DD YY")
        var timeSelect = moment(date).format("HH mm")
        var dateTommorow = moment(date);                
        
        
        if (dateSelect == dateNow && timeSelect <= timeNow) {
          var tomorrow = dateTommorow.add(1, 'day');    
          date = new Date(tomorrow)
          console.log('plus 1 sore')
        }else if(dateSelect > dateNow && timeSelect <= timeNow){
          var yesterday = dateTommorow.subtract(1, 'day');
          var tomorrow = dateTommorow.add(1, 'day');    
          date = new Date(yesterday)
          console.log('tetap')
        }else if(dateSelect > dateNow && timeSelect > timeNow){
          var yesterday = dateTommorow.subtract(1, 'day');      
          date = new Date(yesterday)
          console.log('pas')
        }
        AsyncStorage.setItem(`sore${id}`, JSON.stringify(date));
        this.scheduleNotifSore(id, date)        
    };

    handleDatePickedAir = (id, date, air) => {                    
        var dateNow = moment().format("MM DD YY");
        var timeNow = moment().format('HH mm');
        var dateSelect = moment(date).format("MM DD YY")
        var timeSelect = moment(date).format("HH mm")
        var dateTommorow = moment(date);        
        
        // if (dateSelect == dateNow && timeSelect <= timeNow) {
        //   var tomorrow = dateTommorow.add(1, 'day');    
        //   date = new Date(tomorrow)
        //   console.log('plus 1')
        // }else if(dateSelect > dateNow && timeSelect <= timeNow){
        //   var yesterday = dateTommorow.subtract(1, 'day');
        //   var tomorrow = dateTommorow.add(1, 'day');    
        //   date = new Date(yesterday)
        //   console.log('tetap')
        // }else if(dateSelect > dateNow && timeSelect > timeNow){
        //   var yesterday = dateTommorow.subtract(1, 'day');      
        //   date = new Date(yesterday)
        //   console.log('pas')
        // }    
        if (dateSelect == dateNow) {
            var tomorrow = dateTommorow.add(air, 'day');    
            date = new Date(tomorrow)
            console.log('plus 3')
        }else{
            var dateNow = moment().format('YYYY-MM-DD')
            var timeSelect = moment(date).format("HH:mm")
            var split = timeSelect.split(':')
            var setDate = moment(dateNow).set({"hour": split[0], "minute": split[1]});
            // var dateAir = new Date(setDate)
            var tomorrow = setDate.add(air, 'day');    
            var date = new Date(tomorrow)
            
          }
        // console.log(date)

        AsyncStorage.setItem(`gantiAir${id}`, JSON.stringify(date));
        AsyncStorage.setItem(`jumlahHari${id}`, JSON.stringify(air));
        this.scheduleNotifAir(id, date, air)        
    };

    scheduleNotifPagi = async(id, time, soundName) =>{            
        console.log('pagi')        
        PushNotification.localNotificationSchedule({
          date: time,
    
          /* Android Only Properties */
          id: `1${id}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          type: 'pagi',
          tambakId: id,
          ticker: 'My Notification Ticker', // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: 'Silahkan anda berikan pakan di pagi hari', // (optional) default: "message" prop
          // subText: 'This is a subText', // (optional) default: none
          color: 'blue', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: 'group', // (optional) add group to message
          ongoing: true, // (optional) set whether this is an "ongoing" notification
    
          /* iOS only properties */
          alertAction: 'view', // (optional) default: view
          category: '', // (optional) default: empty string
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    
          /* iOS and Android properties */
          title: this.state.namaTambak, // (optional)
          message: 'Beri Pakan Pagi Hari', // (required)      
          playSound: !!soundName, // (optional) default: true
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: "day",
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
        });
    }

    scheduleNotifSore = async(id, time, soundName) =>{           
        console.log('sore')                 
        PushNotification.localNotificationSchedule({
          date: time,
    
          /* Android Only Properties */
          id: `2${id}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          type: 'sore',
          tambakId: id,
          ticker: 'My Notification Ticker', // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: 'Silahkan anda berikan pakan di sore hari', // (optional) default: "message" prop
          // subText: 'This is a subText', // (optional) default: none
          color: 'blue', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: 'group', // (optional) add group to message
          ongoing: true, // (optional) set whether this is an "ongoing" notification
    
          /* iOS only properties */
          alertAction: 'view', // (optional) default: view
          category: '', // (optional) default: empty string
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    
          /* iOS and Android properties */
          title: this.state.namaTambak, // (optional)
          message: 'Beri Pakan Sore Hari', // (required)      
          playSound: !!soundName, // (optional) default: true
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: "day",
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
        });
    }

    scheduleNotifAir = async(id, time, air, soundName) =>{   
        console.log('air')                         
        PushNotification.localNotificationSchedule({
          date: time,
    
          /* Android Only Properties */
          id: `3${id}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          type: 'air',
          tambakId: id,
          ticker: 'My Notification Ticker', // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: 'Silahkan anda menganti air dengan air yang lebih bersih dan bebas kotoran', // (optional) default: "message" prop
          // subText: 'This is a subText', // (optional) default: none
          color: 'blue', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: 'group', // (optional) add group to message
          ongoing: true, // (optional) set whether this is an "ongoing" notification
    
          /* iOS only properties */
          alertAction: 'view', // (optional) default: view
          category: '', // (optional) default: empty string
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    
          /* iOS and Android properties */
          title: this.state.namaTambak, // (optional)
          message: 'Pergatian Air', // (required)        
          playSound: !!soundName, // (optional) default: true
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: "time",
          repeatTime: 86400 * 1000 * air,
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
        });
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
                                    backgroundColor:'#00A9DE',
                                    width:22,
                                    height:25,
                                    margin:12,
                                    borderRadius:5,
                                    alignItems: 'center'
                                }}>
                                    <Icon size={23} name={'md-notifications'} color={'white'}/>
                                    {/* <Icon
                                        reverse
                                        size='25'
                                        name='ios-notifications'
                                        type='ionicon'
                                        color='white'
                                        /> */}
                                </View>
                            }
                            BadgeElement={
                                <Text style={{color:'#FFFFFF'}}>{this.state.totalNotif}</Text>
                            }
                            IconBadgeStyle={{
                                width:15,
                                height:15,
                                backgroundColor: '#8B0000'
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
        backgroundColor: '#254F6E',
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
        backgroundColor: '#00A9DE',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
        borderRadius:10,        
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
        backgroundColor: '#2D4151',
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