import React, { Component } from 'react'
import {
    StyleSheet, Text, View, ScrollView,
    Alert,TouchableOpacity,
    TextInput, Button,AsyncStorage
} from 'react-native'
import Resource from './network/Resource'

export default class EditPanduan extends Component {

    static navigationOptions = ({navigation}) => {        
        const { state } = navigation
        return {
            headerTitle: 'Edit Sensor',            
          }
    }

    constructor(props){
        super(props);        

        this.state = {
            id: '',
            tipe: '',
            nilai: '',
            aksi: '',
            kondisi: '',
            errorNilai: false,
            errorAksi: false,
            errorForm: false,
        }
    }    

    validate(text, type) {        
        if (type == 'nilai') {
            if(text == ''){
                this.setState({              
                    errorNilai: true
                })
            }else{
                this.setState({              
                    errorNilai: false
                })
            }            
        }
        else if (type == 'aksi') {
            if(text == ''){
                this.setState({              
                    errorAksi: true
                })
            }else{
                this.setState({              
                    errorAksi: false
                })
            }            
        }                                              
    }

    val(){
        const { nilai, aksi,} = this.state
        if ((nilai == "")) {
            this.setState({
                errorForm: true,
                errorNilai: true,                
            })            
        }        
        if(aksi == ""){
            this.setState({
                errorForm: true,                
                errorAksi: true,
            })            
        }        
    }
    
    componentDidMount(){
        const {params} = this.props.navigation.state;
        const id = params ? params.id : null;  
        const tipe = params ? params.tipe : null;  
        const nilai = params ? params.nilai : null;  
        const aksi = params ? params.aksi : null;  
        const kondisi = params ? params.kondisi : null;          
        var kon = kondisi.split(" ")
        var kond = kon[0]+' '+kon[1]
        this.setState({
            id: id,
            tipe: tipe,
            nilai: nilai,
            aksi: aksi,
            kondisi: kond
        })
    }

    edit(){
        Alert.alert(
            "",
            "Apakah anda yakin ingin mengedit sensor ?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.submitReg() }
            ],
            { cancelable: false }
          );
    }

    cek = async() => {
        await this.val()
        this.setState({
            kondisi : this.state.kondisi+' '+this.state.nilai
        })
        if (this.state.errorForm != true) {
            this.edit()
        }
    }

    submitReg = async () => {                
        let formdata = new FormData();
        formdata.append('aksiPenyimpangan', this.state.aksi);
        formdata.append('nilai', this.state.nilai);
        formdata.append('tipe', this.state.tipe);
        formdata.append('kondisi', this.state.kondisi);
                
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);
                let id = this.state.id              
                Resource.edit_sensor(formdata, tokenString, id)            
                .then((res) => {                                                                                   
                    console.log(res)
                    this.props.navigation.navigate('ManageSensor');        
                })
                .catch((err) => {                    
                    console.warn('Error:', error);
                })  
            });   
        } catch (error) {            
            console.log('AsyncStorage error: ' + error.message);
        }                
    }

    render() {                        
        return (
            <View style={styles.container}>
                <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Lengkapi form dengan baik</Text>
                <ScrollView>
                    <Text style={styles.label}>Nilai</Text>
                    <View style={styles.textAreaContainer} >                    
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            placeholder="Masukkan Nilai Sensor"  
                            placeholderTextColor="grey"
                            keyboardType= 'number-pad'
                            value = {this.state.nilai}
                            autoCorrect = {false}
                            onChangeText={(nilai) => {                            
                                this.setState({nilai})
                            }}                            
                        />
                    </View>
                    <Text style={{ display: this.state.errorNilai ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

                    <Text style={styles.label}>Aksi Penyimpangan</Text>
                    <View style={styles.textAreaContainer} >
                        <ScrollView>
                        <TextInput
                        style={styles.textArea}
                        value= {this.state.aksi}
                        underlineColorAndroid="transparent"
                        textAlignVertical='top'
                        placeholder="Berikan Aksi Penyimpangan"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(aksi) => {                        
                            this.setState({aksi})
                        }}   
                        />
                        </ScrollView>
                    </View>
                    <Text style={{ display: this.state.errorAksi ? "flex" : "none", color: 'red', fontSize: 12 }}>From tidak boleh kosong</Text>

                    <TouchableOpacity full style = {{backgroundColor: '#00A9DE', paddingVertical: 15, marginTop: 10, borderRadius: 10}}
                        onPress = {() => this.cek()}>
                        <Text style = {styles.buttonText}>Edit</Text>
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
      justifyContent: "flex-start"
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
    right: {
        padding: 7
    }
  })
  