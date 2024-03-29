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
            headerTitle: 'Edit Panduan',
            headerRight: <View style={styles.right}><Button title="Hapus" onPress={() => state.params.handleSave()} /></View>,
          }
    }

    constructor(props){
        super(props);        

        this.state = {
            judul: '',
            penjelasan: '',
            panduanID: '',
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

    componentDidMount(){
        const {params} = this.props.navigation.state;
        const panduanID = params ? params.panduanID : null;  
        const judul = params ? params.judul : null;  
        const penjelasan = params ? params.penjelasan : null;                  
        this.setState({
            panduanID: panduanID,
            judul: judul,
            penjelasan: penjelasan
        })
        this.props.navigation.setParams({ handleSave: () => this.deletePanduan() })
    }

    deletePanduan() {
        Alert.alert(
            "",
            "Apakah anda yakin ingin menghapus panduan ?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.submitDelete() }
            ],
            { cancelable: false }
          );        
    }

    submitDelete = async() => {
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);
                let id = this.state.panduanID     
                console.log(id)           
                Resource.delete_panduan(tokenString, id)
                .then((res) => {                                                                                   
                    console.log(res)
                    Alert.alert(
                        '',
                        `Berhasil menghapus panduan`
                    )
                    this.props.navigation.navigate('ManagePanduan');        
                })
                .catch((err) => {                    
                    console.warn('Error:', error);
                })  
            });   
        } catch (error) {            
            console.log('AsyncStorage error: ' + error.message);
        }       
    }

    submitReg = async () => {                
        let formdata = new FormData();
        formdata.append('judul', this.state.judul);
        formdata.append('penjelasan', this.state.penjelasan);
        
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);              
                let id = this.state.panduanID          
                Resource.edit_panduan(formdata, tokenString, id)            
                .then((res) => {                                                                                   
                    console.log(res)
                    this.props.navigation.navigate('ManagePanduan');        
                })
                .catch((err) => {                    
                    console.warn('Error:', error);
                })  
            });   
        } catch (error) {            
            console.log('AsyncStorage error: ' + error.message);
        }            
    }

    edit(){
        Alert.alert(
            "",
            "Apakah anda yakin ingin mengedit panduan ?",
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
        if (this.state.errorForm != true) {
            this.edit()
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
                            value = {this.state.judul}
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
                        value= {this.state.penjelasan}
                        underlineColorAndroid="transparent"
                        textAlignVertical='top'
                        placeholder="Berikan Keterangan"
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