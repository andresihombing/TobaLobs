import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReportGrafik from './ReportGrafik'
import ReportTable from './ReportTable'

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

// function ProfileScreen({ route }) {
//   const userId = route.params.user;
//   // console.warn(userId)
//   return (
//     <View style={{alignItems: 'center', top: 50}}>
//          <Greeting name={userId} />         
//          {/* <Text>{userId}</Text> */}
//        </View>
//   );
// }
const Greeting=()=> {
  console.warn('test')
}

// export class ProfileScreen extends React.Component {   
  
  // ProfileScreen( this.route ) {
    // const userId = route.params.user;
    // console.warn(userId)
    // return (
    //   <View style={{alignItems: 'center', top: 50}}>
    //        <Greeting name={userId} />         
    //        {/* <Text>{userId}</Text> */}
    //      </View>
    // );
  // }
  // componentDidMount(){
  //   this.ProfileScreen()
  // }
  // render(){    
  //   const a = this.props.route.params.user
  //   console.warn(a)
  //   return (
  //     <View style={{alignItems: 'center', top: 50}}>
  //       <Greeting name='Rexxar' />
  //       <Greeting name='Jaina' />
  //       <Greeting name='Valeera' />
  //     </View>
  //   );
  // }
// }



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
