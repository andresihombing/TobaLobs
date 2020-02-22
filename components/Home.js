import React from 'react';
import { 
    StyleSheet, View, Text,
    TouchableOpacity, ScrollView
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Home screen
 */
export default class Home extends React.Component {

    static navigationOptions = {
        header: null
    }; 

    goToCreate(){
        console.warn('asdf')
        this.props.navigation.navigate('TambahTambak');
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style = {styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTittle}>Selamat Datang Di TobaLobs</Text>
                    </View>                    

                    <TouchableOpacity style = {styles.buttonContainer}
                        onPress={() => this.goToCreate()}>
                        <Text style={styles.txtTambah}>Tambah Tambak</Text>
                    </TouchableOpacity>                    

                    <View style={styles.tambakContainer}>
                        {/* <Text>Belum Mempunyai Tambak</Text> */}
                        <TouchableOpacity style={styles.nameTambak}>
                            <Text style= {styles.txtTambah}>asdf</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nameTambak}>
                            <Text style= {styles.txtTambah}>asdf</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nameTambak}>
                            <Text style= {styles.txtTambah}>asdf</Text>
                        </TouchableOpacity>
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
        // flex: 2,
        backgroundColor: 'blue',
        paddingVertical: 10,       
        padding: 50,        
        width: '48%',
        aspectRatio: 2,
        marginBottom: 15,
        justifyContent: 'center'
        // marginTop: 15,
        // alignItems: 'center',
        // height: 200
    }
});