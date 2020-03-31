import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList,
    RefreshControl
} from 'react-native';
import Resource from './network/Resource'

export default class LogNotifikasi extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            listNotif : [],
            kosong : false,
            notifId : ''
        }
    }

    static navigationOptions = {
        title: 'Log Notifikasi'
    };

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }

    componentDidMount = async () => {
        this.getData();        
    }  

    getData = async () => {
        const {params} = this.props.navigation.state;
        const tambakId = params ? params.tambakId : null;        

        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.getNotif(tokenString.token, tambakId, 'all-per-tambak')
                .then((res) => {                                 
                    console.log(res)    
                    if(res.data.length != 0){
                        this.setState({
                            kosong : false,                            
                        })
                    } else {
                        this.setState({
                            kosong : true,                            
                        })
                    }
                    
                    this.setState({isFetching: false, listNotif: res.data })
                })
                .catch((err) => {                                          
                    console.log(err)
                })
            });
        } catch (error) {            
            console.log(error)
            console.log('AsyncStorage error: ' + error.message);
        }
    }   

    detailNotif = async () => {
        try{            
            await AsyncStorage.getItem('user', (error, result) => {                       
                let list = this.state.tambak;                
                    this.props.navigation.navigate('DetailNotifikasi', {
                        notifId : this.state.notifId,
                    });                
            });   
        } catch (error) {
            console.log('error')
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    render() {                      
        return (                        
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.isFetching}
                        onRefresh={() => this.onRefresh()}
                        tintColor="red"
                        />
                    }>
                    <View style = {styles.notif}>
                        <FlatList                            
                            data = {this.state.listNotif}
                            extraData={this.state.listNotif}
                            renderItem={({item}) => 
                            <TouchableOpacity full style = {styles.notifikasi}
                            onPress = {() => {
                                this.detailNotif();                                
                                this.setState({notifId :item.ID})                                                                      
                            }}
                            >
                                <Text style = {styles.txtTambah, {padding:5}}>{item.Body}</Text>
                            </TouchableOpacity>                            
                            }
                        />
                    </View>
                    <Text style={{ display: this.state.kosong ? "flex" : "none", marginTop:150, textAlign: 'center', alignItems: 'center', fontSize: 20, color: 'white' }}>Tidak Ada Notifikasi</Text>
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
    notif: {
        flex: 1,        
        borderBottomColor: 'white',
        backgroundColor: '#455867',
        padding: 10
    },
    notifikasi: {
        backgroundColor: 'white', 
        paddingVertical: 15, 
        marginTop: 5,
        marginBottom: 5,
        padding: 10
    },
})