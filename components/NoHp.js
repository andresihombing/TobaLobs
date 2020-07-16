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
            username: "",            
            noHp: "",                        
            errorNo: false
        };        
      }         
    
    componentDidMount() {        
        
    }    
      
    setStateAsync(state) {
        return new Promise((resolve) => {
          this.setState(state, resolve)
        });
    }      
    
    validate(text, type) {        
        if (type == 'noHp') {
            if(text == ''){
                this.setState({              
                    errorNo: true
                })
            }else{
                this.setState({              
                    errorNo: false
                })
            }            
        }                               
    }

    submitReg = async() => {         
        const { navigate } = this.props.navigation;
        var noHp = `+62${this.state.noHp}`        
        let formdata = new FormData();        
        formdata.append('noHp', noHp);        
        formdata.append('type', 'forgot');        
        
        Resource.verify(formdata)
        .then((res) => {                
            console.log(res.responseJson.data)            
            // const token = res.responseJson.data;
            // AsyncStorage.setItem('user', JSON.stringify(token));
            console.log(this.state.noHp)
            if(this.state.noHp == ''){
                this.setState({              
                    errorNo: true
                })
            }else{
                navigate("VerifikasiForgot",{
                    token: res.responseJson.data,
                    noHp: this.state.noHp
                })
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
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle = "light-content"/>                
                <View style = {styles.logoContainer}>                                            
                    <View style = {styles.infoContainer}>                                            

                        <Text style={styles.titleNumber}>Masukkan Nomor Hp :</Text>
                        <View style = {styles.nomor}>
                            <TextInput style = {styles.input1}>+62</TextInput>                          
                            <TextInput style = {styles.input2}                            
                                returnKeyType = 'next'
                                autoCorrect = {false}
                                keyboardType= 'number-pad'
                                onChangeText={(noHp) => {        
                                    this.validate(noHp, 'noHp')                                      
                                    this.setState({noHp})
                                }}                            
                            />                        
                        </View>
                        <Text style={{ display: this.state.errorNo ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>
                        <Text style={styles.kirimUlang}>
                            Kode reset password akan dikirim ke nomor diatas
                        </Text>                                  

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
        marginTop: 60,
    },        
    titleNumber:{
        color: 'white',
        fontSize: 20,
        textAlign: 'center',        
        opacity: 0.9,
        borderBottomColor: 'white',        
        marginLeft: 50,
        marginRight: 50,
        
    },
    input1: {         
        height: 60,        
        color: '#FFF',
        paddingHorizontal: 10,                
        alignSelf: "stretch",
        borderBottomColor: 'white',
        borderBottomWidth: 1,        
        width: '20%'
    },
    input2: {         
        height: 60,        
        color: '#FFF',
        paddingHorizontal: 10,                
        alignSelf: "stretch",
        borderBottomColor: 'white',
        borderBottomWidth: 1,        
        width: '80%'
    },
    infoContainer: {
        // position: 'absolute',
        // flex: 1,
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
        paddingTop: 20,        
        fontSize: 12,
        color: 'white'
    }, 
    nomor: {
        flexDirection: 'row',
        justifyContent: "space-between",
    }
    
})