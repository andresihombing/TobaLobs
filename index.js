/**
 * @format
 */

import React, { Component } from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Splash from './components/Splash';   
import Menu from './components/Menu';
import Manage from './components/Manage';


class Main extends Component {  
    constructor(props) {
        super(props);   
        this.state = { currentScreen: 'Splash'}
        // console.log('start doing some tasks for about 3 seconds')
        setTimeout(() => {
            // console.log("Done some tasks for about 3 seconds")
            this.setState({ currentScreen: 'Menu'})
        }, 1000);
    }
    
    render(){
        const { currentScreen } = this.state
        let mainScreen = currentScreen === 'Splash' ? <Splash/> : <App/>
        return mainScreen
    }
}

AppRegistry.registerComponent(appName, () => Main);
