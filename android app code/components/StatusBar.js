import React from 'react'

//importing status bar component
import {StatusBar, View} from 'react-native'

//importing constant for getting status bar height constant
import {Constants} from 'expo'

//this function return status bar for our app
export default function AppStatusBar({backgroundColor, ...props}) {
    return(
        <View style={{backgroundColor, height: Constants.statusBarHeight}}>
            <StatusBar backgroundColor={backgroundColor} translucent {...props}/>
        </View>
    );
}