import React from 'react'

//importing react native comp
import { Text, View, StyleSheet} from 'react-native'

//importing colors
import {LightBlueShade, WhiteColor} from '../utils/color'

//importing component
import ControlBox from './ControlBox'

//importing icon
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'

//this class will display control hub page
export default class ControlHub extends React.Component{


    render(){
        return(
        <View style={style.container}>
            <ControlBox navigation={this.props.navigation}/>
        </View>
        )
    }
}

const style = StyleSheet.create({
  
    //styling for background 
    container: {
      backgroundColor: LightBlueShade,
      flex: 1,
    },
  })
  