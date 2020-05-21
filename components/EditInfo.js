import React, { Component } from 'react'
import {
    StyleSheet, Text, View, ScrollView,
    StatusBar,TouchableOpacity,
    TextInput, SafeAreaView,AsyncStorage
} from 'react-native'

export default class EditInfo extends Component {

    static navigationOptions = ({navigation}) => ({
        title: 'Edit Informasi',
    })

    constructor(props){
        super(props);        

        this.state = {
            judul: '',
            penjelasan: ''
        }
    }    

    componentDidMount(){
        const {params} = this.props.navigation.state;
        const judul = params ? params.judul : null;  
        const penjelasan = params ? params.penjelasan : null;          
        this.setState({
            judul: judul,
            penjelasan: penjelasan
        })
    }

    render() {                
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.label}>Judul</Text>
                    <View style={styles.textAreaContainer} >                    
                        <TextInput style = {styles.input}                            
                            returnKeyType = 'next'
                            placeholder="Masukkan Judul Informasi"  
                            placeholderTextColor="grey"
                            value = {this.state.judul}
                            autoCorrect = {false}
                            onChangeText={(judul) => {                            
                                this.setState({judul})
                            }}                            
                        />
                    </View>

                    <Text style={styles.label}>Keterangan</Text>
                    <View style={styles.textAreaContainer} >
                        <ScrollView>
                        <TextInput
                        style={styles.textArea}
                        value= {this.state.penjelasan}
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
                    <TouchableOpacity full style = {{backgroundColor: '#f7c744', paddingVertical: 15, marginTop: 10}}
                        onPress = {() => this.submitReg()}>
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
        backgroundColor: 'rgb(32, 53, 70)',
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
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 15,        
    },
  })