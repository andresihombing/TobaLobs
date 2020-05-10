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
import I18n from '../i18n/i18n';

import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Home from './Home'
import Info from './Info'
import Akun from './Akun'
import Tambak from './Tambak'
import TambahTambak from './TambahTambak';
import DetailTambak from './DetailTambak'
import KebutuhanTambak from './KebutuhanTambak'
import LogNotifikasi from './LogNotifikasi'
import DetailNotifikasi from './DetailNotifikasi'
import AllNotifikasi from './AllNotifikasi'
import TentangTobalobs from './TentangTobalobs'
import Pengaturan from './Pengaturan'
import PanduanAplikasi from './PanduanAplikasi'
import Report from './Report'
import EditTambak from './EditTambak'
import KebutuhanEditTambak from './KebutuhanEditTambak'
import EditProfile from './EditProfile'
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
  DetailTambak: {
    screen: DetailTambak,
  },
  KebutuhanTambak: {
    screen: KebutuhanTambak,
  },
  LogNotifikasi: {
    screen: LogNotifikasi,
  },
  DetailNotifikasi: {
    screen: DetailNotifikasi,
  },
  AllNotifikasi: {
    screen: AllNotifikasi,
  },
  Report: {
    screen: Report
  },
  EditTambak: {
    screen: EditTambak  
  },
  KebutuhanEditTambak: {
    screen: KebutuhanEditTambak
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
  },
  TentangTobalobs: {
    screen: TentangTobalobs,            
  },
  PanduanAplikasi: {
    screen: PanduanAplikasi,        
  },
  Pengaturan: {
    screen: Pengaturan
  },
  EditProfile: {
    screen: EditProfile
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
        barStyle: { backgroundColor: '#265011' },
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