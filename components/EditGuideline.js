import React, { Component } from 'react'
import {
    StyleSheet, Text, View, ScrollView,
    Button,TouchableOpacity,
    TextInput, Alert,AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import { Dropdown } from 'react-native-material-dropdown';
import TimePicker from 'react-native-simple-time-picker';

export default class EditGuideline extends Component {

    static navigationOptions = ({navigation}) => {        
        const { state } = navigation
        return {
            headerTitle: 'Edit Guideline',
            // headerRight: <View style={styles.right}><Button title="Hapus" onPress={() => state.params.handleSave()} /></View>,
          }
    }

    constructor(props){
        super(props);        

        this.state = {
            guidelineID: '',
            aksiGuideline : '',      
            notifikasi: '',
            tipeBudidaya: '',
            tipeJadwal: '',
            dataTipeBudidaya: [{
                value: 'semua',
                label: 'Semua'
              }, {
                value: 'pembenihan',
                label: 'Pembenihan'
            },{
                value: 'pembesaran',
                label: 'Pembesaran'
            }],
            dataTipeJadwal: [{
                value: 'berulang',
                label: 'Berulang'
              }, {
                value: 'sekali',
                label: 'Sekali'
            }],
            interval: '',
            waktu: '',
            errorAksi: false,
            errorNotif: false,
            errorTipeBudidaya: false,
            errorTipeJadwal: false,
            errorInterval: false,
            errorWaktu: false,            
            errorForm: false,
            selectedHours: 0,            
            selectedMinutes: 0,
        }
    }    

    validate(text, type) {        
        if (type == 'aksiGuideline') {
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
        else if (type == 'notifikasi') {
            if(text == ''){
                this.setState({              
                    errorNotif: true
                })
            }else{
                this.setState({              
                    errorNotif: false
                })
            }            
        }
        else if (type == 'tipeBudidaya') {
            if(text == ''){
                this.setState({              
                    errorTipeBudidaya: true
                })
            }else{
                this.setState({              
                    errorTipeBudidaya: false
                })
            }            
        }
        else if (type == 'tipeJadwal') {
            if(text == ''){
                this.setState({              
                    errorTipeJadwal: true
                })
            }else{
                this.setState({              
                    errorTipeJadwal: false
                })
            }            
        }
        else if (type == 'interval') {            
            if(text == '' || text == 0){
                this.setState({              
                    errorInterval: true
                })
            }else{
                this.setState({              
                    errorInterval: false
                })
            }            
        }
        // else if (type == 'waktu') {
        //     if(text == ''){
        //         this.setState({              
        //             errorWaktu: true
        //         })
        //     }else{
        //         this.setState({              
        //             errorWaktu: false
        //         })
        //     }            
        // }   
    }

    val(){
        const { aksiGuideline, notifikasi, tipeBudidaya, tipeJadwal, interval, waktu} = this.state
        if ((aksiGuideline == "")) {
            this.setState({
                errorForm: true,
                errorAksi: true,                
            })            
        }        
        if(notifikasi == ""){
            this.setState({
                errorForm: true,                
                errorNotif: true,
            })            
        }
        if(tipeBudidaya == ""){
            this.setState({
                errorForm: true,                
                errorTipeBudidaya: true,
            })            
        }
        if(tipeJadwal == ""){
            this.setState({
                errorForm: true,                
                errorTipeJadwal: true,
            })            
        }
        if(interval == "" || interval == 0){
            this.setState({
                errorForm: true,                
                errorInterval: true,
            })            
        }
        // if(waktu == ""){
        //     this.setState({
        //         errorForm: true,                
        //         errorWaktu: true,
        //     })            
        // }    
    } 

    componentDidMount(){
        const {params} = this.props.navigation.state;        
        const guidelineID = params ? params.guidelineID : null;  
        const aksiGuideline = params ? params.aksiGuideline : null;
        const notifikasi = params ? params.notifikasi : null;
        const tipeBudidaya = params ? params.tipeBudidaya : null;
        const tipeJadwal = params ? params.tipeJadwal : null;
        const interval = params ? params.interval : null;
        const waktu = params ? params.waktu : null;
        const time = waktu.split(':')                
        this.setState({
            guidelineID: guidelineID,
            aksiGuideline : aksiGuideline,
            notifikasi: notifikasi,
            tipeBudidaya: tipeBudidaya,
            tipeJadwal: tipeJadwal,
            interval: interval,
            waktu: waktu,
            selectedHours: time[0],
            selectedMinutes: time[1]
        })
        this.props.navigation.setParams({ handleSave: () => this.deleteInfo() })
    }

    // deleteInfo() {
    //     Alert.alert(
    //         "",
    //         "Apakah anda yakin ingin menghapus informasi ?",
    //         [
    //           {
    //             text: "Cancel",
    //             onPress: () => console.log("Cancel Pressed"),
    //             style: "cancel"
    //           },
    //           { text: "OK", onPress: () => this.submitDelete() }
    //         ],
    //         { cancelable: false }
    //       );        
    // }
    
    // submitDelete = async() => {
    //     try{
    //         await AsyncStorage.getItem('user', (error, result) => {
    //             let tokenString = JSON.parse(result);
    //             let id = this.state.idInfo                
    //             Resource.delete_info(tokenString, id)
    //             .then((res) => {                                                                                   
    //                 console.log(res)
    //                 Alert.alert(
    //                     '',
    //                     `Berhasil menghapus informasi`
    //                 )
    //                 this.props.navigation.navigate('ManageInformasi');        
    //             })
    //             .catch((err) => {                    
    //                 console.warn('Error:', error);
    //             })  
    //         });   
    //     } catch (error) {            
    //         console.log('AsyncStorage error: ' + error.message);
    //     }       
    // }

    submitReg = async () => {                
        let formdata = new FormData();
        formdata.append('aksiGuideline', this.state.aksiGuideline);
        formdata.append('notifikasi', this.state.notifikasi);
        formdata.append('tipeBudidaya', this.state.tipeBudidaya);
        formdata.append('tipeJadwal', this.state.tipeJadwal);
        formdata.append('interval', this.state.interval);
        formdata.append('waktu', this.state.waktu);
        
        try{
            await AsyncStorage.getItem('user', (error, result) => {
                let tokenString = JSON.parse(result);
                let id = this.state.guidelineID
                console.log(id)
                Resource.edit_guideline(formdata, tokenString, id)            
                .then((res) => {                                                                                   
                    console.log(res)
                    this.props.navigation.navigate('ManageGuideline');    
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
            "Apakah anda yakin ingin mengedit Guideline ?",
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
        const { selectedHours, selectedMinutes, waktu } = this.state; 
        return (
            <View style={styles.container}>
                <Text style={{ display: this.state.errorForm ? "flex" : "none", color: 'red', fontSize: 12, textAlign:'center'}}>Lengkapi form dengan baik</Text>
                <ScrollView>
                    <Text style={styles.label}>Notifikasi</Text>
                    <View style={styles.textAreaContainer} >                    
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            placeholder="Masukkan Notifikasi"  
                            placeholderTextColor="grey"
                            value = {this.state.notifikasi}
                            autoCorrect = {false}
                            onChangeText={(notifikasi) => {    
                                this.validate(notifikasi, 'notifikasi')                        
                                this.setState({notifikasi})
                            }}                            
                        />
                    </View>
                    <Text style={{ display: this.state.errorNotif ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

                    <Text style={styles.label}>Aksi Guideline</Text>
                    <View style={styles.textAreaContainer} >
                        <ScrollView>
                        <TextInput
                        style={styles.textArea}
                        value= {this.state.aksiGuideline}
                        underlineColorAndroid="transparent"
                        placeholder="Masukkan Aksi Guideline"
                        textAlignVertical='top'
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(aksiGuideline) => {    
                            this.validate(aksiGuideline, 'aksiGuideline')                    
                            this.setState({aksiGuideline})
                        }}   
                        />
                        </ScrollView>
                    </View>
                    <Text style={{ display: this.state.errorAksi ? "flex" : "none", color: 'red', fontSize: 12 }}>From tidak boleh kosong</Text>

                    <Text style={styles.label}>Tipe Budidaya</Text>
                    <View style={styles.textAreaContainer} >                    
                        <Dropdown
                            value={this.state.label}
                            data={this.state.dataTipeBudidaya}                            
                            containerStyle = {styles.dropdown}
                            selectedItemColor = 'black'
                            textColor= 'black'
                            value = {this.state.tipeBudidaya}
                            baseColor = 'black'                                
                            onChangeText={(value)=> {
                                this.validate(value, 'tipeBudidaya')
                                this.setState({ tipeBudidaya : value })                                     
                        }}
                        />
                    </View>
                    <Text style={{ display: this.state.errorTipeBudidaya ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

                    <Text style={styles.label}>Tipe Jadwal</Text>
                    <View style={styles.textAreaContainer} >                    
                    <Dropdown
                            value={this.state.label}
                            data={this.state.dataTipeJadwal}                            
                            containerStyle = {styles.dropdown}
                            selectedItemColor = 'black'
                            textColor= 'black'
                            value = {this.state.tipeJadwal}
                            baseColor = 'black'                                
                            onChangeText={(value)=> {
                                this.validate(value, 'tipeJadwal')
                                this.setState({ tipeJadwal : value })                                     
                        }}
                        />
                    </View>
                    <Text style={{ display: this.state.errorTipeJadwal ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

                    <Text style={styles.label}>Interval</Text>
                    <View style={styles.textAreaContainer} >                    
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            placeholder="Masukkan Interval"  
                            placeholderTextColor="grey"
                            value = {this.state.interval}
                            keyboardType= 'number-pad'
                            autoCorrect = {false}
                            onChangeText={(interval) => {   
                                this.validate(interval, 'interval')
                                this.setState({interval})
                            }}                            
                        />
                    </View>
                    <Text style={{ display: this.state.errorInterval ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong atau 0</Text>
                    
                    <Text style={styles.label}>Waktu</Text>
                    <Text style={styles.label}>{waktu}</Text>
                    <View style={styles.textAreaContainer} >                    
                        {/* <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            placeholder="Masukkan Waktu"  
                            placeholderTextColor="grey"
                            value = {this.state.waktu}
                            autoCorrect = {false}
                            onChangeText={(waktu) => {   
                                this.validate(waktu, 'waktu')                         
                                this.setState({waktu})
                            }}                            
                        /> */}
                        <TimePicker
                            selectedHours={selectedHours}
                            //initial Hourse value
                            selectedMinutes={selectedMinutes}
                            //initial Minutes value
                            onChange={(hours, minutes) => this.setState({ 
                                selectedHours: hours, selectedMinutes: minutes 
                            })}
                        />
                    </View>
                    <Text style={{ display: this.state.errorWaktu ? "flex" : "none", color: 'red', fontSize: 12 }}>Form tidak boleh kosong</Text>

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
      height: 100,
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
    },    
  })