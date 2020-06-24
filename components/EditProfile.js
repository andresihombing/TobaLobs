import React, { Component } from 'react'
import {
    StyleSheet, Text, View, Image,
    StatusBar,TouchableOpacity, InputScrollView,
    TextInput, SafeAreaView, ScrollView, AsyncStorage
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import Resource from './network/Resource'
import I18n from '../i18n/i18n';

export default class EditProfile extends Component {            
        
    constructor(props){
        super(props);                
        
        this.state = {
            nama: "",
            username: "",            
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

    static navigationOptions = {
        title: 'Edit Profile'        
    };

    validate(text, type) {        
        if (type == 'name') {
            if(text == ''){
                this.setState({              
                    errorName: true
                })
            }else{
                this.setState({              
                    errorName: false
                })
            }            
        }
        else if (type == 'uname') {
            if(text == ''){
                this.setState({              
                    errorUname: true
                })
            }else{
                this.setState({              
                    errorUname: false
                })
            }            
        }               
        else if (type == 'alamat') {
            if(text == ''){
                this.setState({              
                    errorAlamat: true
                })
            }else{
                this.setState({              
                    errorAlamat: false
                })
            }            
        }
        else if (type == 'nohp') {
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
        else if (type == 'tgl') {
            if(text == ''){
                this.setState({              
                    errorTgl: true
                })
            }else{
                this.setState({              
                    errorTgl: false
                })
            }            
        }                              
    }    

    val(){
        const { nama, username, alamat, tanggalLahir, noHp } = this.state
        if ((username == "")) {
            this.setState({
                errorForm: true,
                errorUname: true,                
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

    componentDidMount() {        
        this.listEdit()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.listEdit()
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    listEdit(){
        const {params} = this.props.navigation.state;
        const name = params ? params.name : null;
        const username = params ? params.username : null;
        const alamat = params ? params.alamat : null;
        const noHp = params ? params.noHp : null;
        const tglLahir = params ? params.tglLahir : null;        
        console.log(name)

        this.setState({
            nama: name,
            alamat: alamat,
            tanggalLahir: tglLahir,
            username: username,
            noHp: noHp
        })
    }    

    submitReg = async () => {        
        this.val()
        let formdata = new FormData();
        formdata.append('nama', this.state.nama);
        formdata.append('username', this.state.username);
        formdata.append('fullname', this.state.nama);         
        formdata.append('noHp', this.state.noHp);
        formdata.append('tanggalLahir', this.state.tanggalLahir);
        formdata.append('alamat', this.state.alamat);   
        
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);                              
                Resource.edit_profile(formdata, tokenString)            
                .then((res) => {                                                               
                    if (this.state.errorForm != true) {                              
                        this.props.navigation.navigate('Akun');
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
    
    cek = async() => {
        await this.val()
        if (this.state.errorForm != true) {
            this.submitReg()
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
                            <Text style = {styles.title}>Edit Profile</Text>
                            <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>{I18n.t('hompage.errorprofile')}</Text>                            
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.nama')}</Text>
                                <TextInput style = {styles.input}                                    
                                    returnKeyType = 'next'
                                    value = {this.state.nama}
                                    autoCorrect = {false}
                                    onChangeText={(nama) => {
                                        this.validate(nama, 'name')
                                        this.setState({nama})
                                    }}                                    
                                />                                                            
                            </View>
                            <Text style={{ display: this.state.errorName ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.username')}</Text>
                                <TextInput style = {styles.input}                                                            
                                    returnKeyType = 'next'
                                    value = {this.state.username}
                                    autoCorrect = {false}
                                    onChangeText={(username) => {
                                        this.validate(username, 'uname')
                                        this.setState({username})
                                    }}                                    
                                />
                            </View>
                            <Text style={{ display: this.state.errorUname ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>                            

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.alamat')}</Text>
                                <TextInput style = {styles.input}                                                    
                                    returnKeyType = 'next'
                                    value = {this.state.alamat}
                                    autoCorrect = {false}
                                    onChangeText={(alamat) => {
                                        this.validate(alamat, 'alamat')
                                        this.setState({alamat})
                                    }}
                                />
                            </View>            
                            <Text style={{ display: this.state.errorAlamat ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>                                                        

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.nohp')}</Text>
                                <TextInput style = {styles.input}                                    
                                    returnKeyType = 'next'
                                    value = {this.state.noHp}
                                    autoCorrect = {false}
                                    keyboardType= 'number-pad'
                                    onChangeText={(noHp) => {
                                        this.validate(noHp, 'nohp')
                                        this.setState({noHp})
                                    }}
                                />
                            </View>
                            <Text style={{ display: this.state.errorNo ? "flex" : "none", color: 'red', fontSize: 12 }}>{I18n.t('hompage.errornull')}</Text>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>{I18n.t('hompage.tgllahir')}</Text>
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
                                        dateInput: { 
                                          borderWidth: 0,
                                        //   borderBottomWidth: 2
                                        },
                                        placeholderText: {
                                          fontSize: 15,
                                          color: "#C7C7C7"
                                        },
                                        dateText: {
                                          fontSize: 15,
                                          color: "white",
                                          textAlign: "left"
                                        }
                                      }}            
                                    onDateChange={(date) => { 
                                        this.validate(date, 'tgl')
                                        this.setState({ tanggalLahir: date }) 
                                    }}
                                />
                            </View>                     
                            <Text style={{ color: 'red', fontSize: 12, display: this.state.errorTgl ? "flex" : "none"}}>{I18n.t('hompage.errornull')}</Text>   
                            <TouchableOpacity style = {styles.buttonContainer}
                                onPress={() => this.cek()}>
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