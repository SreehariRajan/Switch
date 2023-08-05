import React, { useState,useEffect } from 'react';
import { Text,View,TextInput, TouchableOpacity,StyleSheet,StatusBar, Keyboard, KeyboardAvoidingView } from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {COLORS} from '../Colors';
import { LinearGradient } from 'expo-linear-gradient';
import sendOtp from '../api/sendOtp';
import NetInfo from '@react-native-community/netinfo';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import AlertView from './AlertView';
import LoadingView from './LoadingView';

function CreateAccount() {

    const navigation = useNavigation();
    const [numberText,setNumberText]=useState("");
    const [err,setErr]=useState("");
    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [alertShow,setAlertShow] = useState(false);
    const [keyboardOn,setKeyboardOn] = useState(false);
    const [loading,setLoading] = useState(false);
    const [failed,setFailed] = useState(false);

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow',()=>setKeyboardOn(true));
        Keyboard.addListener('keyboardDidHide',()=>setKeyboardOn(false));
        return () => {
            Keyboard.removeAllListeners;
            
        }
    }, [])
    const onSubmit = async() =>{
        setErr("");
        if (numberText.length===10){
            await Keyboard.dismiss();
            setLoading(true);
            const response = await sendOtp(numberText)
                .then((res)=>{
                    setLoading(false);
                    console.log(res.status)
                    if (res.status===200){
                        if (res.data?.message === "OTP send successfully"){
                            setNumberText("");
                            navigation.navigate("VerifyOtp",{phoneNumber:numberText});
                        }
                    }
                    else{
                        setFailed(true);
                    }
                })
        }
        else{
            setErr("Enter a valid number");
        }
    }
    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        if (online){
            setTimeout(()=>setPastOnlineStatus(online),3000);
        }
        return () => {
            
        }
    }, [online])

    useEffect(() => {
            setTimeout(()=>setFailed(false),3000);
    }, [failed])

    const handleConnectionChange= (e)=>{
        setPastOnlineStatus(online);
        setOnline(e.isConnected);
    }
    return (
        <View style={styles.container}>
             <StatusBar backgroundColor={'white'} barStyle="dark-content" />
            {loading &&
                <LoadingView />
            }
            {!pastOnlineStatus && online &&
                <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
            }
            {!online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
            }
            {failed &&
                <AlertView icon={<MaterialIcons name="error" size={26} color="red" />} content={"Failed sending OTP"} />
            }
            {!keyboardOn &&
            <View style={{position:'absolute',paddingTop:100,top:0,backgroundColor:'white',width:'100%',alignItems:'center',justifyContent:'center'}} >
                <View style={{height:100,width:100,borderRadius:60,backgroundColor:'gray'}}>
                </View>
                <Text style={{fontSize:30,color:'black'}}>Connect In</Text>
            </View>
            }
            
            <View style={styles.subDiv}>
                {
                    numberText.length>0 &&
                    <Text style={{textAlign:'left',width:'70%'}}>Enter your phone number</Text>
                }
                <View style={styles.numberDiv}>
                    <Text style={styles.country}>{"+91"}</Text>
                    <TextInput
                        keyboardType="number-pad"
                        placeholder="Enter your number"
                        placeholderTextColor='#a8a8a8'
                        pla
                        style={styles.inputNumber} 
                        value={numberText}
                        onChangeText={(n)=>{setNumberText(n);setErr("")}}
                        maxLength={10}  
                    />
                </View>
                <Text style={styles.err}>{err}</Text>
                    <LinearGradient 
                        start={{x:0,y:0}} 
                        end={{x:1,y:0}} 
                        // style={{}} 
                        style={[styles.submit,(!online || numberText.length<10) && {borderColor:COLORS.primary,borderWidth:1,borderRadius:7}]}
                        colors={(numberText.length===10 && online )?[COLORS.primary,COLORS.secondary]:["white","white"]}>
                            <TouchableOpacity 
                                disabled={!online || numberText.length<10?true:false}
                                style={{width:'100%',alignItems:'center'}}
                                
                                onPress={onSubmit}
                            >

                                <Text style={[styles.submitText,(online && numberText.length===10) ?{color:"white"}:{color:COLORS.primary}]}>SEND OTP</Text>
                            </TouchableOpacity>
                    </LinearGradient>
                
                <Text style={{marginTop:20,}}>terms and conditions</Text>
                
            </View>
        </View>
    );
}

export default CreateAccount;

const styles = StyleSheet.create({
    err:{
        fontSize:15,
        color:COLORS.primary,
        marginBottom:20
    },
    inputNumber:{
        width:'90%',
        paddingLeft:10,
        height:'100%',
        fontSize:18,
        color:'black'
    },
    country:{
        fontSize:18,
        color:'black'
    },
    numberDiv:{
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
        width:'70%',
        height:50,
        borderRadius:7,
        marginBottom:20,
        shadowColor:'black',
        borderBottomColor:COLORS.primary,
        borderBottomWidth:2,   
    },
    submitText:{
        fontSize:16
    },
    submit:{
        padding:12,
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:7,
    },
    subDiv:{
        flexDirection:'column',
        width:'100%',
        alignItems:'center',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:'transparent',
    },
    input:{
        paddingLeft:10,
        paddingRight:10,
        width:'80%',
        height:50,
        backgroundColor:'#3d3a7fa1',
        borderRadius:7,
        fontSize:18,
        marginBottom:20,
        color:'white'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      width:'100%',
      justifyContent:'center',
      flexDirection:'column'
    },
  });