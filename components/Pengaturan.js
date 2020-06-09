import React from 'react';
import {    
  Text, View, StyleSheet, Picker, AsyncStorage, TouchableOpacity
} from 'react-native';
import I18n from '../i18n/i18n';

const listLanguage = [
    {key:'id', label:'Indonesia'}, {key:'en', label:'English'}
]

export default class App extends React.Component {
    constructor(props) {
        super(props)
            this.state = {
                languageSelected: 'id',
                heading: ''
            }
        }

        static navigationOptions = ({navigation}) => ({
            title: I18n.t('hompage.labelpengaturan'),
        })
        
        componentDidMount = async()=> {            
            await AsyncStorage.getItem('bahasa', (error, result) => {                    
                const bahasa = JSON.parse(result)                              
                this.setState({
                    languageSelected: bahasa
                })
            });
        }

        onChangeLanguage = async(languageSelected) => {
            this.setState({
                languageSelected,
                heading: I18n.t('hompage.labelpengaturan'),                
            })            
            AsyncStorage.setItem('bahasa', JSON.stringify(languageSelected));
            this.props.navigation.setParams({
                title: this.state.heading,
            });
                        
            //this.props.setLanguageUser(value)
            I18n.locale = languageSelected 
        // _storeData(USER_LANGUAGE,value);
        }

        

        render() {
            const {languageSelected} = this.state
            return (
                <View style={styles.container}>
                    <DropdownLanguage language={languageSelected} onChangeLanguage={this.onChangeLanguage.bind(this)}></DropdownLanguage>                
                    <TouchableOpacity style = {styles.password} onPress = {() => this.props.navigation.navigate('EditPassword')}>
                        <Text>{I18n.t('hompage.gantipass')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.pakan} onPress = {() => this.props.navigation.navigate('SetJadwal')}>
                        <Text>Set Jadwal</Text>
                    </TouchableOpacity>           
                </View>
            );
        }
    }
  
class DropdownLanguage extends React.Component {
    constructor(props) {
        super(props)  
    }
    
    render() {
        return (
            <View style={styles.dropdownLanguage}>
                <Text style={{width:60, fontSize: 14}}>{I18n.t('hompage.language')} </Text>
                <Picker
                    // mode="dropdown"                    
                    style={{ width: 250,height:40}}
                    selectedValue={this.props.language}
                    onValueChange={this.props.onChangeLanguage.bind(this)}
                    >
                    {listLanguage.map((languageItem, i) => {
                        return <Picker.Item key={i} value={languageItem.key} label= {languageItem.label} />
                    })}
                </Picker>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#192338",  
    padding: 8,
    position: 'relative'    
  },
   title: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownLanguage :{
    width:340,
    height:40, 
    position:'absolute',
    top:10,
    right:10, 
    flexDirection:'row',
    flex:1,    
    padding: 10,
    alignItems: "center",
    backgroundColor: 'white'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  password: {
    top: 60,
    width:340,
    height:40, 
    position:'absolute',    
    right:10,     
    padding: 10,
    backgroundColor: 'white',    
  },
  pakan: {
    top: 110,
    width:340,
    height:40, 
    position:'absolute',    
    right:10,     
    padding: 10,
    backgroundColor: 'white',    
  },

});
