import React from 'react'

//importing react-native component
import { View, StyleSheet, Text} from 'react-native'

//importing other components
import AlarmHeader from './AlarmHeader'
import AlarmForm from './AlarmForm'


/*This class will render Alarm component of our application */
export default class Alarm extends React.Component{

    render(){
        return(
            <View style={{flex:1}}>
                <AlarmHeader/>
                <AlarmForm/>
            </View>
        )
    }
}