import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';

export default class DetailNotifikasi extends React.Component {   
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Detail Notifikasi'
    };

    render() {                      
        return (                        
            <View style={styles.container}>
                <ScrollView>                
                               
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
})