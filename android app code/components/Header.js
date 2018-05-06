//importing react js 
import React from 'react'
//importing react native components
import {StyleSheet, Text, View} from 'react-native'
//importing color
import {headerColor, WhiteColor, BlackColor} from '../utils/color'
//importing icon
import {FontAwesome} from '@expo/vector-icons'


//this class renders Header component of our app
class Header extends React.Component{

    render(){

        return(
           <View style = {style.header}>
                
                <Text style={style.titleText}>
                    <FontAwesome name='home' size={50}/>
                    S.A.R.A
                </Text>

                <Text style={style.subText}>
                    smart activated residential automation
                </Text>
           </View> 
        )
    }
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
    
    //style for title text(it contain SARA and home icon)
    titleText:{
        margin: 20,
        color: WhiteColor,
        fontWeight: 'bold',
        fontSize: 20,
    },

    //style for subText (ie full form of SARA)
    subText:{
        color: WhiteColor,
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 15,
    }
})

//exporting header
export default Header