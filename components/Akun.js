import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-paper';
import Resource from './network/Resource'
import Icon from 'react-native-vector-icons/Ionicons';
/**
 * Home screen
 */
export default class Akun extends React.Component {        
    constructor(props){
        super(props);

        this.state = {
            
        }
    }

    _signOutAsync = async () => {
        try {
        let devices = await AsyncStorage.getItem('devices');        
        await AsyncStorage.getItem('user', (error, result) => {       
            let tokenString = JSON.parse(result);            
            let body = '';              

            Resource.logout(body, tokenString, devices)
            .then((res) => {                
                console.log(res)                
                AsyncStorage.clear();
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
    
    render() {
        return (
        // <View style={styles.container}>
        //     <Text>HomeScreen</Text>
        //     <Button onPress={() => this._signOutAsync()}>
        //     <Text >Logout</Text>
        //     </Button>
        // </View>
        <View style = {styles.container}>
            <View style = {styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style = {styles.text}>Andre Sihombing</Text>                    
                
                    <TouchableOpacity style = {styles.buttonContainer}>
                        <Text style={styles.txtTambah}>Edit</Text>
                    </TouchableOpacity>
                </View>          
                <View style={styles.contentContainer}>
                    <Text style = {styles.text}>andsihombing</Text>
                    <Text style = {styles.text}>08233941704229</Text>
                    <Text style = {styles.text}>Sipoholon</Text>
                    <Text style = {styles.garis}>22 April 1998</Text>
                </View>
                <View style={styles.pengaturan}>
                    <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> Pengaturan</Text>                    
                </View>
                <View style={styles.pengaturan}>
                    <Text style = {styles.garis}><Icon size={25} name={'md-help-circle'} /> Panduan Aplikasi</Text>
                </View>
                <View style={styles.pengaturan}>
                    <Text style = {styles.garis}><Icon size={25} name={'md-information-circle'} /> Tentang Tobalobs</Text>
                </View>
                <View style={styles.pengaturan}>
                    <Text style = {styles.garis}
                        onPress = {() => this._signOutAsync()}
                    > <Icon size={25} name={'md-log-out'} /> Keluar</Text>
                </View>            
                <View>            
          </View>
            </View>
        </View>
        )
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
        padding: 15,                
    },
    buttonContainer: {        
        backgroundColor: '#f7c744',
        paddingVertical: 10,
        alignItems: 'center',
        width: '30%',
        marginBottom: 10  
    },
    titleContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',                        
    },
    garis : {
        marginBottom: 10,
        fontSize: 18,
        // fontWeight: 'bold',                
        color: 'white',        
        width: '70%', 
        
    }, 
    contentContainer: {
        marginTop: 25,                
        borderBottomColor: 'blue',       
        borderBottomWidth: 2,          
    },
    text : {
        fontSize: 18,
        // fontWeight: 'bold',                
        color: 'white',        
        width: '70%',        
    },
    pengaturan : {
        marginTop: 10,                
        borderBottomColor: 'blue',       
        borderBottomWidth: 2,         
    },
});