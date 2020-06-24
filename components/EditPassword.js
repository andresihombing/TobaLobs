import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity, InputScrollView,
    TextInput, SafeAreaView, ScrollView, AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import I18n from '../i18n/i18n';
// import AwesomeAlert from 'react-native-awesome-alerts';

export default class EditProfile extends Component {            
        
    constructor(props){
        super(props);                
        
        this.state = {
            passLama: "",
            passBaru: "",            
            passKonfirm: "",            
            
            errorPassLama: false,
            errorPassBaru: false,
            errorPassKonfirm: false,             
            errorForm: false,
            errorPassCarLama: false,
            errorPassCarBaru: false,
            errorPassCarKonfirm: false
        }          
    }         

    static navigationOptions = {
        title: 'Edit Password'
    };

    validate(text, type) {        
        if (type == 'passLama') {
            if(text == ''){
                this.setState({              
                    errorPassLama: true
                })
            }else{
                this.setState({              
                    errorPassLama: false
                })
                if(text.length > 6){
                    this.setState({                    
                        errorPassCarLama: false
                    })
                }else{
                    this.setState({                    
                        errorPassCarLama: true
                    })
                }
            }            
        }
        else if (type == 'passBaru') {
            if(text == ''){
                this.setState({              
                    errorPassBaru: true
                })
            }else{
                this.setState({              
                    errorPassBaru: false
                })
                if(text.length > 6){
                    this.setState({                    
                        errorPassCarBaru: false
                    })
                }else{
                    this.setState({                    
                        errorPassCarBaru: true
                    })
                }
            }            
        }               
        else if (type == 'passKonfrim') {
            if(text == ''){
                this.setState({              
                    errorPassKonfirm: true
                })
            }else{
                this.setState({              
                    errorPassKonfirm: false
                })
                if(text.length > 6){
                    this.setState({                    
                        errorPassCarKonfirm: false
                    })
                }else{
                    this.setState({                    
                        errorPassCarKonfirm: true
                    })
                }
            }            
        }                         
    }    

    val(){
        const { passLama, passBaru, passKonfirm } = this.state
        if ((passLama == "")) {
            this.setState({
                errorForm: true,
                errorPassLama: true,                
            })            
        }        
        if(passBaru == ""){
            this.setState({
                errorForm: true,                
                errorPassBaru: true,
            })            
        }
        if(passKonfirm == ""){            
            this.setState({
                errorForm: true,                
                errorPassKonfirm: true,
            })            
        }        
    }    

    componentDidMount() {                
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {                  
        });
    }

    componentWillUnmount() {        
        this.focusListener.remove();        
    }    

    submitReg = async () => {                        
        this.val();
        let formdata = new FormData();
        formdata.append('password', this.state.passLama);
        formdata.append('newPassword', this.state.passBaru);
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);                              
                Resource.edit_pass(formdata, tokenString)            
                .then((res) => {                                                                                   
                    if (this.state.errorForm != true) {         
                        alert(I18n.t('hompage.berhasilgantipass'));                                             
                        this.props.navigation.navigate('Pengaturan');                        
                    }
                    this.setState({
                        errorForm: false,
                    })
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

    render() {  
        var dateNow = new Date().getDate();              
        return (            
            <SafeAreaView style = {styles.container}>                
            <Text style={{color:'red', textAlign:'center'}}>
            {this.state.Error}
            </Text>
                <StatusBar barStyle = "light-content"/>
                <View style = {styles.logoContainer}>                    
                    <ScrollView>
                        <View style = {{marginBottom:10}}>                    
                            <Text style = {styles.title}>Edit Password</Text>
                            <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>{I18n.t('hompage.errorprofile')}</Text>                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.passlama')} :</Text>
                                <TextInput style = {styles.input}                                    
                                    returnKeyType = 'next'
                                    secureTextEntry                                    
                                    autoCorrect = {false}
                                    onChangeText={(passLama) => {
                                        this.validate(passLama, 'passLama')
                                        this.setState({passLama})
                                    }}                                    
                                />                                                            
                            </View>
                            <Text style={{ display: this.state.errorPassLama ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>
                            <Text style={{ display: this.state.errorPassCarLama ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.mincar')}</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.passbaru')} :</Text>
                                <TextInput style = {styles.input}                                                            
                                    returnKeyType = 'next'
                                    secureTextEntry
                                    value = {this.state.username}
                                    autoCorrect = {false}
                                    onChangeText={(passBaru) => {
                                        this.validate(passBaru, 'passBaru')
                                        this.setState({passBaru})
                                    }}                                    
                                />
                            </View>
                            <Text style={{ display: this.state.errorPassBaru ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>   
                            <Text style={{ display: this.state.errorPassCarBaru ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.mincar')}</Text>                         

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.passkonfirm')} :</Text>
                                <TextInput style = {styles.input}                                                    
                                    returnKeyType = 'next'
                                    secureTextEntry
                                    value = {this.state.alamat}
                                    autoCorrect = {false}
                                    onChangeText={(passKonfirm) => {
                                        this.validate(passKonfirm, 'passKonfirm')
                                        this.setState({passKonfirm})
                                    }}
                                />
                            </View>            
                            <Text style={{ display: this.state.errorPassKonfirm ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>     
                            <Text style={{ display: this.state.errorPassCarKonfirm ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.mincar')}</Text>                                                   
                            
                            <TouchableOpacity style = {styles.buttonContainer}
                                onPress={() => this.submitReg()}>
                                <Text style = {styles.buttonText}>Edit</Text>
                            </TouchableOpacity>                                                                  
                        </View>
                    </ScrollView>
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
        flex: 1,
        marginLeft: 20,
        marginRight: 20,        
    },
    rowContainer: {
        flex: 1,         
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      },    
    title: {        
        color: 'white',
        textAlign: 'bold',   
        fontSize: 30,
        textAlign: 'center',        
        marginBottom: 20,
        opacity: 0.9,
        borderBottomColor: 'white',        
        borderBottomWidth: 3,
        fontWeight: 'bold',
        marginLeft: 35,
        marginRight: 35
    },
 
    input: {    
        flex: 2,
        height: 50,
        width: 300,        
        color: 'white',        
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        paddingRight: 20
    },

    infoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 600,        
        padding: 20        
    },
    buttonContainer: {
        backgroundColor: '#00A9DE',
        paddingVertical: 15,
        marginTop: 15,
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    label:{
        flex: 1,
        color: 'white',
    }
})