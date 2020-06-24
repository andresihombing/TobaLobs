import React from 'react';
import { 
    StyleSheet, View, Text, Alert,
    TouchableOpacity, ScrollView, AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../i18n/i18n';
import Resource from './network/Resource'
/**
 * Home screen
 */
export default class Akun extends React.Component {        
    constructor(props){
        super(props);        
    }
    
    static navigationOptions = ({navigation}) => ({
        title: 'Menu Admin',
    })

    _signOutAsync = async () => {
        try {
            let devices = await AsyncStorage.getItem('devices');
            let dev = JSON.parse(devices);
            // console.warn(dev)
            await AsyncStorage.getItem('user', (error, result) => {       
                let tokenString = JSON.parse(result);            
                let body = '';              

                Resource.logout(body, tokenString, dev)
                .then((res) => {                
                    // console.log(res)                
                    // AsyncStorage.clear();
                    AsyncStorage.removeItem('user');
                    AsyncStorage.removeItem('role');
                    this.props.navigation.navigate('Auth');
                })
                .catch((err) => {
                    alert(err)                
                })            
            });                  
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }            
    };

    keluar(){
        Alert.alert(
            "",
            "Apakah anda yakin ingin keluar ?",
            [
              {
                text: "Tidak",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Ya", onPress: () => this._signOutAsync() }
            ],
            { cancelable: false }
          );
    }
        
    render() {
        return (        
        <View style = {styles.container}>
            <ScrollView>                
                <View style = {styles.infoContainer}>                                
                    <View style={styles.pengaturan}>
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate('ManageInformasi')}>
                            <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> Informasi Budidaya</Text>
                        </TouchableOpacity>                                        
                    </View>
                    <View style={styles.pengaturan}>
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate('ManagePanduan')}>
                            <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> Panduan Aplikasi</Text>
                        </TouchableOpacity>                                        
                    </View>  
                    <View style={styles.pengaturan}>
                        <TouchableOpacity onPress = {() => this.keluar()}>
                            <Text style = {styles.garis}><Icon size={25} name={'md-log-out'} /> Keluar</Text>
                        </TouchableOpacity>                                        
                    </View>                    
                </View>
            </ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#254F6E",    
        position: "relative"
    },
    infoContainer: {        
        left: 0,        
        right: 0,        
        // padding: 15,                
    },
    garis : {
        marginBottom: 10,
        fontSize: 18,
        // fontWeight: 'bold',                
        color: 'white',        
        width: '70%', 
        
    },     
    pengaturan : {
        marginTop: 10,                
        borderBottomColor: 'rgba(255,255,255,0.5)',       
        borderBottomWidth: 1,   
        paddingLeft : 15              
    },
});