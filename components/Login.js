import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity,
    TextInput, SafeAreaView,AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import PushNotification from "react-native-push-notification";

export default class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);        

        this.state = {
            username: "",
            password: "",
            token: "",

            usernameValidate: true,
            passValidate:true,
            enableButton: false,
            disableButton: true,
            errorUsername: false,
            errorPass: false,
            textLabelError: false,
            textLabelSuccess: false,
            errorForm: false,
            tokenNotif : ''
        }
    }

    handleNotification(notification){
        //your logic here,
        console.warn(notification);
    
        let isBackground = notification.foreground;
        if(isBackground == true){
          this.props.navigation.navigate('Register');
        }
    };

    componentDidMount = async () => {
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

    validate(text, type) {  
        if (type == 'uname') {
            if(text == ''){
                this.setState({              
                    errorUsername: true
                })
            }else{
                this.setState({              
                    errorUsername: false
                })
            }            
        }
        else if (type == 'pass') {
            if(text == ''){
                this.setState({              
                    errorPass: true
                })
            }else{
                this.setState({              
                    errorPass: false
                })
            }            
        }              
    }

    val(){
        const { username, password } = this.state
        if ((username == "")) {
            this.setState({
                errorForm: true,
                errorUsername: true,                
            })            
        }
        if(password == ""){
            this.setState({
                errorForm: true,                
                errorPass: true,
            })            
        }
    }

    submitReg(){
        this.val();

        const { navigate } = this.props.navigation;
        let deviceID = this.state.tokenNotif
        let devices = deviceID.token
        // console.warn(devices)
        let body = new FormData();
        body.append('username', this.state.username);
        body.append('password', this.state.password);

        Resource.login(body, devices)
        .then((res) => {                
            console.log(res.responseJson.status)
            if(res.responseJson.status == 'failed'){
                this.setState({
                    errorForm: true,
                })
            }else{
                const token = res.responseJson.data;
                AsyncStorage.setItem('user', JSON.stringify(token));
                AsyncStorage.setItem('devices', JSON.stringify(devices));
                navigate("Menu")
            }
        })
        .catch((err) => {
            this.setState({
                errorForm: true,
            })
            console.log('Error:', error);
        })       
    }

    render() {        
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle = "light-content"/>                
                <View style = {styles.logoContainer}>                                            
                    <View style = {styles.infoContainer}>                    
                        <Text style = {styles.title}>Login Tobalobs</Text>
                        <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Username dan Password Salah</Text>

                        <Text style={styles.label}>Username</Text>
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(username) => {
                                this.validate(username, 'uname')
                                this.setState({username})
                            }}                            
                        />
                        <Text style={{ display: this.state.errorUsername ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>

                        <Text style={styles.label}>Password</Text>
                        <TextInput style = {styles.input}             
                            secureTextEntry
                            autoCorrect = {false}
                            onChangeText={(password) => {
                                this.validate(password, 'pass')
                                this.setState({password})
                            }}
                        />
                        <Text style={{ display: this.state.errorPass ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>

                        <TouchableOpacity full style = {{backgroundColor: '#f7c744', paddingVertical: 15, marginTop: 10}}
                            onPress = {() => this.submitReg()}>
                            <Text style = {styles.buttonText}>SIGN IN</Text>
                        </TouchableOpacity>
                                           
                        <Text style={styles.buttonReg}>
                            Anda belum mempunyai akun?
                            <Text>  </Text>                        
                            <Text style={{color: '#f7c744'}} onPress={() => navigate(
                                'Register'
                            )}>
                            Register
                            </Text>
                        </Text>        
                    </View>
                </View>                             
            </SafeAreaView>            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    logoContainer: {        
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },    
    title: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 20,
        opacity: 0.9,
        borderBottomColor: 'white',
        borderBottomWidth: 3,
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 50,
        marginRight: 50
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
        position: 'absolute',
        left: 0,
        right: 0,
        height: 380,        
        padding: 20,                
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15,
        marginTop: 10,         
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 15,        
    },
    buttonReg: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,        
        marginTop: 20,        
    },
    label:{
        color: 'white',
        marginTop: 20,        
    }

})