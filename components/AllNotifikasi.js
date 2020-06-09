import React from "react";
import{StyleSheet,View,ScrollView,FlatList,Text,TouchableOpacity,RefreshControl, AsyncStorage} from "react-native";
import Resource from './network/Resource'
import I18n from '../i18n/i18n';

export default class AllNotifikasi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
      notifId : '',
      isFetching: true,
      kosong : true,
     };
  }

  static navigationOptions = ({navigation}) => ({
    title: I18n.t('hompage.labelallnotif'),            
  })

  componentDidMount() {this.getData();}
  
  onRefresh() {
    this.setState({ isFetching: true }, function() { this.getData() });
  }

  getData = async () => {                
    const {params} = this.props.navigation.state;
    const tambakId = params ? params.tambakId : null;        

    try{            
      await AsyncStorage.getItem('user', (error, result) => {
      let tokenString = JSON.parse(result);
      Resource.getNotif(tokenString.token, 0, 'all-tambak')		
        .then((res) => {         				             
          res.data = res.data.map(item => {            
            item.statusNotifikasi = item.statusNotifikasi;
            item.selectedClass = item.statusNotifikasi == 'read' ? styles.list : styles.selected;
        
            return item;
          });                            
                                
          if(res.data.length != 0){            
            this.setState({
              kosong : false,                            
            })
          } else {
            this.setState({
              kosong : true,                            
            })
          }
          
          this.setState({isFetching: false, dataSource: res.data })
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

  FlatListItemSeparator = () => <View style={styles.line} />;

  selectItem = data => {		
    data.item.statusNotifikasi = data.item.statusNotifikasi;  
    data.item.selectedClass = data.item.statusNotifikasi ? styles.list : styles.selected;

    const index = this.state.dataSource.findIndex(
      item => data.item.notifikasiID === item.notifikasiID,      
    );

    this.state.dataSource[index] = data.item;

    this.detailNotif()
    this.setState({
      dataSource: this.state.dataSource,
      notifId : data.item.notifikasiID
    });
  };

  renderItem = data =>
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}      
      onPress={() => this.selectItem(data)}
    >
    <View      
      style={{ width: 40, height: 40, margin: 6 }}>
      <Text style={styles.titleText}>  {data.item.title}  </Text>
      <Text style={styles.lightText}>  {data.item.body}  </Text>
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
            data={this.state.dataSource}
            // data={this.state.dataSource.sort((a, b) => a.ID.localeCompare(b.ID))}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => item.notifikasiID.toString()}
            extraData={this.state}
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
    backgroundColor: "#192338",    
    position: "relative"
   },
  title: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10
  },
  loader: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list: {
    paddingVertical: 5,
    margin: 3,
    flexDirection: "row",
    backgroundColor: "#192338",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1,
  },
  lightText: {
    color: "#f7f7f7",
    width: 300,
    paddingLeft: 15,
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
  icon: {
    position: "absolute",  
    bottom: 20,
    width: "100%", 
    left: 290, 
    zIndex: 1
  },
  numberBox: {
    position: "absolute",
    bottom: 75,
    width: 30,
    height: 30,
    borderRadius: 15,  
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  number: {fontSize: 14,color: "#000"},
  selected: {backgroundColor: "#FA7B5F"},
  });