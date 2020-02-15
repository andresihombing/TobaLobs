import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * Home screen
 */
export default class Home extends React.Component {

    static navigationOptions = {
        title: 'Home',
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>                
                <Text>Selamat Datang Di TobaLobs</Text>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});