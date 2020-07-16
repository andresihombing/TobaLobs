import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity,
    TextInput, SafeAreaView,AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import PushNotification from "react-native-push-notification";

export default class VerifikasiForgot extends Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();
        this.state = { 
            time: {},
            seconds: 300,
            display: false,
            nama: "",
            username: "",
            password: "",
            alamat: "",
            tanggalLahir: "",
            noHp: "",
            value: '',
            data: '',
            tokenNotif: '',
            errorValue: false,
            errorForm: false
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
      }
    
      secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
      }
    
    componentDidMount() {
        const {params} = this.props.navigation.state;
        const token = params ? params.token : null;
        const noHp = params ? params.noHp : null;

        this.startTimer()
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({             
            data: token,
            noHp: noHp
        });
        this.notif()
    }

    notif(){
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
                console.warn("NOTIFICATION:", notification);          
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
      
    setStateAsync(state) {
        return new Promise((resolve) => {
          this.setState(state, resolve)
        });
    }      

      startTimer = async() => {                
        this.timer = 0;
        await this.setStateAsync({ seconds: 300, display: false });
        console.log(this.timer)
        console.log(this.state.seconds)
        if (this.timer == 0 && this.state.seconds > 0) {
          this.timer = setInterval(this.countDown, 1000);
        //   this.verify()
          console.log('asd')
        }        
      }

      startTimerButton = async() => {                
        this.timer = 0;
        await this.setStateAsync({ seconds: 300, display: false });
        console.log(this.timer)
        console.log(this.state.seconds)
        if (this.timer == 0 && this.state.seconds > 0) {
          this.timer = setInterval(this.countDown, 1000);        
          console.log('asd')
        }        
          this.verify()
      }

      verify = async() => {                 
        var noHp = `+62${this.state.noHp}`        
        let formdata = new FormData();        
        formdata.append('noHp', noHp);        
        formdata.append('type', 'forgot');        
        
        await Resource.verify(formdata)
        .then((res) => {                
            console.log(res)
            this.setStateAsync({
                data: res.responseJson.data
            })                        
        })
        .catch((err) => {            
            this.setState({
                errorForm: true,
            })
            console.log('Error:', error);
        })        
    }
    
      countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
          time: this.secondsToTime(seconds),
          seconds: seconds,
        });
        
        // Check if we're at zero.
        if (seconds == 0) { 
          clearInterval(this.timer);
          this.setState({
              display: true
          })
        }
    }

    viewTme(){
        return this.state.display ?
        <Text style={styles.kirimUlang}>
            Kirim ulang kode
            <Text>  </Text>                        
            <Text style={{color: '#f7c744', fontSize: 12}} onPress={() => this.startTimerButton()}>
            disini
            </Text>
        </Text>   :
        <Text style={styles.kirimUlang}>
            Kirim ulang kode setelah : {this.state.time.m} : {this.state.time.s} 
        </Text>
    }

    validate(text, type) {        
        if (type == 'value') {
            if(text == ''){
                this.setState({              
                    errorValue: true
                })
            }else{
                this.setState({              
                    errorValue: false
                })
            }            
        }                               
    }

    submitReg(){                 
        const { navigate } = this.props.navigation;  
        let deviceID = this.state.tokenNotif
        let devices = deviceID.token      
        
        var kode = this.state.value
        var data = this.state.data
        var body = ''        
        Resource.forgot(data, kode, body, devices)
        .then((res) => {                
            console.log(res)
            if(this.state.value == ''){
                this.setState({              
                    errorValue: true
                })
            }else{
                const token = res.responseJson.data;
                const role = res.responseJson.data.role;
                const username = res.responseJson.data.username;
                AsyncStorage.setItem('role', JSON.stringify(role));
                AsyncStorage.setItem('user', JSON.stringify(token));
                AsyncStorage.setItem('devices', JSON.stringify(devices));
                AsyncStorage.setItem('username', JSON.stringify(username));            
                navigate("Menu")
            }
        })
        .catch((err) => {            
            this.setState({
                errorForm: true,
            })
            console.log('Error:', err);
        })        
    }
   
    render() {                
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle = "light-content"/>                
                <View style = {styles.logoContainer}>                                            
                    <View style = {styles.infoContainer}>                    
                        <Text style = {styles.title}>Verifikasi Via Sms</Text>
                        <Text style = {styles.titleNumber}> +62{this.state.noHp} </Text>                        

                        <Text style={styles.label}>Masukkan Kode :</Text>
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            keyboardType= 'number-pad'
                            onChangeText={(value) => {     
                                this.validate(value, 'value')                                  
                                this.setState({value})
                            }}                            
                        />                        
                        <Text style={{ display: this.state.errorValue ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>
                        <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12 }}>Kode OPT salah</Text>
                        {/* <Text style={styles.kirimUlang}>
                            Kirim ulang kode setelah : {this.state.time.m} : {this.state.time.s} 
                        </Text>                         */}
                        {this.viewTme()}
                        

                        <TouchableOpacity full style = {{backgroundColor: '#00A9DE', paddingVertical: 15, marginTop: 50, borderRadius: 10}}
                            onPress = {() => this.submitReg()}>
                            <Text style = {styles.buttonText}>Kirim</Text>
                        </TouchableOpacity>
                                                                   
                    </View>
                </View>                             
            </SafeAreaView>            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#254F6E',
        flexDirection: 'column',
    },
    logoContainer: {        
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 40,
    },    
    title: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',        
        opacity: 0.9,
        borderBottomColor: 'white',
        // borderBottomWidth: 3,
        // fontWeight: 'bold',
        // marginBottom: 20,
        marginLeft: 50,
        marginRight: 50
    },
    titleNumber:{
        color: 'white',
        fontSize: 20,
        textAlign: 'center',        
        opacity: 0.9,
        borderBottomColor: 'white',        
        marginLeft: 50,
        marginRight: 50,
        // marginBottom: 20,
    },
    input: {         
        height: 40,        
        color: '#FFF',
        paddingHorizontal: 10,                
        alignSelf: "stretch",
        borderBottomColor: 'white',
        borderBottomWidth: 1,        
    },

    infoContainer: {
        // position: 'absolute',
        left: 0,
        right: 0,
        height: 400,        
        padding: 20,                
        // borderRadius:10,        
    },    
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,        
    },    
    label:{
        color: 'white',
        marginTop: 50,        
    },
    kirimUlang: {
        padding: 10,
        fontSize: 10,
        color: 'white'
    }

})