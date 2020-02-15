import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class Splash extends Component {
    constructor(props){
        super(props)
        this.state = { timer: 0}
        // setInterval(() => {
        //     this.setState({ timer: this.state.timer + 1})
        // }, 1000) 
    }

    render() {
        return (
            <View style = {styles.container}>
                <Text style = {styles.title}>Horas Portibi</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
    }
})