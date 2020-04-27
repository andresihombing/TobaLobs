import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage, RefreshControl,
    TouchableOpacity, ScrollView, FlatList, Image
} from 'react-native';
import Resource from './network/Resource'
import Tambak from './Tambak'
import IconBadge from 'react-native-icon-badge';
import { set } from 'react-native-reanimated';

// import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Home screen
 */
export default class Home extends React.Component {    

    constructor(props){
        super(props);                
        
        this.state = {
            list_tambak: [],
            tambak : '',
            enableButton: false,
            disableButton: true,
            isFetching: true,
            totalNotif : '',            
        }          
    }   

    goToCreate(){        
        this.props.navigation.navigate('TambahTambak');
        // this.props.navigation.navigate('KebutuhanTambak');
    }

    componentDidMount = async () => {
        this.getData();               
        const { navigation } = this.props;        
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData();
        });
    }    

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }
    
    getData = async () => {
        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.getTambak(tokenString.token)
                .then((res) => {        
                    // console.log(res.data.totalNotif)
                    this.setState({
                        totalNotif : res.data.totalNotif
                    })                    
                    if (res.status == 'failed') {
                        alert('user anda telah expired')
                        AsyncStorage.clear();
                        this.props.navigation.navigate('Auth');
                    }
                     
                    console.log(res.data.data.length)
                    if(res.data.data.length > 0){                        
                        this.setState({
                            enableButton : true,
                            disableButton : false
                        })
                    } else {
                        this.setState({
                            enableButton : false,
                            disableButton : true
                        })
                    }
                    
                    this.setState({isFetching: false, list_tambak: res.data.data })
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
    
    listTambak = async () => {        
        try{            
            await AsyncStorage.getItem('user', (error, result) => {                       
                let list = this.state.tambak;                
                    this.props.navigation.navigate('Tambak', {
                        itemId : list,
                    });
            });   
        } catch (error) {
            console.log('error')
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    render() {
        // console.warn(this.state.list_tambak)
        const { navigate } = this.props.navigation;        
        return (                                    
            <View style={styles.container}>
                {/* <View>
                    <Tambak coba = {this.state.tambak}/>
                </View> */}
                <ScrollView
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}
                      onRefresh={() => this.onRefresh()}
                      tintColor="red"
                    />
                  }>
                <View style={{flexDirection: 'row-reverse',alignItems: 'center', padding: 5}}>
                    <TouchableOpacity 
                        onPress = {() =>{
                            this.props.navigation.navigate('AllNotifikasi');
                        }}
                    >
                        <IconBadge
                            MainElement={
                                <View style={{
                                    backgroundColor:'#489EFE',
                                    width:20,
                                    height:23,
                                    margin:10
                                }}>
                                    <Image 
                                    style = {{paddingRight:9}}
                                    source = {require('./assets/icons/notif.png')} />
                                </View>
                            }
                            BadgeElement={
                                <Text style={{color:'#FFFFFF'}}>{this.state.totalNotif}</Text>
                            }
                            IconBadgeStyle={{
                                width:15,
                                height:15,
                                backgroundColor: '#FF00EE'
                            }}
                            Hidden={this.state.BadgeCount==0}
                        />
                    </TouchableOpacity>
                </View>
                <View style = {styles.infoContainer}>                                        
                    <Text style={styles.textTittle}>Selamat Datang Di TobaLobs</Text>                    

                    <TouchableOpacity style = {styles.buttonContainer}
                        onPress={() => this.goToCreate()}>
                        <Text style={styles.txtTambah}>Tambah Tambak</Text>
                    </TouchableOpacity>                    

                    <View style={styles.tambakContainer}>  
                        <FlatList 
                            style={{ display: this.state.enableButton ? "flex" : "none"}}
                            data = {this.state.list_tambak}
                            // data={this.state.list_tambak.sort((b, a) => b.namaTambak.localeCompare(a.namaTambak))}                        
                            numColumns={2}
                            extraData={this.state.list_tambak}
                            renderItem={({ item, index }) => (                            
                                <TouchableOpacity style={styles.nameTambak}
                                    onPress = {() => {
                                        this.listTambak();
                                        // console.warn(this.state.list_tambak[index])                                    
                                        this.setState({tambak :item.tambakID})                                     
                                    }}
                                >
                                    <Text style= {styles.txtTambah}>{item.namaTambak}</Text>
                                </TouchableOpacity>
                            )}                    
                        />
                        <Text style={{ display: this.state.disableButton ? "flex" : "none", marginTop:150, textAlign: 'center', alignItems: 'center', fontSize: 30 }}>Belum Mempunyai Tambak</Text>
                    </View>
                </View>                
                </ScrollView>
            </View>
            
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',      
    },    
    infoContainer: {        
        left: 0,
        right: 0,                   
    },
    textTittle: {
        alignItems: 'center',
        fontSize: 30,
        borderBottomWidth: 3,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 50,
        marginRight: 50,
        color: 'white',
        borderBottomColor: 'white'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
    },
    txtTambah: {
        color: 'white',
    },
    tambakContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',    
        backgroundColor: 'white',
        paddingVertical: 15,
        marginTop: 15,
        alignItems: 'center',
        padding: 20,
        alignContent: 'center'
    },
    nameTambak: {
        // flex: 1,
        backgroundColor: 'blue',
        paddingVertical: 10,       
        // padding: 30,        
        width: '48%',
        aspectRatio: 2,
        marginBottom: 15,
        justifyContent: 'center',        
        // marginTop: 15,
        alignItems: 'center',
        marginLeft: 5,        
        // height: 200
    },
});