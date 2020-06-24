import React from 'react'
import {
    View, StyleSheet, ScrollView, Text,
    TouchableOpacity, AsyncStorage
} from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import CheckBox from 'react-native-check-box'
import Resource from './network/Resource'
import I18n from '../i18n/i18n';
import BackgroundJob from "react-native-background-job";
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import { set } from 'react-native-reanimated';

export default class DetailTambak extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [I18n.t('hompage.waktu'), I18n.t('hompage.makanan')],        
            namaTambak : '',
            panjang : '',
            lebar : '',
            jenisBudidaya: '',
            jumlah : '',
            betina : '',
            jantan : '',
            shelter : '',
            usiaLobster : '',          
            isChecked : false,
            errorCheck: false,
            tableData: [],
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
        const table = [[`08:00 WIB`, 'Pakan Pagi'],[`17:00 WIB`, 'Pakan Sore'],[`07:00 WIB`, `Ganti air 1 x 3 hari`]]             
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
        })        
    }

    createTambak = async () => {        
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
                Resource.tambah_tambak(formdata, tokenString)
                .then((res) => {                                                        
                    let id = res.responseJson.data;
                    console.log(id)                    
                    var pagi = moment({ hour: 8 })
                    var sore = moment({ hour: 17 })
                    var air = moment({ hour: 7 })
                    var dateTimePagi = new Date(pagi)
                    var dateTimeSore = new Date(sore)
                    var dateTimeAir = new Date(air)
                    this.handleDatePickedPagi(id, dateTimePagi)
                    this.handleDatePickedSore(id, dateTimeSore)
                    this.handleDatePickedAir(id, dateTimeAir)
                    // AsyncStorage.setItem(`pagi${id}`, JSON.stringify(dateTime));                    
                    this.props.navigation.navigate('Home');    
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

    handleDatePickedPagi = (id, date) => {            
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
        AsyncStorage.setItem(`sore${id}`, JSON.stringify(date));
        this.scheduleNotifSore(id, date)        
    };

    handleDatePickedAir = (id, date) => {            
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
            var tomorrow = dateTommorow.add(3, 'day');    
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

        AsyncStorage.setItem(`gantiAir${id}`, JSON.stringify(date));
        AsyncStorage.setItem(`jumlahHari${id}`, JSON.stringify('3'));
        this.scheduleNotifAir(id, date)        
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
          message: 'Beri Pakan Sore Hari', // (required)      
          playSound: !!soundName, // (optional) default: true
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: "day",
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
        });
    }

    scheduleNotifAir = async(id, time, soundName) =>{   
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
          repeatTime: 86400 * 1000 * 3,
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          // actions: '["Simpan Notifikasi"]', // (Android only) See the doc for notification actions to know more
        });
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
                            // rightText={"CheckBox"}                    
                        />
                        <Text style = {styles.check}>{I18n.t('hompage.terpenuhi')}</Text>                        
                    </View>
                    <Text style={{ display: this.state.errorCheck ? "flex" : "none", color: 'red', fontSize: 10, marginTop: -30, paddingBottom: 30, paddingLeft: 30}}>{I18n.t('hompage.centang')}</Text>
                    
                    
                    <TouchableOpacity style = {{backgroundColor: '#00A9DE', borderRadius: 10, paddingVertical: 15, alignItems: 'center',display: this.state.isChecked ? "flex" : "none"}}
                            onPress = {() => {
                                this.createTambak();
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
        backgroundColor: '#f7c744',
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