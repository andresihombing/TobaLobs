import React from 'react';
import { 
    StyleSheet, View, Text,
    TouchableOpacity, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../i18n/i18n';
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
        
    render() {
        return (        
        <View style = {styles.container}>
            <ScrollView>                
                <View style = {styles.infoContainer}>                                
                    <View style={styles.pengaturan}>
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate('ManageInformasi')}>
                            <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> Mengolola Informasi</Text>
                        </TouchableOpacity>                                        
                    </View>
                    <View style={styles.pengaturan}>
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate('ManagePanduan')}>
                            <Text style = {styles.garis}><Icon size={25} name={'md-settings'} /> Mengolola Panduan</Text>
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
        backgroundColor: "#192338",    
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