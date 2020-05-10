import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Resource from './network/Resource'
import { set } from 'react-native-reanimated';
import I18n from '../i18n/i18n';

export default class DetailNotifikasi extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            aksiPenyimpangan : '',
            keterangan : '',
            kondisiPenyimpangan : '',
            namaTambak : '',
            waktuTanggal : ''
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: I18n.t('hompage.labeldetailnotif'),            
    })    

    componentDidMount() {        
        this.detailNotif() 
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.detailNotif() 
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    detailNotif = async () => {
        const {params} = this.props.navigation.state;
        const notifId = params ? params.notifId : null;         
        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.detailNotif(tokenString.token, notifId)
                .then((res) => {             
                    // console.log(res)
                    if (res.data.tipeNotifikasi == 'notif-pool-condition') {
                        this.setState({
                            aksiPenyimpangan : res.data.aksiPenyimpangan,
                            keterangan : res.data.keterangan,
                            kondisiPenyimpangan : res.data.kondisiPenyimpangan,
                            namaTambak : res.data.namaTambak,
                            waktuTanggal : res.data.waktuTanggal
                        })
                    }else{
                        this.setState({
                            aksiPenyimpangan : res.data.aksiGuideline,
                            keterangan : res.data.keterangan,
                            kondisiPenyimpangan : res.data.kondisiGuideline,
                            namaTambak : res.data.namaTambak,
                            waktuTanggal : res.data.waktuTanggal
                        })
                    }               
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
                            <Text style={styles.label}>{I18n.t('hompage.kodisi')} :</Text>
                            <Text style = {styles.input}> {this.state.kondisiPenyimpangan}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>{I18n.t('hompage.keterangan')} :</Text>
                            <Text style = {styles.input}> {this.state.keterangan}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>{I18n.t('hompage.caramengatasi')} :</Text>
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