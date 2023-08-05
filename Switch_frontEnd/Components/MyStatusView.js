import { useNavigation, useRoute } from '@react-navigation/native';
import React,{useEffect,useContext, useState, useRef} from 'react';
import { Alert, StatusBar, ToastAndroid, TouchableOpacity,FlatList,View,Text,Image,BackHandler,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import io from 'socket.io-client';
import Animated, { useAnimatedStyle, useSharedValue, withTiming,withRepeat, Easing,withSequence } from 'react-native-reanimated';

import { findDuration } from '../services/findDuration';
import { COLORS } from '../Colors';
import deleteStatus from '../api/deleteStatus';
import LoadingView from './LoadingView';
import AlertView from './AlertView';
import ContactView from './ContactView';
import {Context} from '../Context';
import {BASE_URL} from '../constants/urls';

import NetInfo from '@react-native-community/netinfo';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';




function MyStatusView() {
    const navigation = useNavigation();
    const route = useRoute();
    const {token} = route.params;
    // const socket = io.connect(`${BASE_URL}/statusSocket/connect`);
    const {userDetails,contactsDetails,statusDetails,userStatusDetails,userProfile} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const [userStatus,setUserStatus] = userStatusDetails;
    const [contacts,setContacts]=contactsDetails;
    const [profileLocation,setProfileLocation] = userProfile;
    const [viewers,setViewers]=useState(0);
    const [showViewers,setShowViers]=useState(false);
    const statusTimerWidth = useSharedValue(0);
    const [statusTimeCounter,setStatusTimeCounter] = useState(0);
    const [statusUnseenLength,setStatusUnseenLength] = useState(0);
    const ViewersDivRef = useRef(null);
    const headerRef = useRef(null);
    const [screenWidth,setScreemWidth] = useState(0);
    const [pause,setPause] = useState(false);
    const [rerender,setRerender] = useState(false);
    const [statusDuration,setStatusDuration]=useState({});
    const [userStatusObject,setUserStatusObject]=useState([]);
    const [userStatusObjectIndex,setUserStatusObjectIndex]=useState(0);
    const [viewersDivHeight,setViewersDivHeight] = useState(0);
    const [showMenu,setShowMenu]=useState(false);
    const [imageErr,setImageErr] = useState(false);

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);
    const [loading,setLoading] = useState(false);

    
    const statusTimerWidthStyle = useAnimatedStyle(()=>{
        return {
            width:statusTimerWidth.value,
            backgroundColor:'white'
        }
    })


    //managing network status and its status display
    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        if (online){
            setTimeout(()=>setPastOnlineStatus(online),3000);
        }
        return () => {
            // NetInfo.removeEventListener(handleConnectionChange)
        }
    }, [online]);

    useEffect(() => {
        if (mssg.length>0){
            setShow(true);
            setTimeout(()=>setMssg(""),3000)
        }
        else{
            setShow(false);
        }
    }, [mssg]);

    const handleConnectionChange= (e)=>{
        setPastOnlineStatus(online);
        setOnline(e.isConnected);
    }



    const socket = io.connect(`${BASE_URL}/statusSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });

    useEffect(() => {
        
       
    }, [])
    useEffect(() => {
        if (userStatus){
            setStatusUnseenLength(userStatus.length)
        }
    }, [userStatus])

    useEffect(() => {
        // statusTimerWidth.value = withTiming((screenWidth-(userStatus.length*5))/userStatus.length,{duration:500,easing:Easing.linear});
        console.log(statusTimerWidth.value)
    }, []);

    useEffect(() => {
        function handle(){
            setStatusTimeCounter(0);

        }
        handle();
    }, [userStatusObjectIndex]);


    useEffect(() => {
        async function handle(){

            if (userStatus){
                const index = await userStatus.findIndex((ele,ind)=>ele.seenMySelf===false);
                console.log(index,"iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
                if (index!=-1){
                    setUserStatusObjectIndex(index);
                    setStatusUnseenLength(userStatus.slice(index).length);
                }
                else{
                    setUserStatusObjectIndex(0);
                    setStatusUnseenLength(userStatus.length);
                }
            }
        }
        handle();
    }, [userStatus]);


    useEffect(() => {
        function handle(){
            console.log(statusTimeCounter,"counter")
            if (!pause && userStatus && userStatusObjectIndex<=userStatus.length-1){
                if (statusTimeCounter<=5){
                    setTimeout(()=>{
                        if(statusTimeCounter<5){
                        const newVal = statusTimeCounter+1;
                        setStatusTimeCounter(newVal);
                    }
                    else{
                        setStatusTimeCounter(0);
                    }
                }
                
                ,1000);
                }
                if (statusTimeCounter<=5){
                    setTimeout(()=>{
                        if(statusTimeCounter<5){
                        const newVal = statusTimeCounter+1;
                        setStatusTimeCounter(newVal);
                    }
                    else{
                        setStatusTimeCounter(0);
                    }
                }
                
                ,1000);
                }
            }

            if (userStatusObjectIndex<=userStatus?.length-1){
                if (statusTimeCounter>=5){
                    setShowViers(false);
                    const newVal = userStatusObjectIndex+1;
                    setUserStatusObjectIndex(newVal);
                }
            }
            else{
                setStatusTimeCounter(0);
                setUserStatusObjectIndex(0);
                navigation.goBack();
            }
        }
        handle();

    },[statusTimeCounter,pause]);

    useEffect(() => {
        console.log(userStatusObjectIndex);
        async function handle(){
            // statusTimerWidth.value =withTiming((screenWidth-(userStatus.length*5))/userStatus.length,{duration:5000});
            if (userStatus && userStatusObjectIndex<=userStatus.length-1){
                setViewers(()=>userStatus[userStatusObjectIndex]?.seen.length);
                const duration = await findDuration(userStatus[userStatusObjectIndex]?.timeObject);
                setStatusDuration(()=>duration);
                setUserStatusObject(()=>userStatus[userStatusObjectIndex]);
                setStatusTimeCounter(0);
            }
            else{
                navigation.goBack();
            }
        }
        handle()
    }, [userStatusObjectIndex])


    useEffect(()=>{
        BackHandler.addEventListener('hardwareBackPress',()=>{navigation.goBack();return true})
        return ()=>{
            BackHandler.removeEventListener('hardwareBackPress') ;
        }
    },[]);
   
    useEffect(()=>{
        if (userStatusObject!==undefined && userStatusObject.seenMySelf===false && online){
            console.log(userStatusObject)
            const objectSeen = {item:userStatusObject?.imageLocation,from:{userNumber:userNumber}};
            socket.emit(`Send seenMyStatus`,objectSeen,
            socketStatus=>{
                if (socketStatus===200){
                    setUserStatusObject((prevState)=>{
                        let state = prevState;
                        state.seenMySelf=true;
                        return state;
                        
                    });
                    setUserStatus((prevState)=>{
                        let state = prevState;
                        state[userStatusObjectIndex].seenMySelf=true;
                        return state; 
                    });
                }
            }
            );
        }
       
        // statusTimerWidth.value = withTiming((screenWidth-(userStatus.length*5))/userStatus.length,{duration:1000})

    },[userStatusObject,online])
   

    useEffect(() => {
        if (online){
        socket.on(`Recieve seenStatus ${userNumber} for ${userStatusObject?.imageLocation}`,object=>{
      
          setViewers(viewers=>viewers+1);
          setUserStatusObject((prevState)=>{
            let state = prevState;
            state.seen.push(object);
            return state;
            
        });
        setUserStatus((prevState)=>{
            let state = prevState;
            state[userStatusObjectIndex].seen.push(object);
            return state; 
        });
      })
        }
    }, [online]);

    async function handleScreenTouch(e){
        if (!showMenu && !showViewers){
            const X = await e.nativeEvent.locationX;
            if (X>((screenWidth/4)+(screenWidth/2))){
                const newVal = userStatusObjectIndex+1;
                setUserStatusObjectIndex(newVal);
            }
            else if(X<(screenWidth/4)){
                const newVal = userStatusObjectIndex-1;
                if (userStatusObjectIndex===0){
                    navigation.goBack();
                }
                else{
                    setUserStatusObjectIndex(newVal);
                }
            }
        }
        setShowMenu(false);
        setShowViers(false);
    }
    useEffect(() => {
        if (showViewers){
            setPause(true);
        }
        else{
            setPause(false);
        }
    }, [showViewers]);

    const handleSelection = (str)=>{
        return(
            Alert.alert("Appoi",`Are you sure to ${str}`,[
                {
                    text:"yes",
                    onPress:()=>{if(online){handleDeleteStatus()}else{ToastAndroid.show("You are offline",ToastAndroid.SHORT);}}
                },
                {
                    text:"no",
                }
                
            ])
            )
    };

    const handleDeleteStatus = async()=>{
        setLoading(true);
        const response = await deleteStatus(userStatusObject,userNumber,token)
            .then(res=>{
                if (res){
                    console.log(res.data,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
                    if (res.status ===200 && res.data.message==="deleted successfully"){
                        setUserStatus(prev=>{
                            var state = prev;
                            state.splice(userStatusObjectIndex,1);
                            return state;
                        });
                        navigation.goBack();
                        // setUserStatusObjectIndex(userStatusObjectIndex+1);
                        ToastAndroid.show("Status deleted",ToastAndroid.SHORT);
                    }
                    else{
                        console.log(res.data.message,"sssss")
                    }
                }
                else{
                    
                }
                setShowMenu(false);
                setLoading(false);
            })
    };
    return (
        
        <View style={{flex:1,width:'100%'}}>
            {
                loading &&
                <LoadingView />
            }
            <View style={{flexDirection:'column',backgroundColor:'black',alignContent:'center',flex:1}}>        
            <StatusBar backgroundColor='black' barStyle="light-content" />
                <View onLayout={(e)=>{setScreemWidth(e.nativeEvent.layout.width)}} ref={headerRef} style={{zIndex:1,paddingBottom:0,paddingTop:5,width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'column',marginBottom:20}}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        {
                            userStatus?.map((item,ind)=>{
                                return <View key={ind} index={ind} style={{backgroundColor:'#d3d3d354',borderRadius:30,height:3,marginRight:5,width:(screenWidth-(userStatus?.length*5))/userStatus?.length}}>
                                            <Animated.View
                                                key={ind} index={ind}  style={[{height:3,borderRadius:30,backgroundColor:'white'},userStatusObjectIndex===ind?{width: statusTimerWidthStyle.width}:{width:0}]}>
                                            </Animated.View>
                                        </View>
                            })
                        }
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%',marginTop:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',padding:5,paddingLeft:5}}>
                            <TouchableOpacity style={{marginRight:5}} onPress={()=>{navigation.goBack()}}>
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <Avatar 
                                icon={{name:'user', type:'font-awesome'}}
                                size='small'
                                rounded
                                activeOpacity={0.7}
                                source={{uri:profileLocation}}
                            />
                            <Text style={{fontSize:17,color:'white',paddingLeft:10}}>Your story</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingRight:10}}>
                            {statusDuration !==undefined &&
                                <View style={{flexDirection:'row',alignItems:'center',marginLeft:15,marginRight:20}}>
                                    <Feather name="clock" size={20} color="#dddddd" />
                                    <Text style={[{color:'#dddddd',fontSize:12,paddingLeft:5},styles.textShadow]}>{`${statusDuration?.difference} ${statusDuration?.string} ago`}</Text>
                                </View>
                            }
                            <View>
                                <TouchableOpacity onPress={()=>setShowMenu(!showMenu)}>
                                    <Entypo name="dots-three-vertical" size={23} color="white" />
                                </TouchableOpacity>
                                
                            </View>
                            {
                                showMenu &&
                                <View style={{position:'absolute',top:0,right:0,backgroundColor:'white',minWidth:200,padding:10}}>
                                    <TouchableOpacity style={{width:'100%'}} onPress={()=>handleSelection("delete the status")}>
                                        <Text style={{fontSize:16}}>delete</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                </View>
                    <View style={{flex:1,backgroundColor:'black',justifyContent:'center',zIndex:1}}>
                        {!pastOnlineStatus && online &&
                            <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
                        }
                        {!online &&
                            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
                        }     
                        <TouchableOpacity disabled={!online?true:false} style={{backgroundColor:COLORS.primary,width:55,height:55,position:'absolute',bottom:10,right:10,zIndex:10,elevation:10,borderRadius:100,flexDirection:'row',alignItems:'center',justifyContent:"center"}} onPress={()=>{if (online){setPause(true);navigation.navigate("AddStatus",{token:token})}else{ToastAndroid.show("You are offline",ToastAndroid.SHORT);}}}>
                            <Ionicons name="add" size={35} color="white" />
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={(e)=>{handleScreenTouch(e)}} onLongPress={()=>{setPause(true);setShowViers(false)}} onPressOut={()=>setPause(false)} >
                            <Image resizeMode="contain" style={{height:'100%',width:'100%',backgroundColor:'black'}} source={{uri:userStatusObject?.imageLocation}} />
                        </TouchableWithoutFeedback>
                    </View> 
                <View style={{backgroundColor:'black',flexDirection:'column',width:'100%',alignItems:'center',marginTop:10}}>
                    <Text numberOfLines={3} style={{color:'white',fontSize:18,marginTop:10,marginBottom:40,padding:5,minWidth:'70%',borderRadius:8,textAlign:'center'}}>{userStatusObject?.content}</Text>
                    <View ref={ViewersDivRef} onLayout={e=>setViewersDivHeight(e.nativeEvent.layout.height)} style={[styles.ViewersDiv,showViewers?{backgroundColor:'white'}:{backgroundColor:'transparent'}]}>
                        <TouchableOpacity onPress={()=>setShowViers(!showViewers)} style={{width:'100%',padding:3,flexDirection:'row-reverse',backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
                            <MaterialCommunityIcons name="eye-check" size={22} color={showViewers?"black":"white"} />
                            <Text style={{color:showViewers?"black":"white",marginRight:10}}>{viewers?viewers:0}</Text>
                            {/* <ContactView statusView={true} key={"jhfjhg"} name={"sreehari"} tonumber={"9776877698"} /> */}
                        </TouchableOpacity>
                        {showViewers && userStatusObject !==undefined &&
                            (viewers.length>0 ?
                            <FlatList
                            // contentContainerStyle={styles.scrolviewContainer}
                                style={styles.scrollview}
                                data = {userStatusObject.seen}
                                renderItem = {({item,index})=>
                                <ContactView statusView={true} key={index} imageUri={contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===item.userNumber)]?.imageLocation} name={contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===item.userNumber)]?.name} tonumber={item.userNumber} timeObject={item.timeObject} />}
                                keyExtractor={(item,index)=>index.toString()}
                            />:
                            <Text style={{padding:10,fontSize:16}}>No viewers</Text>
                            )
                        }
                    </View>
                </View>
            </View>
        </View>
    );
}

export default MyStatusView;

const styles = StyleSheet.create({
    ViewersDiv:{
        width:'100%',
        minHeight:10,
        position:'absolute',
        bottom:0,
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10,
        zIndex:3
    },
    scrollview:{
        width:'100%',
        paddingTop:2,
        maxHeight:'70%'
    },
    textShadow:{
        textShadowColor:'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textShadowRadius:10
    }

})