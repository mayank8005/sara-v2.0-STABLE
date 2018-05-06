import React from 'react'

//importing react native components
import {StyleSheet, Text, View, FlatList} from 'react-native'

//importing other components
import LogHeader from './LogHeader'
import LogListItem from './LogListItemComponent'

//importing app.js for server variable
import App from '../App'

//importing color
import { LightBlueShade } from '../utils/color';

/* This class will render log component screen */
export default class LogComponent extends React.Component{

    //storing server variable for reference
    server = App.server

    state = {
        logs: []
    }

    //this is a callback function for log response listener
    logCallback = (response)=>{

        console.log('log callback called')
        if(response)
            this.setState({logs: response})
    }

    //before component will get mount we will fire log request
    componentWillMount(){
        
        //initializing log request
        this.server.requestLogs(this.logCallback)
    }

    //this function will render log list item
    renderLogListItem = (log)=>(
        <LogListItem
            changeTo = {log.item.changeTo}
            GPIO = {log.item.GPIO}
        />
    )


    render(){
        console.log('render')
        return(
            <View style={style.container}>
                <LogHeader/>
                <FlatList
                    data={this.state.logs}
                    renderItem = {this.renderLogListItem}
                    keyExtractor={(log, index) => index}
                    style={style.FlatList}
                />
            </View>
        )
    }
}

const style = StyleSheet.create({

    container:{
        flex: 1
    },
    FlatList:{
        flex:1,
        backgroundColor: LightBlueShade,
        padding: 16
    }
})