import React, { Component } from 'react'
import {
    StyleSheet, Text, View, ScrollView,
    StatusBar,TouchableOpacity,
    TextInput, Alert,AsyncStorage
} from 'react-native'
import Resource from './network/Resource'

export default class TambahPanduan extends Component {

    static navigationOptions = ({navigation}) => ({
        title: 'Tambah Panduan'
    })

    constructor(props){
        super(props);        

        this.state = {
            judul: '',
            penjelasan: '',
            errorJudul: false,
            errorPenjelasan: false,
            errorForm: false,
        }
    }        

    validate(text, type) {        
        if (type == 'judul') {
            if(text == ''){
                this.setState({              
                    errorJudul: true
                })
            }else{
                this.setState({              
                    errorJudul: false
                })
            }            
        }
        else if (type == 'penjelasan') {
            if(text == ''){
                this.setState({              
                    errorPenjelasan: true
                })
            }else{
                this.setState({              
                    errorPenjelasan: false
                })
            }            
        }                                              
    }

    val(){
        const { judul, penjelasan,} = this.state
        if ((judul == "")) {
            this.setState({
                errorForm: true,
                errorJudul: true,                
            })            
        }        
        if(penjelasan == ""){
            this.setState({
                errorForm: true,                
                errorPenjelasan: true,
            })            
        }        
    }

    submitReg = async () => {           
        // console.log(this.state.judul)     
        let formdata = new FormData();
        formdata.append('judul', this.state.judul);
        formdata.append('penjelasan', this.state.penjelasan);
        
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);                           
                Resource.create_panduan(formdata, tokenString)            
                .then((res) => {                                                                                   
                    console.log(res)
                    Alert.alert(
                        '',
                        `Berhasil menambah informasi`
                    )
                    this.props.navigation.navigate('ManagePanduan');        
                })
                .catch((err) => {                    
                    console.warn('Error:', err);
                })  
            });   
        } catch (error) {            
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
        return (
            <View style={styles.container}>
                <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Lengkapi form dengan baik</Text>
                <ScrollView>
                    <Text style={styles.label}>Judul</Text>
                    <View style={styles.textAreaContainer} >                    
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'                      
                            placeholder="Masukkan Judul Panduan"  
                            placeholderTextColor="grey"
                            autoCorrect = {false}
                            onChangeText={(judul) => {                            
                                this.setState({judul})
                            }}                            
                        />
                    </View>
                    <Text style={{ display: this.state.errorJudul ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

                    <Text style={styles.label}>Keterangan</Text>
                    <View style={styles.textAreaContainer} >
                        <ScrollView>
                        <TextInput
                        style={styles.textArea}                    
                        underlineColorAndroid="transparent"
                        placeholder="Berikan Keterangan"
                        textAlignVertical='top'
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(penjelasan) => {                        
                            this.setState({penjelasan})
                        }}   
                        />
                        </ScrollView>
                    </View>
                    <Text style={{ display: this.state.errorPenjelasan ? "flex" : "none", color: 'red', fontSize: 12 }}>From tidak boleh kosong</Text>

                    <TouchableOpacity full style = {{backgroundColor: '#00A9DE', paddingVertical: 15, marginTop: 10, borderRadius: 10}}
                        onPress = {() => this.cek()}>
                        <Text style = {styles.buttonText}>Tambah</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#254F6E',
        flexDirection: 'column',
        padding: 9
    },
    textAreaContainer: {       
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        padding: 5
    },
    textArea: {
      height: 300,
      justifyContent: "flex-start",      
    },
    label: {
        color: 'white',
        padding: 4
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,        
    },
  })