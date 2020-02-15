import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * Home screen
 */
export default class Info extends React.Component {

    static navigationOptions = {
        title: 'Home',
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>                
                <Text>Info</Text>
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