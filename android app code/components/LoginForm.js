//importing react
import React from 'react'

//importin react native component
import {
        View, 
        Text, 
        StyleSheet, 
        TextInput, 
        TouchableOpacity, 
        KeyboardAvoidingView,
        ActivityIndicator
    } from 'react-native'

//importing modal
import Modal from "react-native-modal"

//importing colors
import {BlueShade, WhiteColor, BlackColor, LightBlueShade, ErrorMsg} from '../utils/color'

//importing icon
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'

//importing app.js to use serevr helper
import App from '../App'

//importing navigation action for navigation and reset stack
import { NavigationActions } from 'react-navigation';

//this class renders Login form component of our app
class LoginForm extends React.Component{

    state = {
        deviceId : null,
        password: null,
        loading: false,     //true when we are trying to login
        failed: false,       //true when something went wrong with login
        error: '-',          //will contain error msg of login
    }

    
    timeout = null      //will contain timeout related to login

    //server helper 
    server = App.server

    //will handle login failed
    //have to pass error message that is to be displayed
    onLoginFailed = (errorMsg)=>{
        //clearing timeout
        if(this.timeout){

            console.log('clearing timeout')
            clearTimeout(this.timeout)
            this.timeout = null
        
        }
        
        //setting new state
        this.setState({failed: true, error: errorMsg, loading: false})
    }

    //will handle login successfull
    //will have to pass result obj
    onLoginComplete = (result)=>{
        
        //clearing timeout if any
        if(this.timeout){
            clearTimeout(this.timeout)
        }

        //clearing timeout variable
        this.timeout = null

        //naviagting to new page(control page)
        
        const resetAction = NavigationActions.reset({
                type: 'Navigation/RESET',
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'control' })],
              });
        const {dispatch} = this.props.navigation
        dispatch(resetAction)
        
    }

    //this method will handel click of login button
    onLoginClickHandler = ()=>{
        
        //checking if credentials are entered by the user or not
        if(!this.state.deviceId||!this.state.password){
            this.setState({failed: true, error: 'enter credentials'})
            return
        }
        
        //SETTING LOADING = TRUE (TO LOAD LOADING MODAL)
        //AND FAILED : TRUE (TO REMOVE FAILED MSG IF PRESENT)
        this.setState({loading: true, failed: false})  

        //SETTING UP REQUEST TIMEOUT 
        this.timeout = setTimeout(()=>{
            
            //removing modal / setting loading to false
            this.setState({loading: false, failed: true, error: 'connection timeout'})
    
        }, 10000)

        //REQUESTION LOGIN
        this.server.login( this.state.deviceId ,
                           this.state.password, 
                           this.onLoginFailed, 
                           this.onLoginComplete)
    }

    render(){
        return(
            <View style={style.container}>

                <Modal
                    isVisible = {this.state.loading} 
                    style={{height:200}}
                >    
                    <View style={style.modalContainer}>
                        <ActivityIndicator size="large" color={WhiteColor} />
                        <Text
                            style={style.loadingText}
                        >
                            <MaterialCommunityIcons name='lock'  size={60}/>
                            Logging in!
                        </Text>
                    </View>
                </Modal>

                <View style={style.contentBox}>

                        {
                            this.state.failed?(
                                <Text style={style.loginErrorMsg}>
                                    <MaterialCommunityIcons name='emoticon-sad' size={50}/>
                                    {this.state.error}
                                </Text>
                            ):(
                                <Text style={style.loginHead}>
                                    <MaterialCommunityIcons name='login' size={50}/>
                                    Enter your credentials :
                                </Text>
                            )
                        }    

                        <TextInput
                            placeholder = 'enter device id'
                            value= {this.deviceId}
                            style = {style.field}
                            onChangeText = {(deviceId) => this.setState({deviceId})}
                            placeholderTextColor = {WhiteColor}
                            underlineColorAndroid = {WhiteColor}
                            maxLength = {4}
                            />

                        <TextInput
                            placeholder = 'password'
                            value= {this.password}
                            style = {style.field}
                            onChangeText = {(password) => this.setState({password})}
                            secureTextEntry = {true}
                            placeholderTextColor = {WhiteColor}
                            underlineColorAndroid = {WhiteColor}
                            maxLength = {16}
                        />

                        <TouchableOpacity style={style.button} onPress={this.onLoginClickHandler}>
                            <View style={style.buttonContent}>
                                <MaterialIcons size={50} name='navigate-next' 
                                    style={style.loginIcon}/>
                                <Text style={style.bottonText}>
                                    Connect
                                </Text>
                            </View>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({

    //style for login loading modal
    modalContainer: {
       
        backgroundColor: BlueShade,
        justifyContent: 'center',
        height: 400,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: WhiteColor,
    },

    //style for login loading text inside modal
    loadingText:{
        fontWeight: 'bold',
        fontSize: 40,
        color: WhiteColor,
    },

    //style for container ie. outermost view
    container:{
        flex:1,
        padding: 15,
        shadowColor: BlackColor,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 6,
        shadowOpacity: 0.8
    },

    //style for content box...view inside container
    contentBox: {
        flex: 1,
        padding: 15,
    },

    //login-heading
    loginHead: {
        color: WhiteColor,
        fontWeight: 'bold',
        fontSize: 16,
    },

    loginErrorMsg:{
        color: ErrorMsg,
        fontWeight: 'bold',
        fontSize: 16
    },
    //style for login field
    field: {
        color: WhiteColor, 
        marginTop: 30,
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    //style for button ex. login button
    button:{
        borderWidth: 3,
        borderColor: WhiteColor,
        height: 55,
        marginTop: 25,
    },

    //style for view inside button
    buttonContent:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: BlueShade,
    },

    //style for button text
    bottonText:{
        flex:3,
        fontSize: 14,
        color: WhiteColor,
        padding: 13,
        fontWeight: 'bold', 
    },

    //style for login icon in the button
    loginIcon:{
        flex: 1,
        color: WhiteColor,
    }
})

//exporting LoginForm
export default LoginForm