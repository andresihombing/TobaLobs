import React from 'react';
import { 
    StyleSheet, View, Text, AsyncStorage,
    TouchableOpacity, ScrollView, FlatList,
    RefreshControl, Button
} from 'react-native';
import Resource from './network/Resource'
import I18n from '../i18n/i18n';
import { cond } from 'react-native-reanimated';

export default class ManageSensor extends React.Component {   
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            listSensor : [],
            kosong : false,            
            nilai : '',      
            tipe: '',
            id: '',
            aksi: '',
            kondisi: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTitle: 'Mengelola Sensor',          
        }
      }

      onRefresh() {
        this.setState({ isFetching: true }, function() { this.getData() });
     }

    componentDidMount = async () => {
        this.getData();                
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {      
            this.getData() 
        });
    }  

    componentWillUnmount() {        
        this.focusListener.remove();        
    }
    getData = async () => {                             
        Resource.listSensor()
            .then((res) => {        
                // console.log(res.data)                                           
                this.setState({
                    isFetching: false, 
                    listSensor: res.data 
                })                                                                                     
            })
            .catch((err) => {                                                                            
                this.setState({
                    enableButton : false,
                    disableButton : true
                })
                console.log(err)
            })            
      }

    detailPanduan = async (id, nilai, tipe, aksi, kondisi) => {                          
        this.props.navigation.navigate('EditSensor', {
            id: id,
            nilai : nilai,
            tipe: tipe,
            aksi: aksi,
            kondisi: kondisi
        });                        
    }

    FlatListItemSeparator = () => <View style={styles.line} />;

    renderItem = data =>
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}      
      onPress={() => {        
                    
        this.setState({
            id: data.item.id,
            nilai :data.item.nilai,
            tipe: data.item.tipe,
            aksi: data.item.tipePenyimpangan,
            kondisi: data.item.kondisi,
        })
        this.detailPanduan(
            data.item.id,
            data.item.nilai,
            data.item.tipe,
            data.item.aksiPenyimpangan,
            data.item.kondisi);
    }
        
      }
    >
    <View      
      style={{ width: 40, height: 40, margin: 6 }}>      
      <Text style={styles.lightText}> Kondisi {data.item.kondisi}  </Text>
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
                            data = {this.state.listSensor}
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