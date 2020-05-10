import React from 'react'
import {
    View, StyleSheet, ScrollView, Text, AsyncStorage
} from 'react-native'
import Resource from './network/Resource'
import DatePicker from 'react-native-datepicker'
import { Table, Row, Rows } from 'react-native-table-component';
import I18n from '../i18n/i18n';


export default class DetailTambak extends React.Component {
    constructor(props) {
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
            tableHead: ['Waktu', 'Ph', 'Suhu', 'DO'],
            tableData: [
                // ['08.00 WIB', '7', '3', '4'],
                // ['11.00 WIB', '7', '3', '4'],
                // ['18.00 WIB', '7', '3', '5'],            
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
            let formdata = this.state.filter            
            Resource.monitor(tokenString.token, tambakId, formdata)
                .then((res) => {                                    
                    // const ph = res.data.map(value => value.ph);
                    res.data = res.data.map(item => {                        
                        var waktuTanggal = item.waktuTanggal
                        var ph = item.ph
                        var suhu = item.suhu
                        var Do = item.do
                        const datatable = [[waktuTanggal, ph, suhu, Do]]                        
                        var table = this.state.tableData.concat(datatable);
                        this.setState({
                            tableData: table
                        })
                        // console.warn(table)
                    });                    
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

    render() {                        
        var dateNow = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var date = year + '-' + month + '-' + dateNow;
        return (                        
            <View style={styles.container}>                
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
                            dateIcon: {
                                width:0,
                                height:0,
                            },
                            }}            
                        onDateChange={(date) => {             
                            this.validate(date, 'tgl')          
                            this.setState({ filter: date })  
                            this.getData()          
                        }}                  
                    />
                </View>       
                <ScrollView>                          
                <View> 
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.tableData} textStyle={styles.text}/>
                    </Table>
                </View>
                </ScrollView>
            </View>            
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingHorizontal: 10
    },
    head: {
        height: 40,         
        backgroundColor: '#f7c744',        
    },
    text: { 
        margin: 6,
        color: 'black',        
    },
    textHead: {
        color: 'black',        
        padding: 20
    },
    rowContainer: {    
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10
    },   
})
