import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity, InputScrollView,
    TextInput, SafeAreaView, ScrollView, AsyncStorage
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Resource from './network/Resource'

export default class Register extends Component {        
    static navigationOptions = {
        header: null
    };
        
    constructor(props){
        super(props);        
        const { navigate } = this.props.navigation;
        
        this.state = {
            nama: "",
            username: "",
            password: "",
            alamat: "",
            tanggalLahir: "",
            noHp: "",
            token: ""
        }          
    }         

    submitReg(){            
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
            alert('Username or Password is wrong')
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
        return (
            <SafeAreaView style = {styles.container}>                
                <StatusBar barStyle = "light-content"/>                
                <View style = {styles.logoContainer}>
                    {/* <Image style = {styles.logo}
                        source = {require('../images/logo.jpeg')}>
                    </Image> */}
                    <View style = {styles.infoContainer}>
                        <Text style = {styles.title}>Register</Text>
                        {/* <Text style={styles.instructions}>
                            Nama: {this.state.token}                            
                        </Text> */}
                        <TextInput style = {styles.input}
                            placeholder = "Nama"
                            placeholderTextColor = "rgba(255,255,255,0.8)"
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(nama) => this.setState({nama})}
                            // onChangeText = {(text) => this.updateValue(text, "keterangan")}
                        />
                        <TextInput style = {styles.input}
                            placeholder = "Username"
                            placeholderTextColor = "rgba(255,255,255,0.8)"                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(username) => this.setState({username})}
                        />
                        <TextInput style = {styles.input}
                            placeholder = "Password"
                            placeholderTextColor = "rgba(255,255,255,0.8)"                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(password) => this.setState({password})}
                        />
                        <TextInput style = {styles.input}
                            placeholder = "Alamat"
                            placeholderTextColor = "rgba(255,255,255,0.8)"                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(alamat) => this.setState({alamat})}
                        />
                        <TextInput style = {styles.input}
                            placeholder = "Tgl Lahir"
                            placeholderTextColor = "rgba(255,255,255,0.8)"                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(tanggalLahir) => this.setState({tanggalLahir})}
                        />
                        <TextInput style = {styles.input}
                            placeholder = "No. Telp"
                            placeholderTextColor = "rgba(255,255,255,0.8)"                            
                            returnKeyType = 'next'
                            autoCorrect = {false}
                            onChangeText={(noHp) => this.setState({noHp})}
                        />
                        <TouchableOpacity style = {styles.buttonContainer}
                            onPress={() => this.submitReg()}>
                            <Text style = {styles.buttonText}>Register</Text>
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
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    logoContainer: {        
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    // logo: {
    //     width: 128,
    //     height: 56
    // },
    title: {
        color: '#f7c744',
        fontSize: 40,
        textAlign: 'center',
        marginTop: 25,
        opacity: 0.9
    },
 
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        paddingHorizontal: 10,
        marginTop: 20,        
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
    }    
})