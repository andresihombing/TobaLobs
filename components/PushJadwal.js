import React, { Component } from 'react';
import { Platform, StyleSheet, Text, SafeAreaView, View, AsyncStorage, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import I18n from '../i18n/i18n';

export default class PushJadwal extends Component {
  state = {    
    tambakId : '',
    namaTambak : '',
    sore : '',
    pagi : '',
  };

  static navigationOptions = ({navigation}) => ({
    title: I18n.t('hompage.aturjadwal'),            
  })

  componentDidMount = async() => {            
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;
    const namaTambak = params ? params.namaTambak : null;   

    this.setState({
      tambakId: tambakId,
      namaTambak: namaTambak,      
    })    
  }     

  default(){
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;
    const namaTambak = params ? params.namaTambak : null;
    
    const pagi = moment({ hour: 8 });
    const sore = moment({ hour: 17 });
    const air = moment({ hour: 7 });
    const pagiParse = new Date(pagi)
    const soreParse = new Date(sore)      
    const airParse = new Date(air)      

    this.handleDatePickedPagi(pagiParse, tambakId, namaTambak)
    this.handleDatePickedSore(soreParse, tambakId, namaTambak)
    this.handleDatePickedAir(airParse, tambakId, namaTambak)
  }

  alert = async() => {        
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;
    const pagi = await AsyncStorage.getItem(`pagi${tambakId}`);
    const sore = await AsyncStorage.getItem(`sore${tambakId}`);
    const air = await AsyncStorage.getItem(`gantiAir${tambakId}`);
    const p = JSON.parse(pagi)
    const s = JSON.parse(sore)
    const a = JSON.parse(air)
    const datePagi = moment(p).format('HH.mm')
    const dateSore = moment(s).format('HH.mm')    
    const dateAir = moment(a).format('HH.mm')    
    if(datePagi == "08.00" && dateSore == "17.00" && dateAir == "07.00"){
      Alert.alert(
        ``,
        'Waktu Pemberian Pakan Sekarang adalah Default'
      )
    }else{    
      Alert.alert(
        "",
        "Apakah anda yakin kembali ke pengaturan default ?",
        [
          {
            text: "Tidak",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Ya", onPress: () => this.default() }
        ],
        { cancelable: false }
      );
    }
  }
  

  handleDatePickedPagi = (date, tambakId, namaTambak) => {            
    var dateNow = moment().format("MM DD YY");
    var timeNow = moment().format('HH mm');
    var dateSelect = moment(date).format("MM DD YY")
    var timeSelect = moment(date).format("HH mm")
    var dateTommorow = moment(date);        
    
    if (dateSelect == dateNow && timeSelect <= timeNow) {
      var tomorrow = dateTommorow.add(1, 'day');    
      date = new Date(tomorrow)
      console.log('plus 1')
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
    AsyncStorage.setItem(`pagi${tambakId}`, JSON.stringify(date));
    this.scheduleNotifPagi(date, tambakId, namaTambak)    
  };

  handleDatePickedSore = (date, tambakId, namaTambak) => {            
    var dateNow = moment().format("MM DD YY");
    var timeNow = moment().format('HH mm');
    var dateSelect = moment(date).format("MM DD YY")
    var timeSelect = moment(date).format("HH mm")
    var dateTommorow = moment(date);        
    
    if (dateSelect == dateNow && timeSelect <= timeNow) {
      var tomorrow = dateTommorow.add(1, 'day');    
      date = new Date(tomorrow)
      console.log('plus 1')
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
    AsyncStorage.setItem(`sore${tambakId}`, JSON.stringify(date));
    this.scheduleNotifSore(date, tambakId, namaTambak)    
  };

  handleDatePickedAir = (date, tambakId, namaTambak) => {          
    var dateNow = moment().format("MM DD YY");
    var timeNow = moment().format('HH mm');
    var dateSelect = moment(date).format("MM DD YY")
    var timeSelect = moment(date).format("HH mm")
    var dateTommorow = moment(date);        
    
    if (dateSelect == dateNow && timeSelect <= timeNow) {
      var tomorrow = dateTommorow.add(1, 'day');    
      date = new Date(tomorrow)
      console.log('plus 1')
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
    AsyncStorage.setItem(`gantiAir${tambakId}`, JSON.stringify(date));
    AsyncStorage.setItem(`jumlahHari${tambakId}`, JSON.stringify('3'));
    this.scheduleNotifAir(date, tambakId, namaTambak)    
  };

  scheduleNotifPagi = async(date, tambakId, namaTambak, soundName) =>{              
    PushNotification.localNotificationSchedule({
      date: date,

      /* Android Only Properties */
      id: `1${tambakId}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      type: 'pagi',
      tambakId: tambakId,
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: 'Silahkan anda berikan pakan dipagi hari sekarang dengan pelet', // (optional) default: "message" prop
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
      title: namaTambak, // (optional)
      message: 'Beri Pakan Pagi Hari', // (required)      
      playSound: !!soundName, // (optional) default: true
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "day",
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
    });
  }

  scheduleNotifSore = async(date, tambakId, namaTambak, soundName) =>{              
    PushNotification.localNotificationSchedule({
      date: date,

      /* Android Only Properties */
      id: `2${tambakId}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      type: 'Sore',
      tambakId: tambakId,
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: 'Silahkan anda berikan pakan disore hari sekarang dengan pelet', // (optional) default: "message" prop
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
      title: namaTambak, // (optional)
      message: 'Beri Pakan Sore Hari', // (required)      
      playSound: !!soundName, // (optional) default: true
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "day",
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
    });
  }

  scheduleNotifAir = async(date, tambakId, namaTambak, soundName) =>{   
    const {jumlahHari } = this.state;             
    PushNotification.localNotificationSchedule({
      date: date,

      /* Android Only Properties */
      id: `3${tambakId}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      type: 'air',
      tambakId: tambakId,
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
      title: namaTambak, // (optional)
      message: 'Pergatian Air', // (required)      
      playSound: !!soundName, // (optional) default: true
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "time",
      repeatTime: 86400 * 1000 * 3,
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
    });
  }

  // functionWithoutArg = () => {
  //   //function to be called from default class (without args)
  //   alert('Function Called Without Argument ');
  //   PushNotification.cancelAllLocalNotifications();
  // };

  render() {     
    var pagi = I18n.t('hompage.aturjadwalpagi')
    var sore = I18n.t('hompage.aturjadwalsore')
    var air = I18n.t('hompage.aturjadwalair')
    var Default = I18n.t('hompage.aturdefault')
    console.log(pagi)
    return (
      <SafeAreaView style={styles.container}>                              
        <ListItem
          title= {pagi}
          bottomDivider
          titleStyle={styles.titleStyle}
          onPress = {() => {
            this.props.navigation.navigate('SetJadwalPagi', {
                tambakId : this.state.tambakId,
                namaTambak : this.state.namaTambak
            })
          }}          
        />
        <ListItem
          title={sore}
          bottomDivider
          titleStyle={styles.titleStyle}
          onPress = {() => {
            this.props.navigation.navigate('SetJadwalSore', {
                tambakId : this.state.tambakId,
                namaTambak : this.state.namaTambak
            })
          }}        
        />
        <ListItem
          title={air}
          bottomDivider
          titleStyle={styles.titleStyle}
          onPress = {() => {
            this.props.navigation.navigate('SetJadwalAir', {
                tambakId : this.state.tambakId,
                namaTambak : this.state.namaTambak
            })
          }}        
        />
        <ListItem
          title={Default}
          bottomDivider
          titleStyle={styles.titleStyle}
          onPress = {() => this.alert()}        
        />                
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#254F6E',
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 15,
    color: 'black',    
  },
});