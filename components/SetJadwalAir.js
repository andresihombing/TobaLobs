import React, { Component } from 'react';
import { Alert, StyleSheet, Text, SafeAreaView, View, AsyncStorage, TextInput, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import Resource from './network/Resource'
import I18n from '../i18n/i18n';

export default class SetJadwalAir extends Component {
  state = {    
    isDateTimePickerVisible: false,
    notificationTime: moment({ hour: 17 }),   
    jumlahHari : '' ,
    errorJumlah : false
  };

  static navigationOptions = ({navigation}) => ({
    title: I18n.t('hompage.aturjadwal'),            
  })

  componentDidMount = async() => {         
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;  
    const gantiAir = await AsyncStorage.getItem(`gantiAir${tambakId}`);  
    const jumlahHari = await AsyncStorage.getItem(`jumlahHari${tambakId}`);
    const time = JSON.parse(gantiAir)
    const countDay = JSON.parse(jumlahHari)
    this.setState({
      notificationTime: time,
      jumlahHari: countDay
    })
  }  
  

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });    
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();    

    this.setState({
      notificationTime: moment(date),
    });
  };

  validate(text, type) {  
    if (type == 'jumlah') {
        if(text == ''){
            this.setState({              
                errorJumlah: true
            })
        }else{
            this.setState({              
              errorJumlah: false
            })
        }            
    }            
  }

  val(){
    const { jumlahHari } = this.state
    if ((jumlahHari == "")) {
        this.setState({
            errorJumlah: true,                         
        })            
    }else{
      this.submit()
    }
  }
  
  submitReg = async (id) => {            
    let formdata = new FormData();
    formdata.append('type', 'ganti_air');
    formdata.append('value', this.state.jumlahHari);
    
    try{
        await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);                                       
            Resource.edit_jadwal(formdata, tokenString, id)            
            .then((res) => {                                                                                   
                console.log(res)                
            })
            .catch((err) => {            
                console.warn('Error:', err);
            })  
        });   
    } catch (error) {            
        console.log('AsyncStorage error: ' + error.message);
    }            
  }

  submit = () => {                    
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;
    const namaTambak = params ? params.namaTambak : null; 
    var waktu = this.state.notificationTime
    var date = new Date(waktu)
    var dateNow = moment().format("MM DD YY");
    var timeNow = moment().format('HH mm');
    var dateSelect = moment(date).format("MM DD YY")
    var timeSelect = moment(date).format("HH mm")
    var dateTommorow = moment(date);        
    var air = this.state.jumlahHari

    // var pilihDate = moment(date).format("YYYY-MM-DD")
    // var ate = moment(pilihDate).set({"hour": 5, "minute": 0});
    // console.log(ate)

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
      console.log(date)  
    }
    

    this.hideDateTimePicker();   
    this.submitReg(tambakId)
    this.setState({
      notificationTime: date,
    });
    AsyncStorage.setItem(`gantiAir${tambakId}`, JSON.stringify(this.state.notificationTime));
    AsyncStorage.setItem(`jumlahHari${tambakId}`, JSON.stringify(this.state.jumlahHari));
    this.scheduleNotifAir(date, tambakId, namaTambak)
    Alert.alert(
      '',
      `Berhasil Mengatur Waktu Pengantian Air pukul ${moment(date).format("HH:mm")} WIB`
    )    
  };

  scheduleNotifAir = async(date, tambakId, namaTambak, soundName) =>{   
    const {jumlahHari } = this.state;             
    PushNotification.localNotificationSchedule({
      date: date,

      /* Android Only Properties */
      id: `3${tambakId}`, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      type: 'sore',
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
      repeatTime: 86400 * 1000 * jumlahHari,
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
    });
  }

  render() {    
    const {isDateTimePickerVisible, notificationTime } = this.state;
    return (
      <SafeAreaView style={styles.container}>                
        <ListItem
          title="Jadwal Notifikasi"
          titleStyle={styles.titleStyle}
          onPress={this.showDateTimePicker}
          rightElement={<Text style={{ opacity: 0.7 }}>{moment(notificationTime).format('LT')}</Text>}
        />
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="time"
          is24Hour={true}
          date={new Date(notificationTime)}
          titleIOS="Pick your Notification time"
        />
        <View style={styles.padding} >
            <Text style = {styles.labelText}>Jumlah hari
              <Text style = {styles.satuan}> (per hari)</Text>
            </Text>
            <TextInput style = {styles.textAreaContainer}                            
                returnKeyType = 'next'
                placeholder="Masukkan jumlah hari pergantian air"  
                placeholderTextColor="grey"
                keyboardType= 'number-pad'
                value = {this.state.jumlahHari}
                autoCorrect = {false}
                onChangeText={(jumlahHari) => {              
                  this.validate(jumlahHari, 'jumlah')              
                    this.setState({jumlahHari})
                }}                            
            />
            <Text style={{ display: this.state.errorJumlah ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>
            <TouchableOpacity style = {styles.buttonContainer}
                onPress={() => this.val()}>
                <Text style = {styles.buttonText}>Edit</Text>
            </TouchableOpacity>  
        </View>        
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
    fontSize: 16,
    color: '#585858',
  },
  textAreaContainer: {       
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,      
    marginTop: 4,
  },
  padding: {
      padding: 5
  },
  buttonContainer: {
    backgroundColor: '#00A9DE',
    paddingVertical: 15,
    marginTop: 13,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,    
  },
  satuan:{    
    fontSize: 10,
    color: 'white'
  },
  labelText: {
    color: 'white'
  }
});