import React from 'react'

//import react native component
import {StyleSheet, Text, View, FlatList} from 'react-native'

//importing icon
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { WhiteColor, ErrorMsg, OK } from '../utils/color';

//this function will basically give log list item
export default function LogListItemComponet(props){

    if(props.changeTo===0){
        return(
            <View style={style.container}>
                <View style={style.imagePart}>
                    <MaterialCommunityIcons name='flash-off' size={45} style={style.iconStyleRed}/>
                </View>
                <View style={style.textPart}>
                    <Text style={style.textStyleRed}> Port {props.GPIO}: On -> Off  </Text>
                </View>
            </View>
        )
    }
    else{
        return(
            <View style={style.container}>
                    <View style={style.imagePart}>
                        <MaterialCommunityIcons name='flash-outline' size={50} style={style.iconStyleGreen}/>
                    </View>
                    <View style={style.textPart}>
                        <Text style={style.textStyleGreen}> Port {props.GPIO}: Off -> On  </Text>
                    </View>
            </View>
        )
    }
}


const style = StyleSheet.create({

    container:{
        flexDirection: 'row',
        padding: 5,
        marginBottom: 5,
    },

    //this is a view which contain a vec image
    imagePart:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    },
    //style of vec image part

    //for red color style
    iconStyleRed:{
        color: ErrorMsg
    },

    //for green color style
    iconStyleGreen:{
        color: OK
    },
    //this is a view which contain text
    textPart:{
        flex: 3,
        justifyContent: 'center',
        alignItems:'center'
    },
    //style of log text
    //text:Red
    textStyleRed:{
        color: ErrorMsg,
        fontWeight: 'bold',
        fontSize: 20
    },
    //Text: Green
    textStyleGreen:{
        color: OK,
        fontWeight: 'bold',
        fontSize: 20
    }
})