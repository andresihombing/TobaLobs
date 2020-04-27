import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity, InputScrollView,
    TextInput, SafeAreaView, ScrollView, AsyncStorage
} from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';

import Resource from './network/Resource'

export default class Register extends Component {        
    static navigationOptions = {
        title: 'Edit Tambak'        
    };
        
    constructor(props){
        super(props);                
        const {params} = this.props.navigation.state;
        const tambakId = params ? params.tambakId : null;
        const namaTambak = params ? params.namaTambak : null;
        const panjang = params ? params.panjang : null;
        const lebar = params ? params.lebar : null;
        const jenisBudidaya = params ? params.jenisBudidaya : null;
        const usiaLobster = params ? params.usiaLobster : null;        
        
        this.state = {
            namaTambak : namaTambak,
            panjang: panjang,
            lebar : lebar,
            jenisBudidaya : jenisBudidaya,
            usiaLobster : usiaLobster,
            tambakId: tambakId,

            errorNama: false,
            errorPanjang: false,
            errorLebar: false, 
            errorJenis: false,
            errorUsia: false,            
            errorForm: false,

            list_tambak: [],

            data: [{
                value: 'pembesaran',
                label: 'Pembesaran'
              }, {
                value: 'pembenihan',
                label: 'Pembenihan'
            }],
        }        
    }    

    validate(text, type) {        
        if (type == 'nama') {
            if(text == ''){
                this.setState({              
                    errorNama: true
                })
            }else{
                this.setState({              
                    errorNama: false
                })
            }            
        }
        if (type == 'panjang') {
            if(text == ''){
                this.setState({              
                    errorPanjang: true
                })
            }else{
                this.setState({              
                    errorPanjang: false
                })
            }            
        }
        if (type == 'lebar') {
            if(text == ''){
                this.setState({              
                    errorLebar: true
                })
            }else{
                this.setState({              
                    errorLebar: false
                })
            }            
        }
        if (type == 'jenis') {                        
            if(text == ''){
                this.setState({              
                    errorJenis: true
                })
            }else{
                this.setState({              
                    errorJenis: false
                })
            }            
        }
        if (type == 'usia') {
            if(text == ''){
                this.setState({              
                    errorUsia: true
                })
            }else{
                this.setState({              
                    errorUsia: false
                })
            }            
        }
    }

    submitReg(){
        const { namaTambak, panjang, lebar, jenisBudidaya, usiaLobster} = this.state
        if ((namaTambak == "")) {
            this.setState({
                errorForm: true,
                errorNama: true,                
            })
            this.props.navigation.navigate('EditTambak')
        }else {
            this.props.navigation.navigate('KebutuhanEditTambak', {
                tambakId: this.state.tambakId,
                namaTambak : this.state.namaTambak,
                panjang : this.state.panjang,
                lebar : this.state.lebar,
                jenisBudidaya : this.state.jenisBudidaya,
                usiaLobster : this.state.usiaLobster
            })
        }
        if(panjang == ""){
            this.setState({
                errorForm: true,                
                errorPanjang: true,
            })            
            this.props.navigation.navigate('EditTambak')
        }else {
            this.props.navigation.navigate('KebutuhanEditTambak', {
                tambakId: this.state.tambakId,
                namaTambak : this.state.namaTambak,
                panjang : this.state.panjang,
                lebar : this.state.lebar,
                jenisBudidaya : this.state.jenisBudidaya,
                usiaLobster : this.state.usiaLobster
            })
        }
        if(lebar == ""){
            this.setState({
                errorForm: true,                
                errorLebar: true,
            })            
            this.props.navigation.navigate('EditTambak')
        }else {
            this.props.navigation.navigate('KebutuhanEditTambak', {
                tambakId: this.state.tambakId,
                namaTambak : this.state.namaTambak,
                panjang : this.state.panjang,
                lebar : this.state.lebar,
                jenisBudidaya : this.state.jenisBudidaya,
                usiaLobster : this.state.usiaLobster
            })
        }      
        if(jenisBudidaya == ""){
            this.setState({
                errorForm: true,                
                errorJenis: true,
            })            
            this.props.navigation.navigate('EditTambak')
        }else {
            this.props.navigation.navigate('KebutuhanEditTambak', {
                tambakId: this.state.tambakId,
                namaTambak : this.state.namaTambak,
                panjang : this.state.panjang,
                lebar : this.state.lebar,
                jenisBudidaya : this.state.jenisBudidaya,
                usiaLobster : this.state.usiaLobster
            })
        }
        if(usiaLobster == ""){
            this.setState({
                errorForm: true,                
                errorUsia: true,
            })            
            this.props.navigation.navigate('EditTambak')
        }else {
            this.props.navigation.navigate('KebutuhanEditTambak', {
                tambakId: this.state.tambakId,
                namaTambak : this.state.namaTambak,
                panjang : this.state.panjang,
                lebar : this.state.lebar,
                jenisBudidaya : this.state.jenisBudidaya,
                usiaLobster : this.state.usiaLobster
            })
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
                            <Text style = {styles.title}>Edit Tambak</Text>
                            <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Edit Tambak vailed</Text>                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Nama Tambak</Text>
                                <TextInput style = {styles.input}                                    
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    value = {this.state.namaTambak}                                    
                                    onChangeText={(namaTambak) => {
                                        this.validate(namaTambak, 'nama')
                                        this.setState({namaTambak})
                                    }}                                    
                                />                                                            
                            </View>
                            <Text style={{ display: this.state.errorNama ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Panjang Tambak</Text>
                                <TextInput style = {styles.input}                                    
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    value = {this.state.panjang.toString()}
                                    keyboardType= 'number-pad'
                                    onChangeText={(panjang) => {
                                        this.validate(panjang, 'panjang')
                                        this.setState({panjang})
                                    }}                                    
                                />                                                            
                            </View>
                            <Text style={{ display: this.state.errorPanjang ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Lebar Tambak</Text>
                                <TextInput style = {styles.input}                                            
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    value = {this.state.lebar.toString()}
                                    keyboardType= 'number-pad'
                                    onChangeText={(lebar) => {
                                        this.validate(lebar, 'lebar')
                                        this.setState({lebar})
                                    }}                                    
                                />
                            </View>
                            <Text style={{ display: this.state.errorLebar ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>
                            
                            
                            <View style={styles.rowContainer}>
                            <Text style={styles.label}>Jenis Tambak</Text>
                            <Dropdown
                                value={this.state.label}
                                data={this.state.data}
                                pickerStyle={{borderBottomColor:'transparent',borderWidth: 0}}
                                containerStyle = {styles.dropdown}
                                selectedItemColor = 'black'
                                textColor= 'white'
                                value = {this.state.jenisBudidaya}
                                baseColor = 'white'                                
                                onChangeText={(value)=> {
                                    this.validate(value, 'jenis')
                                    this.setState({ jenisBudidaya : value })                                     
                            }}
                            />
                            </View>
                            <Text style={{ display: this.state.errorJenis ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>
                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Usia</Text>
                                <TextInput style = {styles.input}                                                 
                                    returnKeyType = 'next'
                                    autoCorrect = {false}
                                    value = {this.state.usiaLobster.toString()}
                                    keyboardType= 'number-pad'
                                    onChangeText={(usiaLobster) => {
                                        this.validate(usiaLobster, 'usia')
                                        this.setState({usiaLobster})                                                                           
                                    }}
                                />
                            </View>            
                            <Text style={{ display: this.state.errorUsia ? "flex" : "none", color: 'red', fontSize: 12 }}>Tidak boleh kosong</Text>                                                        
                             
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
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    dropdown: {
        flex: 2,
        height: 90,
        width: 700,                
        color: 'white',        
        borderBottomColor: 'white',        
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
        borderBottomWidth: 1
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
    }
})