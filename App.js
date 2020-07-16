import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';

import Login from './components/Login';
import Menu from './components/Menu';
import Register from './components/Register';
import Manage from './components/Manage';
import ManageInformasi from './components/ManageInformasi';
import ManagePanduan from './components/ManagePanduan';
import EditInfo from './components/EditInfo';
import EditPanduan from './components/EditPanduan';
import TambahInfo from './components/TambahInfo'
import TambahPanduan from './components/TambahPanduan'
import Verifikasi from './components/Verifikasi'
import VerifikasiForgot from './components/VerifikasiForgot'
import NoHp from './components/NoHp'
import ManageSensor from './components/ManageSensor'
import EditSensor from './components/EditSensor'
import ManageGuideline from './components/ManageGuideline'
import EditGuideline from './components/EditGuideline'
import TambahGuideline from './components/TambahGuideline'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('user');        

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({ Menu: Menu }, {headerMode: 'none'});
const AuthStack = createStackNavigator({SignIn: Login, Register: Register,  Verifikasi: Verifikasi, VerifikasiForgot: VerifikasiForgot, NoHp: NoHp });
const ManageStack = createStackNavigator({ 
  Manage: Manage, 
  ManageInformasi: ManageInformasi, 
  ManagePanduan: ManagePanduan, 
  EditInfo: EditInfo,
  EditPanduan: EditPanduan,
  TambahInfo: TambahInfo,
  TambahPanduan: TambahPanduan,
  ManageSensor: ManageSensor,
  EditSensor: EditSensor,
  ManageGuideline: ManageGuideline,
  EditGuideline: EditGuideline,
  TambahGuideline: TambahGuideline
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Manage: ManageStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
