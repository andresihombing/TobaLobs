import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage, RefreshControl,
    TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Resource from './network/Resource'
import Tambak from './Tambak'

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
        }          
    }   

    goToCreate(){        
        this.props.navigation.navigate('TambahTambak');
        // this.props.navigation.navigate('KebutuhanTambak');
    }

    componentDidMount() {
        this.getData();                
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
                    if (res.status == 'failed') {
                        alert('user anda telah expired')
                        AsyncStorage.clear();
                        this.props.navigation.navigate('Auth');
                    }

                    if(res.data.length != 0){
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
                    
                    this.setState({isFetching: false, list_tambak: res.data })                                       
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
                // console.warn(this.state.tambak)
                // let tokenString = JSON.parse(result);                
                let list = this.state.tambak;
                
                // Resource.postTambak(list, tokenString.token)
                // .then((res) => {                                                        
                //     console.warn(res)
                    
                    this.props.navigation.navigate('Tambak', {
                        itemId : list,
                        
                    });
                // })
                // .catch((err) => {                    
                //     console.log('Error:', error);
                // })  
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
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>Selamat Datang Di TobaLobs</Text>
                    </View>                    

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
    titleContainer: {
        // flex: 1,
        marginTop: 30,
    },
    infoContainer: {
        // position: 'absolute',
        left: 0,
        right: 0,
        // height: 380,        
        padding: 20,        
        // backgroundColor: 'red'   
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
    }
});