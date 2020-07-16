import React, {Component} from 'react';
import {
  StyleSheet, View, Dimensions, Text, AsyncStorage, ScrollView
} from 'react-native';
import {
  LineChart, BarChart
} from "react-native-chart-kit";
import DatePicker from 'react-native-datepicker'
import Resource from './network/Resource'
import I18n from '../i18n/i18n';

class ReportGrafik extends Component {
  constructor(props){
    super(props);
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yyyy = new Date().getFullYear();

    if (dd < 10) { 
      dd = '0' + dd; 
    } 
    if (mm < 10) { 
        mm = '0' + mm; 
    }
    var today = yyyy + '-' + mm + '-' + dd;    
    this.state = {
      filter : today,      
      label: [],
      datasetsPh: [
        {
          data: [0]
        }
      ],
      label: [],
      datasetsSuhu: [
        {
          data: [0]
        }
      ],
      label: [],
      datasetsDo: [
        {
          data: [0]
        }
      ]    
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: I18n.t('hompage.labelreport'),            
  })

  componentDidMount = async () => {        
    this.getData();            
  }  

  getData = async () => {
    const tambakId = this.props.route.params.tambakId    
    const self = this;
    try{            
        await AsyncStorage.getItem('user', (error, result) => {
        let tokenString = JSON.parse(result);        
        // let formdata = new FormData();
        // formdata.append('tanggal', this.state.filter);        
        let formdata = this.state.filter
        // console.warn(formdata)
        Resource.monitor(tokenString.token, tambakId, formdata)
            .then((res) => {                
              const dataClonePh = {...self.state.datasetsPh[0]}
              const dataCloneSuhu = {...self.state.datasetsSuhu[0]}
              const dataCloneDo = {...self.state.datasetsDo[0]}
              const ph = res.data.map(value => value.ph);
              const suhu = res.data.map(value => value.suhu);
              const Do = res.data.map(value => value.do);              
              const label = res.data.map(value => value.waktuTanggal);

              dataClonePh.data = ph;
              dataCloneSuhu.data = suhu;
              dataCloneDo.data = Do;
              if(res.data != 0){
                var Ph = [dataClonePh]
                var Suhu = [dataCloneSuhu]
                var oksigen = [dataCloneDo]
              } else {
                var Ph = [{"data": [0]}] 
                var Suhu = [{"data": [0]}]
                var oksigen = [{"data": [0]}]
              }              
              self.setState({
                datasetsPh: Ph,
                datasetsSuhu: Suhu,
                datasetsDo: oksigen,
                labelPh: label
              })                           
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

  validate(text, type) {            
    if (type == 'tgl') {      
      this.setState({              
          filter: text
      })         
    }
  }


  render(){
    var dateNow = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var date = year + '-' + month + '-' + dateNow;
    return (
        <View style={styles.sectionContainer}>          
          <View style={styles.rowContainer}>              
              <DatePicker
                  style={styles.input}
                  date={this.state.filter}
                  mode="date"
                  placeholder={this.state.filter ? this.state.filter : "Tanggal"}
                  format="YYYY-MM-DD"
                  minDate="1970-05-01"
                  maxDate={date}                  
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"                                
                  // iconSource={require("../assets/images/calendar.png")}
                  customStyles={{
                      dateInput: { 
                        borderWidth: 3,
                        borderBottomWidth: 2
                      },
                      placeholderText: {
                        fontSize: 15,
                        color: "black"
                      },
                      dateText: {
                        fontSize: 15,
                        color: "black",
                        textAlign: "left"
                      },
                      // dateIcon: {
                      //   width:0,
                      //   height:0,
                      // },
                    }}            
                  onDateChange={(date) => {             
                      this.validate(date, 'tgl')          
                      this.setState({ filter: date })  
                      this.getData()          
                  }}                  
              />
          </View> 
          <ScrollView>
          <Text>
              Ph
          </Text>
          <LineChart
              data={{
              labels: this.state.labelPh,
              datasets: this.state.datasetsPh,           
              }}              
              verticalLabelRotation = {80}
              width={Dimensions.get("window").width - 20} // from react-native
              height={450}                
              // yAxisLabel={"Rp"}
              chartConfig={{                
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",              
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `black`,
              labelColor: (opacity = 1) => `black`,
              style: {
                  borderRadius: 16,                  
              }
              }}
              style={{
              marginVertical: 8,
              borderRadius: 16,              
              }}
          />

          <Text>
              Suhu
          </Text>
          <LineChart
              data={{
              labels: this.state.labelPh,
              datasets: this.state.datasetsSuhu,           
              }}              
              verticalLabelRotation = {80}
              width={Dimensions.get("window").width - 20} // from react-native
              height={450}                
              // yAxisLabel={"Rp"}
              chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `black`,
              labelColor: (opacity = 1) => `black`,
              style: {
                  borderRadius: 16
              }
              }}
              style={{
              marginVertical: 8,
              borderRadius: 16
              }}
          />

          <Text>
              Do
          </Text>
          <LineChart
              data={{
              labels: this.state.labelPh,
              datasets: this.state.datasetsDo,
              }}              
              verticalLabelRotation = {80}
              width={Dimensions.get("window").width - 20} // from react-native
              height={450}                
              // yAxisLabel={"Rp"}
              chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `black`,
              labelColor: (opacity = 1) => `black`,
              style: {
                  borderRadius: 16
              }
              }}
              style={{
              marginVertical: 8,
              borderRadius: 16
              }}
          />
          </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,         
    marginTop: 10,
    paddingHorizontal: 10,
  },
  rowContainer: {    
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },    
});

export default ReportGrafik;