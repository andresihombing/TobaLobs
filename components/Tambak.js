import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Resource from './network/Resource'

export default class Tambak extends React.Component {        

    render() {              
        return (                        
            <View style={styles.container}>
                <ScrollView>                
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>Tambak 1</Text>
                                        
                        <TouchableOpacity style = {styles.buttonContainer}>
                            <Text style={styles.txtTambah}>Tambah Tambak</Text>
                        </TouchableOpacity>                    
                        
                    </View>
                    <View style={styles.tambakContainer}>  
                    
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
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',        
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },
    infoContainer: {
        // position: 'absolute',        
        left: 0,
        right: 0,
        // height: 380,        
        padding: 20,                
    },
    textTittle: {        
        fontSize: 20,
        fontWeight: 'bold',                
        color: 'white',        
        width: '50%'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 10,        
        alignItems: 'center',
        width: '50%',
        marginBottom: 10  
    },
    tambakContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',    
        backgroundColor: 'white',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
        padding: 20,
        height: 200,
        alignContent: 'center'
    },
});