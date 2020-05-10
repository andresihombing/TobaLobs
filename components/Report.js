import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReportGrafik from './ReportGrafik'
import ReportTable from './ReportTable'

const Greeting=()=> {
  console.warn('test')
}

const Tab = createMaterialTopTabNavigator();

export default function Report(route) {
  const params = route.navigation.state.params;
  const tambakId = params ? params.tambakId : null;            
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 15 },          
          style: { backgroundColor: '#f5d0d0' },
          // Greeting()
        }}
      >        
      <Tab.Screen name="Report" component={ReportTable} initialParams={{ tambakId: tambakId }}/>   
        <Tab.Screen name="Grafik" component={ReportGrafik} initialParams={{ tambakId: tambakId }}/>             
      </Tab.Navigator>
    </NavigationContainer>
  );
}
