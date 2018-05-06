import React from 'react'
//importing react native components
import {StyleSheet, Text, View} from 'react-native'
//importing color
import {headerColor, WhiteColor, BlackColor} from '../utils/color'
//importing icon
import {Ionicons} from '@expo/vector-icons'


//this function will return a header for  Alarm component
export default function AlarmHeader(props){
    return(
        <View style = {style.header}>
                
        <Text style={style.titleText}>
            <Ionicons name='md-timer' size={50}/>
            Alarm
        </Text>

        <Text style={style.subText}>
           You can now simply time your appliances on/off time
        </Text>
   </View> 
    )
} 


//creating style for toolbar
const style = StyleSheet.create({

    // style for whole header component
    header: {
        backgroundColor: headerColor,
        justifyContent: 'center',
        shadowColor: BlackColor,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    
    //style for title text
    titleText:{
        margin: 20,
        color: WhiteColor,
        fontWeight: 'bold',
        fontSize: 20,
    },

    //style for subText 
    subText:{
        color: WhiteColor,
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 15,
        fontWeight: 'bold',
    }
})