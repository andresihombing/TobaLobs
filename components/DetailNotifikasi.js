import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Resource from './network/Resource'
import { set } from 'react-native-reanimated';

export default class DetailNotifikasi extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            aksiPenyimpangan : '',
            keterangan : '',
            kondisi : '',
            namaTambak : '',
            waktuTanggal : ''
        }
    }

    static navigationOptions = {
        title: 'Detail Notifikasi'
    };

    componentDidMount() {        
        this.detailNotif()        
    }  

    detailNotif = async () => {
        const {params} = this.props.navigation.state;
        const notifId = params ? params.notifId : null;         
        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.detailNotif(tokenString.token, notifId)
                .then((res) => {             
                    console.log(res.data.aksiPenyimpangan)       
                    this.setState({
                        aksiPenyimpangan : res.data.aksiPenyimpangan,
                        keterangan : res.data.keterangan,
                        kondisi : res.data.kondisi,
                        namaTambak : res.data.namaTambak,
                        waktuTanggal : res.data.waktuTanggal
                    })
                })
                .catch((err) => {                                          
                    console.log(err)
                })
            });
        } catch (error) {            
            console.log(error)
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    render() {                      
        return (                        
            <View style={styles.container}>
                <ScrollView>                
                    <View style = {styles.infoContainer}>
                        <View style={styles.rowContainer}>
                            <Text style = {{flex: 1, color: 'white', marginTop: 10, fontSize: 15, fontWeight: 'bold'}}>{this.state.namaTambak}</Text>
                            <Text style = {{paddingRight: 0, color: 'white', marginTop: 10, fontSize: 10}}> {this.state.waktuTanggal}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Kondisi :</Text>
                            <Text style = {styles.input}> {this.state.kondisi}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Keterangan :</Text>
                            <Text style = {styles.input}> {this.state.keterangan}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Cara Mengatasi :</Text>
                            <Text style = {styles.input}> {this.state.aksiPenyimpangan}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    infoContainer: {        
        left: 0,
        right: 0,        
        padding: 20,                
    },
    rowContainer: {
        flex: 1,         
        flexDirection: "row",
        justifyContent: "space-between",                
    },
    label:{
        flex: 1,
        color: 'white',
        paddingTop: 15
    },
    input: {    
        flex: 1.7,        
        color: 'white',        
        borderBottomColor: 'white',        
        paddingTop: 15
    },
})