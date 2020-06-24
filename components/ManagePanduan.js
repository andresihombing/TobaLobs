import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList,
    RefreshControl, Button
} from 'react-native';
import Resource from './network/Resource'
import I18n from '../i18n/i18n';
import { cond } from 'react-native-reanimated';

export default class ManagePanduan extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            listPanduan : [],
            kosong : false,
            notifId : '',
            judul : '',
            penjelasan: '',
            panduanID: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTitle: 'Mengelola Panduan',
          headerRight: <View style={styles.right}><Button title="Tambah" onPress={() => state.params.handleSave()} /></View>,
        }
      }

      onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }

    componentDidMount = async () => {
        this.getData();        
        this.props.navigation.setParams({ handleSave: () => this.tambahPanduan() })
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData() 
        });
    }  

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();        
    }

    tambahPanduan() {
        this.props.navigation.navigate('TambahPanduan')
    }

    getData = async () => {
        try{            
            await AsyncStorage.getItem('user', (error, result) => {
            let tokenString = JSON.parse(result);
            Resource.panduan(tokenString.token)
                .then((res) => {                                                   
                    this.setState({
                        isFetching: false, 
                        listPanduan: res.data 
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

    detailPanduan = async () => {
        try{            
            await AsyncStorage.getItem('user', (error, result) => {                       
                let list = this.state.tambak;                
                    this.props.navigation.navigate('EditPanduan', {
                        panduanID: this.state.panduanID,
                        judul :this.state.judul,
                        penjelasan: this.state.penjelasan
                    });                
            });   
        } catch (error) {
            console.log('error')
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    FlatListItemSeparator = () => <View style={styles.line} />;

    renderItem = data =>
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}      
      onPress={() => {
        this.detailPanduan();        
        this.setState({
            panduanID: data.item.panduanAplikasiID,
            judul :data.item.judul,
            penjelasan: data.item.penjelasan
        })}
      }
    >
    <View      
      style={{ width: 40, height: 40, margin: 6 }}>      
      <Text style={styles.lightText}>  {data.item.judul}  </Text>
    </View>
  </TouchableOpacity>

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
                        <FlatList                            
                            data = {this.state.listPanduan}
                            extraData={this.state}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem(item)}                            
                        />                    
                    <Text style={{ display: this.state.kosong ? "flex" : "none", marginTop:150, textAlign: 'center', alignItems: 'center', fontSize: 20, color: 'white' }}>Tidak Ada Notifikasi</Text>
                </ScrollView>
            </View>            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#254F6E",    
        position: "relative"
    },
    notif: {
        flex: 1,        
        borderBottomColor: 'white',
        backgroundColor: '#254F6E',
        padding: 10
    },
    notifikasi: {
        backgroundColor: 'white', 
        paddingVertical: 15, 
        marginTop: 5,
        marginBottom: 5,
        padding: 10
    },
    list: {
        paddingVertical: 5,
        margin: 3,
        flexDirection: "row",
        backgroundColor: "#254F6E",
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: -1,
    },
    lightText: {
        color: "#f7f7f7",
        width: 300,
        padding: 15,
        fontSize: 13
    },
    titleText: {
        color: "#f7f7f7",
        width: 300,
        paddingLeft: 17,
        fontSize: 13,
        fontWeight : 'bold'
    },
    line: {
        height: 0.5,
        width: "100%",
        backgroundColor:"rgba(255,255,255,0.5)"
    },
    right: {
        padding: 7
    }
})