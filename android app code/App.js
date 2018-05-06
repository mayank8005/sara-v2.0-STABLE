import React from 'react'

//importing react native comp
import { View, StyleSheet, Platform} from 'react-native'

//importing navigation class
import {StackNavigator} from 'react-navigation';

//importing other component
import Login from './components/Login'
import AppStatusBar from './components/StatusBar'
import ControlHub from './components/ControlHub'
import Alarm from './components/Alarm'
import Log from './components/LogComponent'

//importing colors
import {headerColor} from './utils/color'

//importing server helper class
import Server from './helper/ServerSupport'


//stack navigator which is responsible for every navigation
const MainNav = StackNavigator({
    
    home: {
        screen: Login
    },
    control:{
        screen: ControlHub
    },
    alarm:{
      screen: Alarm
    },
    log:{
      screen: Log
    }
  },{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

export default class App extends React.Component {
  
  //static server helper const
  static server = new Server()
  
  render() {

    //connecting to server
    App.server.connect()
    
    return (
          <View style={{flex:1}}>
            <AppStatusBar backgroundColor={headerColor} barStyle='light-content'/>
            <MainNav/>
          </View>
    );
  }
}
