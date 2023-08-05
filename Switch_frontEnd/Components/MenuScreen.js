import React, { useState,useEffect } from 'react';
import { View,Text, StyleSheet,TouchableOpacity,Switch, StatusBar } from 'react-native';
import { Avatar } from 'react-native-elements';
import {COLORS} from '../Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import AlertView from './AlertView';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';



function MenuScreen({userName,userNumber,setMenuOption,imageLocation}) {
    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);
    const navigation=useNavigation();
    const [enableAbbreviationShow,setEnableAbbreviationShow] = useState();

    const handleEditProfile = ()=>{
            navigation.navigate("EditProfile");
    };
    const handleAlertPopUp = ()=>{
        return(
            Alert.alert("Info","If enabled you can get expansions of abbreviations")
        )
    }

    useEffect(() => {
        SecureStore.getItemAsync('enableAbbreviationShow')
        .then(valueStr=>{
            if (valueStr==="true"){
                setEnableAbbreviationShow(true);
            }
            else{
                setEnableAbbreviationShow(false);
            }
        })
    }, []);


    const handleChange =()=>{
        setEnableAbbreviationShow(!enableAbbreviationShow);
    }

    useEffect(() => {
            return ()=>{
                if (enableAbbreviationShow){
                    SecureStore.setItemAsync('enableAbbreviationShow',"true");
                }
                else{
                    SecureStore.setItemAsync('enableAbbreviationShow',"false");
                }     
        }  
    }, [enableAbbreviationShow]);

    //managing network status and its status display
    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        setTimeout(()=>setShow(false),5000)
    }, [show])

    const handleConnectionChange= (e)=>{
        setPastOnlineStatus(online);
        setOnline(e.isConnected);
    }

    return (
        <View
        style={[styles.container]}>
            { show && !pastOnlineStatus && online &&
                    <AlertView icon={<Ionicons name="cellular-sharp" size={30} color="green" />} content={"Back to Online"} />
            }
            {show && !online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={30} color="orange" />} content={"You are Offline"} />
            }         
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View
             style={[styles.mainView]}>
                <View style={styles.profile}>
                    <TouchableOpacity style={{width:'100%',flexDirection:'row',alignItems:'center',padding:20,paddingTop:10}} onPress={()=>{if(online){handleEditProfile()}else{setShow(true)}}}>
                        <Avatar 
                            icon={{name:'user', type:'font-awesome'}}
                            size='large'
                            rounded
                            activeOpacity={0.7}
                            source={{uri:imageLocation}}
                        />
                        <View style={[{flexDirection:'column',alignItems:'flex-start'},styles.user]}>
                            <Text numberOfLines={1} style={{color:'black',fontSize:20}} >{userName}</Text>
                            <Text numberOfLines={1} style={{fontSize:13}}>{userNumber}</Text>
                        </View>
                        <Entypo style={{position:'absolute',bottom:0,right:30}}  name="edit" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{width:'100%',marginTop:20,flexDirection:'column',alignItems:'center',}}>
                    {/* <Text style={{fontSize:20,color:COLORS.primary,marginBottom:10,fontWeight:'bold'}}>Options</Text> */}
                    <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-evenly'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',width:'80%',paddingLeft:15}}>
                            <TouchableOpacity onPress={handleAlertPopUp}>
                            <MaterialIcons name="info" size={22} color={COLORS.primary} />
                            </TouchableOpacity>
                            <Text style={{marginLeft:20,fontSize:16,color:enableAbbreviationShow?COLORS.primary:'black'}}>AbbreviationShow</Text>
                        </View>
                        <Switch
                            onValueChange={handleChange} 
                            value={enableAbbreviationShow}
                            trackColor={{false:'#8f8f8f66',true:COLORS.primary+"33"}} 
                            thumbColor={enableAbbreviationShow?COLORS.primary:"#8f8f8f"}
                        />
                    </View>
                    <TouchableOpacity style={{width:'100%',padding:20,alignItems:'center',justifyContent:'flex-start',marginTop:10,flexDirection:'row'}} onPress={()=>{if (online){navigation.navigate("TimerMessagesView")}else{setShow(true)}}}>
                        <MaterialCommunityIcons name="message-text-clock" size={22} color={COLORS.primary} />
                        <Text style={{fontSize:16,color:'black',marginLeft:20}}>Timer Messages</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.maskView}>
                <TouchableOpacity
                    style={{width:'100%',height:'100%'}}
                    onPress={()=>{setMenuOption(false)}} 
                >
                    <View style={{position:'absolute',padding:20,top:0,left:0,backgroundColor:'white',width:'100%'}}>
                        <Ionicons name="chevron-back" size={35} color="black" />
                    </View>
                    
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default MenuScreen;

const styles = StyleSheet.create({
    mainView:{
        backgroundColor:'white',
        height:'100%',
        width:'80%'
    },
    maskView:{
        backgroundColor:COLORS.primary+"08",
        width:'40%',
        height:'100%'
    },
    user:{
        width:'60%',
        marginTop:10,
        marginBottom:10,
        marginLeft:20,
    },
    profile:{
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        marginBottom:10,
        paddingTop:30,
        paddingBottom:30,
        borderBottomRightRadius:8,
        borderBottomLeftRadius:8,
        borderBottomColor:'#00000024',
        borderBottomWidth:1
    },
    container:{
        elevation:10,
        position:'absolute',
        left:0,
        top:0,
        width:'100%',
        height:'100%',
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        zIndex:1,
    },
    image:{
        width:130,
        height:130,
        marginTop:20
    }
})