import React from "react";
import{StyleSheet,View,ScrollView,Image,Text,TouchableOpacity,RefreshControl, AsyncStorage} from "react-native";

export default class TentangTobalobs extends React.Component {   
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>                
            <ScrollView>                
                <Image 
                    style = {{width: '100%', marginTop: 5}}
                    source = {require('./assets/icons/tobalobs.png')} />
                <Text style = {styles.text}>TobaLobs adalah sebuah aplikasi mobile, dimana aplikasi ini dapat memonitoring tambak yang telah dibuat.
                    Pengguna dapat melihat pH, Suhu, u Do air yang ada di tambak tersebut. Pengguna juga akan mendapat notifikasi jika ada penyimpangan dari kondisi air
                    yang ada di tambak tersebut. Selain itu, Pengguna juga akan mendapat notifikasi kapan untuk memberi pakan, pemisahan induk dan bibit, perkawinan, hingga
                    kapan akan melakukan panen.
                </Text>
                <Text style = {styles.text}>Pada aplikasi ini juga, pengguna akan diberikan beberapa informasi atau tips untuk melakukan budidaya yang baik.
                </Text>
                </ScrollView>
            </View>                
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',        
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