import React from 'react'

//importing react native components
import {StyleSheet, Text, View} from 'react-native'

//importing colors
import {LightBlueShade, WhiteColor, headerColor} from '../utils/color'

//this class will provide form component to alarm screen
//this form will contain time picker ..gpio id...set alarm btn etc
export default class AlarmForm extends React.Component{

    render(){
        return(
            <View style={style.container}>
                <Text style={{color: WhiteColor, size:35, fontWeight:'bold'}}>
                    Comming soon !
                </Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    
    //style for container of the component
    //it basically cover whole component
    container:{
        flex: 1,
        padding: 20,
        backgroundColor: LightBlueShade,
        justifyContent: 'center',   // will be removed if req
        alignItems: 'center',       //last to property is only added for that coming soon 
                                    //text
    }

})