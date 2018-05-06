import React from 'react'

//importing react native comp
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native'

//importing other component
import Header from './Header'
import LoginForm from './LoginForm'
import AppStatusBar from './StatusBar'

//importing colors
import {LightBlueShade, WhiteColor, headerColor} from '../utils/color'

//this class will display staring login screen
export default class Login extends React.Component{

    render(){
        return(
        <KeyboardAvoidingView 
          style={style.bg}
          behavior={'padding'}
          keyboardVerticalOffset={Platform.select({ios: 0, android: 25})}
        >
            <View style={style.headerView}>
                <Header/>
            </View>
            <View style={style.contentContainer}>
                <LoginForm navigation={this.props.navigation}/>
            </View>
        </KeyboardAvoidingView>
        )
    }
}

const style = StyleSheet.create({
  
    //styling for background 
    bg: {
      backgroundColor: LightBlueShade,
      flex: 1,
    },
    //styling for header view
    headerView:{
      flex:1
    },
    //styling for content-container
    contentContainer: {
      flex:3,
      justifyContent: 'center',
    }
  
  })
  