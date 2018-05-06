import React from 'react'

//importing react native comp
import { Text, View, StyleSheet, Switch, TouchableNativeFeedback } from 'react-native'

//importing navigation action for navigation and reset stack
import { NavigationActions } from 'react-navigation';

//importing colors
import {LightBlueShade, 
            WhiteColor, 
            BlueShade, 
            BlackColor, 
            OK, 
            btn1Color, 
            btn2Color, 
            btn3Color, 
            btn4Color
        } from '../utils/color'

//importing icon
import {MaterialCommunityIcons} from '@expo/vector-icons'

//importing app.js for server variable
import App from '../App'


//this class will render control tool
export default class ControlBox extends React.Component{

    //storing server variable for reference
    server = App.server
    
    state={

        status: (this.server.moduleConnected&&this.server.moduleConnected.auto)?'auto pilot':
                    (this.server.moduleConnected?'connected':'disconnected'), //status of system
        
        //this will store array of GPIO ports with GIPO object as element
        //this will define everything about toggle btn
        GPIOPorts: (this.server.moduleConnected&&this.server.moduleConnected.auto)?
                        []:(this.server.moduleConnected?this.server.moduleConnected.GPIO:[]),

        imageNameToDisplay: (this.server.moduleConnected&&this.server.moduleConnected.auto)?
                        'plane-shield':'home-automation',

        autoMode: this.server.moduleConnected?this.server.moduleConnected.auto:false

    }

    //this function returns a function that handle toggle btn event
    //this function needs 3 parameter
    //1. GPIOId: aka id of GPIO port
    //2. changeStatus : new status of GPIO port
    //3. name of the port
    toogleHandler = (GPIOId , changeTo, name)=>(()=>{
        //setting new status
        this.setState((state)=>({
            GPIOPorts: state.GPIOPorts.map((GPIO)=>{
                //checking if GPIO id is same as port no/id that is to be changed
                if(GPIO.id!==GPIOId)
                    return GPIO
                else{
                    //changing GPIO status as per the change
                    GPIO.status = changeTo
                    return GPIO
                }
            })
        }))

        //changing GPIO status in server
        this.server.changeGPIO(GPIOId, changeTo)
    })

    handleAutoPilotBtn = ()=>{
        
        //if auto mode does is off
        if(!this.state.autoMode){
            this.server.requestAutoPilot((result)=>{

                console.log('changing state from non auto mode to auto')
                
                if(!result){
                    console.log('autopilot failed')
                    return
                }
                
                //changing state
                this.setState({
                    imageNameToDisplay: 'plane-shield', 
                    status: 'auto-pilot', 
                    GPIOPorts: [],
                    autoMode: true
                }) 
            })
        }else{
            this.server.requestAutoPilotOff((GPIO)=>{

                console.log('changing state from  auto mode to manual')
                //changing state
                this.setState({
                    imageNameToDisplay: 'home-automation', 
                    status: 'connected', 
                    GPIOPorts: GPIO,
                    autoMode: false
                })
            })
        }
    }

    handleLogBtn = ()=>{
        //navigating to log component
        this.props.navigation.navigate('log')
    }

    handleLogout = ()=>{
        //setting serverSupport config to logout state
        this.server.isLogin = false
        this.server.id = null
        this.server.password = null
        this.server.moduleConnected = false
        this.server.count = 0

        //naviagting to new page(control page)
        
        const resetAction = NavigationActions.reset({
            type: 'Navigation/RESET',
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'home' })],
          });
        const {dispatch} = this.props.navigation

        //performing navigating action
        dispatch(resetAction)
    }
 
    render(){
     
        return(
            <View style={style.controlBox}>
                <View style={style.iconArea}>
                    <MaterialCommunityIcons name={this.state.imageNameToDisplay} size={100} style={style.centerIcon}/>
                    <Text style={style.centerIconText}>
                        {this.state.status}
                    </Text>
                </View>
                <View style={style.controlContainer}>
                    <View style={style.toggleBoxContainer}>
                        <View style={style.toggleBox}>
                            <View style={style.toggleContainer}>
                                {this.state.GPIOPorts?this.state.GPIOPorts.map((GPIO)=>(
                                    <View  key={GPIO.id} style={style.toggle}>
                                        <Text style={style.toggleLabel}>{GPIO.name}</Text>
                                        <Switch 
                                            style={style.switch} 
                                            value={GPIO.status===1?false:true}
                                            onTintColor={OK}
                                            onValueChange={
                                                this.toogleHandler(GPIO.id, 
                                                                GPIO.status===1?0:1, 
                                                                GPIO.name)
                                            }
                                        />
                                    </View>
                                )):null}
                            </View>
                        </View> 
                    </View>
                    <View style={style.btnControlContainer}>
                         <View style={style.btnContainer}>
                         
                            <TouchableNativeFeedback
                                    
                                    background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={style.btn1}>
                                            <Text style={style.btnText}>SOS</Text>
                                        </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback
                                    onPress={this.handleAutoPilotBtn}
                                    background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={style.btn2}>
                                            <Text style={style.btnText}>Auto Pilot</Text>
                                        </View>
                            </TouchableNativeFeedback>
                            
                            <TouchableNativeFeedback
                                    onPress={this.handleLogBtn}
                                    background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={style.btn3}>
                                            <Text style={style.btnText}>Logs</Text>
                                        </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback
                                    onPress={this.handleLogout}
                                    background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={style.btn4}>
                                            <Text style={style.btnText}>Logout</Text>
                                        </View>
                            </TouchableNativeFeedback> 
                         </View>
                    </View>   
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
  
    //style for control box
    controlBox: {
        flex: 1,
        shadowColor: BlackColor,
        shadowOffset: {
            width: 0,
            height: 5
        },
    },

    iconArea:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //style for icon 
    centerIcon:{
        color: WhiteColor,
    },

    //style for center icon text ex(connected)
    centerIconText:{
        color:WhiteColor,
        fontSize: 30,
        fontWeight: 'bold'
    },

    //control container is a area which is below icon area
    controlContainer:{
        flex:1,
        flexDirection: 'row',
        backgroundColor: BlueShade,
    },

    //toggle box container is area where toggle box resides
    toggleBoxContainer:{
        flex: 3,
    },

    //style for toggle area
    toggleBox:{
        flex:1,
        justifyContent: 'flex-start',
    },

    //style for box that contain toggle btns
    toggleContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
    },

    //style for toggle btn
    toggle:{
        flexDirection: 'row',
        margin: 15,   
    },

    //style for toggle btn label
    toggleLabel:{
        flex:1,
        color: WhiteColor,
        fontSize: 20,
        margin: 10,
        fontWeight: 'bold',
       
    },

    //style for toggle switch(switch component)
    switch:{
        flex:1,
    },

    //btnControlCon is a area where btnControl is present
    btnControlContainer:{
        flex:1
    },
    //this area contain all the btns
    btnContainer:{
        flex:1
    },
    //styles for btn in control box area
    btn1:{
        flex:1,
        backgroundColor: btn1Color,
        justifyContent: 'center',
        alignItems:'center'
    },
    btn2:{
        flex:1,
        backgroundColor: btn2Color,
        justifyContent: 'center',
        alignItems:'center'
    },
    btn3:{
        flex:1,
        backgroundColor: btn3Color,
        justifyContent: 'center',
        alignItems:'center'
    },
    btn4:{
        flex:1,
        backgroundColor: btn4Color,
        justifyContent: 'center',
        alignItems:'center'
    },
    btnText:{
        color: WhiteColor,
        fontWeight: 'bold'
    }


  })
  