import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity, InputScrollView,
    TextInput, SafeAreaView, ScrollView, AsyncStorage
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Resource from './network/Resource'

export default class Register extends Component {        
    static navigationOptions = {
        header: null
    };
        
    constructor(props){
        super(props);                
        
        this.state = {
            nama: "",
            username: "",
            password: "",
            alamat: "",
            tanggalLahir: "",
            noHp: "",
            token: "",

            errorName: false,
            errorUname: false,
            errorPass: false, 
            errorAlamat: false,
            errorNo: false,
            errorTgl: false,
            errorForm: false,
            errorPassCar: false
        }          
    }         

    validate(text, type) {
        alph = /^[a-zA-Z" "]+$/
        error = /^[""]+$/
        if (type == 'name') {
          if (alph.test(text) && !error.test(text)) {
            this.setState({              
              errorName: false
            })
          } else {
            this.setState({              
              errorName: true
            })
          }
        }
        else if (type == 'uname') {            
            this.setState({                    
                errorUname: false
            })
        }
        else if (type == 'pass') {   
            // console.warn(text.length)
            this.setState({                    
                errorPass: false
            })
            if(text.length > 6){
                this.setState({                    
                    errorPassCar: false
                })
            }else{
                this.setState({                    
                    errorPassCar: true
                })
            }
            
        }
        else if (type == 'alamat') {            
            this.setState({                    
                errorAlamat: false
            })
        }
        else if (type == 'nohp') {                        
            this.setState({                    
                errorNo: false
            })            
        }
        else if (type == 'tgl') {        
            this.setState({                    
                errorTgl: false
            })
        }        
    }

    val(){
        const { nama, username, password, alamat, tanggalLahir, noHp } = this.state
        if ((username == "")) {
            this.setState({
                errorForm: true,
                errorUname: true,                
            })            
        }
        if(password == ""){
            this.setState({
                errorForm: true,                
                errorPass: true,
            })            
        }
        if(alamat == ""){
            this.setState({
                errorForm: true,                
                errorAlamat: true,
            })            
        }
        if(tanggalLahir == ""){
            this.setState({
                errorForm: true,                
                errorTgl: true,
            })            
        }
        if(noHp == ""){
            this.setState({
                errorForm: true,                
                errorNo: true,
            })            
        }
        if(nama == ""){
            this.setState({
                errorForm: true,                
                errorName: true,
            })            
        }
    }

    submitReg(){         
        this.val();          
        const { navigate } = this.props.navigation;        
        let formdata = new FormData();
        formdata.append('username', this.state.username);
        formdata.append('fullname', this.state.nama);
        formdata.append('password', this.state.password);        
        formdata.append('noHp', this.state.noHp);
        formdata.append('tanggalLahir', this.state.tanggalLahir);
        formdata.append('alamat', this.state.alamat);
        
        Resource.register(formdata)
        .then((res) => {                
            console.log(res.responseJson.data)
            const token = res.responseJson.data;
            AsyncStorage.setItem('user', JSON.stringify(token));                        
            navigate("Menu")
        })
        .catch((err) => {
            // alert('Username or Password is wrong')
            this.setState({
                errorForm: true,
            })
            console.log('Error:', error);
        })
        // fetch('http://10.42.0.84:8000/user/register', {
        //     method: 'POST', // or 'PUT'
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //     },
        //     body: formdata,
        // })        
        // .then((response) => response.json())
        // .then((data) => {    
        //     console.log(data);
        //     let token = data.data.token;        
        //     let dataToken = {
        //         token: token,
        //     }
        //     AsyncStorage.setItem('user', JSON.stringify(dataToken));                        
        //     navigate("Menu")
                        
        // })
        // .catch((error) => {
        //     console.log('Error:', error);
        // });        
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
                    {/* <Image style = {styles.logo}
                        source = {require('../images/logo.jpeg')}>
                    </Image> */}
                    <ScrollView>
                        <View style = {{marginBottom:10}}>                    
                            <Text style = {styles.title}>Register Tobalobs</Text>
                            <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Register vailed</Text>
                            {/* <Text style={styles.instructions}>
                                Nama: {this.state.token}                            
                            </Text> */}
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Nama</Text>
                                <TextInput style = {styles.input}
                                    // placeholder = "Nama"
                                    // placeholderTextColor = "rgba(255,255,255,0.8)"
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    onChangeText={(nama) => {
                                        this.validate(nama, 'name')
                                        this.setState({nama})
                                    }}
                                    // onChangeText = {(text) => this.updateValue(text, "keterangan")}
                                />                                                            
                            </View>
                            <Text style={{ display: this.state.errorName ? "flex" : "none", color: 'red', fontSize: 12 }}>Form must be alphabet and not Empty</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput style = {styles.input}
                                    // placeholder = "Username"
                                    // placeholderTextColor = "rgba(255,255,255,0.8)"                            
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    onChangeText={(username) => {
                                        this.validate(username, 'uname')
                                        this.setState({username})
                                    }}
                                    // onChangeText={(username) => this.setState({username})}
                                />
                            </View>
                            <Text style={{ display: this.state.errorUname ? "flex" : "none", color: 'red', fontSize: 12 }}>Form must be alphabet and not Empty</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput style = {styles.input}
                                    // placeholder = "Password"
                                    // placeholderTextColor = "rgba(255,255,255,0.8)"                            
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    onChangeText={(password) => {
                                        this.validate(password, 'pass')
                                        this.setState({password})
                                    }}
                                />
                            </View>
                            <Text style={{ display: this.state.errorPassCar ? "flex" : "none", color: 'red', fontSize: 12 }}>Password miniman 6 karakter</Text>
                            <Text style={{ display: this.state.errorPass ? "flex" : "none", color: 'red', fontSize: 12 }}>Form must be alphabet and not Empty</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Alamat</Text>
                                <TextInput style = {styles.input}
                                    // placeholder = "Alamat"
                                    // placeholderTextColor = "rgba(255,255,255,0.8)"                            
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    onChangeText={(alamat) => {
                                        this.validate(alamat, 'alamat')
                                        this.setState({alamat})
                                    }}
                                />
                            </View>            
                            <Text style={{ display: this.state.errorAlamat ? "flex" : "none", color: 'red', fontSize: 12 }}>Form must be alphabet and not Empty</Text>                            
                            {/* <TextInput style = {styles.input}
                                placeholder = "Tgl Lahir"
                                placeholderTextColor = "rgba(255,255,255,0.8)"                            
                                returnKeyType = 'next'
                                autoCorrect = {false}
                                onChangeText={(tanggalLahir) => this.setState({tanggalLahir})}
                            /> */}

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>No.Telp</Text>
                                <TextInput style = {styles.input}
                                    // placeholder = "No. Telp"
                                    // placeholderTextColor = "rgba(255,255,255,0.8)"                            
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    onChangeText={(noHp) => {
                                        this.validate(noHp, 'nohp')
                                        this.setState({noHp})
                                    }}
                                />
                            </View>
                            <Text style={{ display: this.state.errorNo ? "flex" : "none", color: 'red', fontSize: 12 }}>Form must be alphabet and not Empty</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Tgl Lahir</Text>
                                <DatePicker
                                    style={styles.input}
                                    date={this.state.tanggalLahir}
                                    mode="date"
                                    placeholder={this.state.tanggalLahir ? this.state.tanggalLahir : "Tanggal Lahir"}
                                    format="D MMMM YYYY"
                                    minDate="1970-05-01"
                                    maxDate={dateNow}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"                                
                                    // iconSource={require("../assets/images/calendar.png")}
                                    customStyles={{
                                        dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 5,
                                        marginLeft: 0,
                                        height: 30,
                                        width: 28
                                        },
                                        dateInput: {
                                            marginLeft: -9,
                                            marginRight: -9
                                        }
                                    }}
                                    // onDateChange={(date) => {
                                    //     this.validate(tanggalLahir, 'tgl')
                                    //     this.setState({tanggalLahir: date})
                                    // }}
                                    onDateChange={(date) => { 
                                        this.validate(date, 'tgl')
                                        this.setState({ tanggalLahir: date }) 
                                    }}
                                />
                            </View>                     
                            <Text style={{ color: 'red', fontSize: 12, display: this.state.errorTgl ? "flex" : "none"}}>Form must be alphabet and not Empty</Text>   
                            <TouchableOpacity style = {styles.buttonContainer}
                                onPress={() => this.submitReg()}>
                                <Text style = {styles.buttonText}>Register</Text>
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
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    logoContainer: {        
        // alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        // left:0,
        // right:0
    },
    rowContainer: {
        flex: 1,         
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      },
    // logo: {
    //     width: 128,
    //     height: 56
    // },
    title: {        
        color: 'white',
        textAlign: 'bold',   
        fontSize: 30,
        textAlign: 'center',
        marginTop: 30,
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
        // paddingHorizontal: 90,
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },

    infoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 600,        
        padding: 20
        // backgroundColor: 'red'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15,
        marginTop: 15
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 15,
    },
    label:{
        flex: 1,
        color: 'white',
        // marginTop: 10,        
    }
})