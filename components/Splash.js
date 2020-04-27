import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
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
                {/* <Text style = {styles.title}> */}                
                <Image source = {require('./assets/icons/logo.png')} />
                {/* </Text> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#A1A3AA',
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