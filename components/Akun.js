import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { Button } from 'react-native-paper';
import Resource from './network/Resource'
/**
 * Home screen
 */
export default class Akun extends React.Component {    

    static navigationOptions = {
        header: null
    };   
    
    _signOutAsync = async () => {
        try {
        await AsyncStorage.getItem('user', (error, result) => {       
            let tokenString = JSON.parse(result);            
            let body = '';

            Resource.logout(body, tokenString)
            .then((res) => {                
                console.log(res)                
                AsyncStorage.clear();
                this.props.navigation.navigate('Auth');
            })
            .catch((err) => {
                alert(err)                
            })
            // fetch('http://10.42.0.84:8000/user/logout',  
            // {
            //     method: 'POST', 
            //     headers:{
            //         //this what's exactly look in my postman
            //         'Authorization': tokenString.token
            //     },            
            // })
            // .then((response) => response.json())
            // .then((responseJson) => {
            //     console.log(responseJson.detail)            
            //     AsyncStorage.clear();
            //     this.props.navigation.navigate('Auth');
            // }).catch((error) => {
            //     alert('error')
            // })                
        });                  
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }    
    };
    
    render() {
        return (
        <View style={styles.container}>
            <Text>HomeScreen</Text>
            <Button onPress={() => this._signOutAsync()}>
            <Text >Logout</Text>
            </Button>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});