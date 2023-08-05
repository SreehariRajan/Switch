import { useNavigation } from '@react-navigation/native';
import React,{useEffect, useState,useContext} from 'react';
import { View,Text,StyleSheet,Image,TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import {Context} from '../Context';
import io from 'socket.io-client';
import { AsyncStorage } from 'react-native';
import FetchMessagesLength from '../hooks/useMessagesLength';
import {COLORS} from '../Colors';
import CheckBox from './CheckBox';
import {BASE_URL} from '../constants/urls';
import { findDuration } from '../services/findDuration';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import FetchLastSeen from '../hooks/useLastSeen';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';


function ContactView({lastSeen,setLastSeen,forwardScreen,statusView,timeObject,name,Mssg,imageUri,tonumber,online,setSearchClicked,chatScreen,starredMssgs,mssgArrayPart,setMssgArrayPart,handleInfiniteScrolling,mssgArray,ScrollRef,}) {

    const [onlineCheck,setOnlineCheck] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const navigation = useNavigation();
    const [notificationNumber,setNotificationNumber] = useState(0);
    const [checked,setChecked] = useState(false);
    const [typing,setTyping] = useState(false);
    const [recording,setRecording] = useState(false);
    const [mssgDemo,setMssgDemo] = useState();
    const {userDetails,SelectedContactsDetails,tokenDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [ token,setToken] = tokenDetails;
    const [selectedContacts,setSelectedContacts]=SelectedContactsDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;
    const [statusSeenDuration,setStatusSeenDuration]=useState({});
    const [dateObj,setDateObj] = useState(new Date);
    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });
    
    const monthObject={1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sept",10:"Oct",11:"Nov",12:"Dec"};

    useEffect(() => {
        if (statusView){
            if (timeObject){
                const duration = findDuration(timeObject);
                setStatusSeenDuration(()=>duration);
            }
        }
        
    }, []);

    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        if (onlineCheck){
            setTimeout(()=>setPastOnlineStatus(onlineCheck),3000);
        }
        return () => {
            // NetInfo.removeEventListener(handleConnectionChange)
        }
    }, [onlineCheck]);

    const handleConnectionChange= (e)=>{
        setPastOnlineStatus(onlineCheck);
        setOnlineCheck(e.isConnected);
    }

    useEffect(() => {
        async function checkNewmssgs(){
            setNotificationNumber(0);
            const mssgsString = await AsyncStorage.getItem(tonumber+'messages');
            const mssgs = await JSON.parse(mssgsString);
            const response = await FetchMessagesLength(userNumber,tonumber,token)
                                .then(res=>{
                                    const mssgsLength = mssgs? mssgs.length : 0; 
                                    if (mssgs){
                                        if (res.data > mssgsLength){
                                            const newMssgLength = res.data - mssgsLength;
                                            setNotificationNumber(newMssgLength);
                                        }
                                    }
                                    else{
                                        setNotificationNumber(res.data);
                                    }                       
        })
        };
        if (!chatScreen && !forwardScreen && !statusView && onlineCheck){
            checkNewmssgs();
        }
    }, [onlineCheck]);

    useEffect(() => {
        if (Mssg?.from.userNumber===tonumber || Mssg?.to.userNumber===tonumber){
            setMssgDemo(Mssg);
        }
    }, [Mssg]);

    //listening for notification  number and last new mssg
    useEffect(() => {
            if (!chatScreen && !forwardScreen && !statusView && onlineCheck){
                socket.on(`Recieve Message ${userNumber} ${tonumber}`,async (mssg)=>{
                    if (await mssg){
                       
                        if (mssg.from.userNumber === tonumber){
                            setNotificationNumber(num=>num+1);
                            setMssgDemo(mssg);
                        }
                    }
                });
            }
    }, [onlineCheck]);

    useEffect(() => {
        if (latestMssg && latestMssg.to.userNumber===tonumber){
            setMssgDemo(latestMssg);
        }
    }, [latestMssg]);


    useEffect(() => { 
        //asking for typing status
        if (onlineCheck){
            socket.emit(`typingStatusForUser`,{tonumber,userNumber});
        }
    }, [onlineCheck]);

    // listening for typing status
    useEffect(() => {
        if (onlineCheck){ 
            socket.on(`typingStatusChecked ${userNumber} ${tonumber}`,(details)=>{
                if (details){
                    if ( details.fromUser===tonumber){
                        setRecording(false);
                        setTyping(details.typing);
                    }
                }
            });
        }
    }, [onlineCheck]);

    useEffect(() => { 
        if (onlineCheck){
            socket.emit(`recordingStatusForUser`,{tonumber,userNumber});
        }

       
      
    }, [onlineCheck]);

    //listening for recording status
    useEffect(() => {
        if (onlineCheck){ 
            socket.on(`recordingStatusChecked ${userNumber} ${tonumber}`,(details)=>{
                if (details){
                        setTyping(false);
                        setRecording(details.recording);
                }
            
            });
        } 
    }, [onlineCheck]);

    const handleCheckContacts=()=>{
        var index = selectedContacts.indexOf(tonumber);
      
        if (checked){
            if (index===-1){
                if (selectedContacts.length ===0){
                   
                    setSelectedContacts([tonumber]);
                }
                else{
                    setSelectedContacts(contactslist=>[...contactslist,tonumber]);
                }
              
            };
        }
        else if (!checked){
            if (index!==-1){
                setSelectedContacts(contactslist=>contactslist.filter((contact)=>{
                    return contact !== tonumber
                }))
            }

        };
    }
    useEffect(() => {
        
        return () => {
            setChecked(false);
            setSelectedContacts([]);
        }
    }, []);

    useEffect(()=>{
        if (chatScreen && onlineCheck){
            async function fetchLastSeen(){
                const token = await SecureStore.getItemAsync('token');
                const response =await FetchLastSeen(tonumber,token)
                .then(res=>{
                    if (res?.data?.lastSeen){
                        setLastSeen(res.data.lastSeen);
                    }
                })
            }
            fetchLastSeen()
        }
    },[chatScreen,onlineCheck])
    return (
        <TouchableOpacity 
            disabled={chatScreen || statusView?true:false}
            onPressIn={()=>{
                        if (forwardScreen && !statusView){
                        setChecked(!checked);
                        }}}
            onPress={()=>{
                        if (forwardScreen && !statusView){
                            handleCheckContacts();
                        }
                        if (!forwardScreen && !statusView){
                            setNotificationNumber(0);
                        }
                        if (!chatScreen && !forwardScreen && !statusView){
                            setSearchClicked(false);
                        };
                        if (!forwardScreen && !statusView){
                        navigation.navigate("ChatScreen",{tonumber:tonumber,
                                                            token:token,
                                                        name,
                                                        notificationNumber:notificationNumber,
                                                        imageUri:imageUri,
                                                        setNotificationNumber:setNotificationNumber,
                                                        })
                                            }
                        }
                    }
            style={[styles.container,forwardScreen?{}:{justifyContent:'space-between'},chatScreen?{backgroundColor:COLORS.contactView,height:62,paddingLeft:10,width:'90%'}:{width:'100%',height:70,paddingLeft:0}]}
         >
            {/* {forwardScreen &&
                <View>
                    <CheckBox checked={checked}/>
                </View>
            } */}
            <TouchableOpacity
                disabled={!chatScreen?true:false}
                onPress={()=>navigation.navigate("ContactsProfile",{
                    name:name,
                    tonumber:tonumber,
                    imageUri:imageUri,
                    starredMssgs:starredMssgs,
                    userNumber:userNumber,
                    user:user,
                    mssgArrayPart:mssgArrayPart,
                    setMssgArrayPart:setMssgArrayPart,
                    handleInfiniteScrolling:handleInfiniteScrolling,
                    mssgArray:mssgArray,
                    ScrollRef:ScrollRef,
                })}
                style={[styles.imgName,chatScreen ? {width:'100%',justifyContent:'flex-start',maxWidth:'100%'}:{maxWidth:'70%',justifyContent:'space-between'}]}>
                {/* <LinearGradient
                    colors={online?['red','#ffa351ff','orange','yellow']:['transparent','transparent']}
                    style={chatScreen?{height:80,width:80,}:{height:60,width:60,borderRadius:60,marginRight:10,justifyContent:'center'}}
                > */}
                {chatScreen && 
                    <TouchableOpacity style={{marginRight:10}} onPress={()=>{navigation.goBack()}}>
                        <Ionicons name="arrow-back" size={25} color="white" />
                    </TouchableOpacity>
                }
                    <View
                         style={[chatScreen?{height:50,width:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}:
                            {height:60,width:60,borderRadius:60,marginRight:10,justifyContent:'center',marginLeft:20},
                        ]}
                        >
                        {forwardScreen ?
                            <View>
                                <CheckBox checked={checked}/>
                                <Avatar 
                                    icon={{name:'user', type:'font-awesome'}}
                                    size={chatScreen?'small':'medium'}
                                    rounded
                                    activeOpacity={0.7}
                                    source={{uri:imageUri}}
                                    containerStyle={[{backgroundColor:'#d7d9db'},checked && {borderColor:COLORS.primary,borderWidth:2}]}
                                />
                            </View>
                        :
                            <Avatar 
                            icon={{name:'user', type:'font-awesome'}}
                            size={chatScreen?'small':'medium'}
                            rounded
                            activeOpacity={0.7}
                            source={{uri:imageUri}}
                            containerStyle={{backgroundColor:'#d7d9db'}}
                        />
                        }
                    </View>
                {/* </LinearGradient> */}
                <View style={[{flexDirection:'column',},chatScreen && {marginLeft:10}]}>
                    <Text numberOfLines={1} style={[styles.Name,chatScreen && {color:'white',fontSize:18}]} >{name}</Text>
                    {
                        (!forwardScreen && !statusView && !chatScreen && mssgDemo?.DocumentStatus && !mssgDemo?.AudioStatus && !mssgDemo?.ImageStatus && !typing && !recording ) &&
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text numberOfLines={1} style={[!chatScreen && {fontSize:12,color:'gray'}]} >Doc:</Text>
                                <Ionicons name="document" size={15} color='gray' />
                            </View>
                            
                    }
                    {
                        (!forwardScreen && !statusView && !chatScreen && !mssgDemo?.DocumentStatus && mssgDemo?.AudioStatus && !mssgDemo?.ImageStatus && !typing && !recording ) &&
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text numberOfLines={1} style={[!chatScreen && {fontSize:12,color:'gray'}]} >Audio:</Text>
                                <MaterialIcons name="multitrack-audio" size={15} color="gray" />
                            </View>
                            
                    }
                    {
                        (!forwardScreen && !statusView && !chatScreen && !mssgDemo?.DocumentStatus && !mssgDemo?.AudioStatus && mssgDemo?.ImageStatus && !typing && !recording ) &&
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text numberOfLines={1} style={[!chatScreen && {fontSize:12,color:'gray'}]} >Photo:</Text>
                                <MaterialIcons name="insert-photo" size={15} color="gray" />
                            </View>
                            
                    }
                    {
                        (!forwardScreen && !statusView && !chatScreen && !mssgDemo?.DocumentStatus && !mssgDemo?.AudioStatus && !mssgDemo?.ImageStatus && mssgDemo?.message && !typing && !recording ) &&
                            <Text numberOfLines={1} style={[!chatScreen && {fontSize:12,color:'gray'}]} >{mssgDemo.message}</Text>
                    }
                    {
                    (!forwardScreen && !statusView && typing) &&
                        <Text style={{color:!chatScreen?COLORS.primary:"white"}}>typing...</Text>
                    }
                    {
                    (!forwardScreen && !statusView && recording) &&
                        <Text style={{color:!chatScreen?COLORS.primary:"white"}}>recording audio...</Text>
                    }
                    {
                    (!forwardScreen && !statusView && !typing &&!recording && online && chatScreen) &&
                        <Text style={{color:!chatScreen?COLORS.primary:"white"}}>online</Text>
                    }
                    {
                    (!forwardScreen && !statusView && !typing &&!recording && !online && chatScreen && lastSeen!==undefined) &&
                        <Text style={{color:"white",fontSize:12}}>{`last seen  ${
                            (dateObj.getDate()===lastSeen.day)?(dateObj.getMonth()+1===lastSeen.month && dateObj.getFullYear()===lastSeen.year)?
                            `Today`:
                            `${String(lastSeen.day).length<2?`0${lastSeen.day}`:lastSeen.day} ${monthObject[lastSeen.month]} ${lastSeen.year!==dateObj.getFullYear()? `${lastSeen.year}`:""}`:
                            (dateObj.getDate()===lastSeen.day+1 && dateObj.getMonth()+1===lastSeen.month && dateObj.getFullYear()===lastSeen.year)?
                            'Yesterday':
                            `${String(lastSeen.day).length<2?`0${lastSeen.day}`:lastSeen.day} ${monthObject[lastSeen.month]} ${lastSeen.year!==dateObj.getFullYear()?`${lastSeen.year}`:""}`    
                            } ${lastSeen.hours>12?`${lastSeen.hours-12}`:`${lastSeen.hours}`}.${lastSeen.minutes.toString().length<2?`0${lastSeen.minutes}`:lastSeen.minutes} ${lastSeen.hours>=12?"pm":"am"}`}
                                </Text>
                    }
                </View>
            </TouchableOpacity>
            <View style={{flexDirection:'column',alignItems:'flex-end',height:'100%',justifyContent:'center'}}>
                {(!forwardScreen && !statusView && !chatScreen && mssgDemo) &&
                    <View style={{marginBottom:5}}>            
                        <Text style={{color:'gray',fontSize:10}}>
                            {`${mssgDemo.time}, ${mssgDemo.timeObject.day}/${mssgDemo.timeObject.month}`}
                        </Text>
                    </View>
                }
                {(!forwardScreen && !statusView && !chatScreen && notificationNumber>0) &&
                    <View style={styles.notification}>            
                        <Text style={styles.notificationText}>
                            {notificationNumber}
                        </Text>
                    </View>
                }
            </View>
            {
                statusView && 
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Feather name="clock" size={15} color="#acacac" />
                    <Text style={[{color:'#acacac',fontSize:12,paddingLeft:5}]}>{`${statusSeenDuration?.difference} ${statusSeenDuration?.string} ago`}</Text>
                </View>
            }
        </TouchableOpacity>
    );
}

export default ContactView;

const styles=StyleSheet.create({
    imgName:{
        flexDirection:'row',
        alignItems:'center',
    },
    notification:{
        backgroundColor:COLORS.primary,
        minWidth:25,
        minHeight:25,
        borderRadius:60,
        alignItems:'center',
        justifyContent:'center',
        elevation:4
    },
    notificationText:{
        fontSize:10,
        color:'white'
    },
    image:{
        alignSelf:'center',
    },
    container:{
        backgroundColor:'white',
        flexDirection:'row',
        paddingRight:20,
        alignItems:'center',
        alignSelf:'center',
        // elevation:2,
    },
    Name:{
        fontSize:16,
        color:'black'
    }
})