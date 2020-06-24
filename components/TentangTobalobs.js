import React from "react";
import{StyleSheet,View,ScrollView,Image,Text,TouchableOpacity,RefreshControl, AsyncStorage} from "react-native";
import I18n from '../i18n/i18n'

export default class TentangTobalobs extends React.Component {   
    constructor(props) {
        super(props);
        this.state = {
            tobalobs: ''
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: I18n.t('hompage.labelAbout'),            
    })

    componentDidMount() {        
        this.getData()
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData()       
        });
    }

    componentWillUnmount() {        
        this.focusListener.remove();        
    }

    getData(){
        this.setState({
            tobalobs: I18n.t('hompage.tentangTobaLobs')
        })
    }

    render(){
        return(
            <View style={styles.container}>                
            <ScrollView>                
                <Image 
                    style = {{width: '100%', marginTop: 5}}
                    source = {require('./assets/icons/tobalobs.png')} />
                <Text style = {styles.text}>{this.state.tobalobs}
                </Text>                                
                </ScrollView>
            </View>                
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#254F6E',        
        // alignItems: 'center',
        justifyContent : 'center',           
        position: "relative",                
    },
    text: {
        alignItems : 'flex-start',             
        padding: 10,
        color: 'white'
    }
})