import React from 'react';
import { StyleSheet, View, Text, ScrollView, AsyncStorage } from 'react-native';
import DropDownItem from "react-native-drop-down-item";
import Resource from './network/Resource'

/**
 * Home screen
 */
const IC_ARR_DOWN = require('./assets/icons/down.jpg');
const IC_ARR_UP = require('./assets/icons/up.png');

export default class Info extends React.Component {    

    state = {
        // contents: [
        //   {
        //     title: "Title 1",
        //     body: "Hi. I love this component. What do you think?"
        //   },
        //   {
        //     title: "See this one too",
        //     body: "Yes. You can have more items."
        //   },
        //   {
        //     title: "Thrid thing",
        //     body:
        //       "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?"
        //   }
        // ],
        contents : []
    };

    componentDidMount = async () => {
      this.getData();              
    }  
    
    getData = async () => {
      try{            
          await AsyncStorage.getItem('user', (error, result) => {
          let tokenString = JSON.parse(result);
          Resource.information(tokenString.token)
              .then((res) => {                                 
                this.setState({
                  contents : res.data
                })                                                                                                      
              })
              .catch((err) => {                                                                            
                  this.setState({
                      enableButton : false,
                      disableButton : true
                  })
                  console.log(err)
              })
          });
      } catch (error) {            
          console.log(error)
          console.log('AsyncStorage error: ' + error.message);
      }
  }

    render() {
        return (
          <View style={styles.container}>
            <ScrollView style={{ alignSelf: 'stretch' }}>
              {
                this.state.contents
                  ? this.state.contents.map((param, i) => {
                    return (
                      <DropDownItem
                        key={i}
                        style={styles.dropDownItem}
                        contentVisible={false}
                        invisibleImage={IC_ARR_DOWN}
                        visibleImage={IC_ARR_UP}
                        header={
                          <View style={styles.header}>
                            <Text style={{
                              fontSize: 16,
                              color: 'white',
                            }}>{param.judul}</Text>
                          </View>
                        }
                      >
                        <Text style={[
                          styles.txt,
                          {
                            color: 'white',
                            fontSize: 12,
                            paddingLeft: 10
                          },
                        ]}>
                          {param.penjelasan}
                        </Text>
                      </DropDownItem>
                    );
                  })
                  : null
              }
              <View style={{ height: 96 }}/>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(32, 53, 70)',
      paddingTop: 10,
    },
    header: {
      width: '100%',
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',      
    },
    headerTxt: {
      fontSize: 12,
      color: 'rgb(74,74,74)',
      marginRight: 60,
      flexWrap: 'wrap',
    },
    txt: {
      fontSize: 14,
    },
  });