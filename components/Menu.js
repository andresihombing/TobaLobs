import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Home from './Home'
import Info from './Info'
import Akun from './Akun'
import Tambak from './Tambak'
import TambahTambak from './TambahTambak';
import { createStackNavigator } from 'react-navigation-stack';

const HomeStack = createStackNavigator({ 
  Home: {
    screen: Home,    
    navigationOptions: {
        header: null,
    },
  },
  Tambak : {
    screen: Tambak,
  },
  TambahTambak: {
    screen: TambahTambak,
  },
  
});

const InfoStack = createStackNavigator({ 
  Information: {
    screen: Info,        
  }
});

const AkunStack = createStackNavigator({ 
  Akun: {
    screen: Akun,        
  }
});

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,      
      navigationOptions: {         
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-home'} />            
          </View>          
        ),
      }
    },
   
    Information: {
      screen: InfoStack,            
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{color: tintColor}]} size={30} name={'ios-information-circle-outline'} />
          </View>
        ),        
        activeColor: '#ffffff',
        inactiveColor: '#ebaabd',
        barStyle: { backgroundColor: '#d13560' },
      }
    },

    Akun: {
      screen: AkunStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-person'} />
          </View>
        ),        
        activeColor: '#ffffff',
        inactiveColor: '#ebaabd',
        barStyle: { backgroundColor: '#d13560' },
      }
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#ffffff',
    inactiveColor: '#bda1f7',
    barStyle: { backgroundColor: '#6948f4' },
  }
);

export default createAppContainer(TabNavigator);