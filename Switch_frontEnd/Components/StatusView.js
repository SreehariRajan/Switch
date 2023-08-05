import { useNavigation, useRoute } from '@react-navigation/native';
import React,{useEffect,useContext,useState,useRef} from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, StyleSheet,TextInput,TouchableWithoutFeedback,View,Text,Image,BackHandler,TouchableOpacity,StatusBar,ToastAndroid } from 'react-native';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

import {Context} from '../Context';
import {BASE_URL} from '../constants/urls';
import { findDuration } from '../services/findDuration';
import { COLORS } from '../Colors';
import AlertView from './AlertView';

import Animated, { useAnimatedStyle, useSharedValue, withTiming,withRepeat, Easing,withSequence } from 'react-native-reanimated';

import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Feather } from '@expo/vector-icons';

function StatusView() {
    const route=useRoute();
    const navigation = useNavigation();

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);


    const {item,index}=route.params;
    const {userDetails,contactsDetails,statusDetails,tokenDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const [statusObject,setStatusObject] = useState();
    const [statusTimeCounter,setStatusTimeCounter] = useState(0);
    const [statusObjectIndex,setStatusObjectIndex]=useState(0);
    const [statusDuration,setStatusDuration]=useState({});
    const [keyboardOn,setKeyboardOn] = useState(false);
    const [clientMssg,setClientMssg] = useState("");
    const [pause,setPause] = useState(false);
    const headerRef = useRef(null);
    const statusTimerWidth = useSharedValue(20);
    const [statusUnseenLength,setStatusUnseenLength] = useState(0);
    const [screenWidth,setScreemWidth] = useState(0);
    const [contacts,setContacts]=contactsDetails;
    const [status,setStatus]=statusDetails;
    const [statusIndex,setStatusIndex]=useState(index);
    const [token,setToken] = tokenDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;

    const {height:windowHeight} = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0 ;

    const containerViewHeight = windowHeight;

    const [statusListUserDetails,setStatusListUserDetails]=useState(item);
    const statusTimerWidthStyle = useAnimatedStyle(()=>{
        return {
            width:statusTimerWidth.value,
            // backgroundColor:'white'
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
        setStatusListUserDetails(item);
    }, [item])

    useEffect(() => {
        if (statusListUserDetails.statusList){
            setStatusUnseenLength(statusListUserDetails.statusList.length)
        }
    }, [statusListUserDetails])

    useEffect(() => {
        // statusTimerWidth.value = withTiming((screenWidth-(userStatus.length*5))/userStatus.length,{duration:500,easing:Easing.linear});
        console.log(statusTimerWidth.value)
    }, []);

    useEffect(() => {
        async function handle(){
            if (statusListUserDetails){
                // const index = await item.statusList.findIndex((ele,ind)=>ele.seen.===false);
                for (var i;i<statusListUserDetails.statusList.length;i++){
                    async function check(){
                        const statusObject =await statusListUserDetails.statusList[i];
                        const index =await statusObject?.seen.findIndex((ele,ind)=>ele.userNumber===userNumber);
                        if (index===-1){
                            setStatusObjectIndex(i);
                            setStatusUnseenLength(statusListUserDetails.statusList.slice(i).length);
                            
                        }
                        
                    }
                    check()

                }
            }
        }
        handle();
    }, [statusListUserDetails]);

    useEffect(() => {
        function handle(){
            console.log(statusTimeCounter,"counter")
            if (!pause && statusListUserDetails.statusList && statusObjectIndex<=statusListUserDetails.statusList.length-1){
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

            if (statusObjectIndex<=statusListUserDetails.statusList?.length-1){
                if (statusTimeCounter>=5){
                    const newVal = statusObjectIndex+1;
                    if (statusObjectIndex===statusListUserDetails.statusList.length-1){
                        if (status.length-1>statusIndex){
                            setStatusIndex(statusIndex+1);
                            setStatusObjectIndex(0);
                            setStatusListUserDetails(status[statusIndex+1])
                        }  
                        else{
                            navigation.goBack();
                        }
                    }
                    else{
                        setStatusObjectIndex(newVal);
                    }
                }
            }
            else{
                setStatusTimeCounter(0);
                setStatusObjectIndex(0);
                navigation.goBack();
            }
        }
        handle();

    },[statusTimeCounter,pause]);

    useEffect(() => {
        console.log(statusObjectIndex);
        async function handle(){
            if (statusListUserDetails.statusList && statusObjectIndex<=statusListUserDetails.statusList.length-1){
                const duration = await findDuration(statusListUserDetails.statusList[statusObjectIndex]?.timeObject);
                setStatusDuration(()=>duration);
                setStatusObject(()=>statusListUserDetails.statusList[statusObjectIndex]);
                setStatusTimeCounter(0);
            }
            else{

            }
        }
        handle()
    }, [statusObjectIndex]);

    async function handleScreenTouch(e){
        const X = await e.nativeEvent.locationX;
        if (!keyboardOn){
            if (X>((screenWidth/4)+(screenWidth/2))){
                const newVal = statusObjectIndex+1;
                if (statusObjectIndex===statusListUserDetails.statusList.length-1){
                    if (status.length-1>statusIndex){
                        setStatusObjectIndex(0);
                        setStatusIndex(statusIndex+1);
                        setStatusListUserDetails(status[statusIndex+1])
                    }  
                    else{
                        navigation.goBack();
                    }
                }
                else{
                    setStatusObjectIndex(newVal);
                }
                
            }
            else if(X<(screenWidth/4)){
                const newVal = statusObjectIndex-1;
                console.log(statusIndex,"statusIndex");
                if (statusObjectIndex===0){
                    if (statusIndex>0){
                        // setStatusObjectIndex(0);
                        setStatusListUserDetails(status[statusIndex-1]);
                        setStatusObjectIndex(status[statusIndex-1].statusList.length-1)
                    }
                    else{
                        navigation.goBack();
                    }
                }
                else{
                    setStatusObjectIndex(newVal);
                }
            }
        }
        else{
            Keyboard.dismiss();
        }
    }


    useEffect(()=>{
        if (online){
            console.log("entered seen")
            const Time = new Date();
            const year = Number(Time.getFullYear());
            const month = Number(Time.getMonth()+1);
            const day = Number(Time.getDate());
            const hours = Number(Time.getHours());
            const minutes = Number(Time.getMinutes());
            const seconds = Number(Time.getSeconds());
            const objectSeen = {item:statusObject?.imageLocation,from:{userNumber:userNumber},to:{userNumber:statusListUserDetails._id},timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds}};
            socket.emit(`Send seenStatus`,objectSeen,
            socketStatus=>{
                if (socketStatus===200){
                    handleLocalChange();
                }
            });
            async function handleLocalChange(){
                const index =await statusObject?.seen.findIndex((ele,ind)=>ele.userNumber===userNumber);
                if (index===-1){
                    setStatus((prevState)=>{
                        let state = prevState;
                        state[statusIndex].statusList[statusObjectIndex].seen.push({userNumber:userNumber,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds}})
                        return state;
                    })
                }

            }
        }

    },[statusObject,online]);

    useEffect(()=>{
        // handleStatusShow();

        BackHandler.addEventListener('hardwareBackPress',()=>{navigation.goBack();return true})
        // BackHandler.addEventListener('hardwareBackPress',()=>navigation.navigate("ChatMenu"))

        return ()=>{
            BackHandler.removeEventListener('hardwareBackPress') ;
        }


    },[]);

    async function submitMssg(){
        const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
            auth:{
                token:token
            },
            query:{
                userNumber:userNumber
            }
        });

        const Time = new Date();
        const year = Number(Time.getFullYear());
        const month = Number(Time.getMonth()+1);
        const day = Number(Time.getDate());
        const hours = Number(Time.getHours());
        const minutes = Number(Time.getMinutes());
        const seconds = Number(Time.getSeconds());
        console.log("Emit",Time,year,month,day);
        console.log(minutes.toString())
        
        if (clientMssg){
                const mssgObj =await {message:clientMssg,starredMessage:false,ImageStatus:false,DocumentStatus:false,AudioStatus:false,audio:{value:null},document:{value:null},image:{value:null},replyStatus:true,forwardStatus:false,repliedFor:{from:{userNumber:userNumber,user:user},AudioStatus:false,DocumentStatus:false,ImageStatus:true,status:true,image:{location:statusObject.imageLocation},message:statusObject.content},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:statusListUserDetails._id}};
                ToastAndroid.show("Sending Reply",ToastAndroid.SHORT);
                socket.emit(`Send Message`,mssgObj);
                setLatestMssg(mssgObj);
                Keyboard.dismiss();
        }
    };

    useEffect(() => {
       if (keyboardOn){
           setPause(true)
       }
       else{
           setPause(false);
       }
    }, [keyboardOn]);
    
    useEffect(() => {
       Keyboard.addListener("keyboardDidHide",()=>setKeyboardOn(false))
       Keyboard.addListener("keyboardDidShow",()=>setKeyboardOn(true))
       return ()=>{
           Keyboard.removeAllListeners;
           
       }
    }, [])

    return (
        <View style={{width:'100%',height:containerViewHeight}}>
            <View style={{flexDirection:'column',backgroundColor:'black',alignContent:'center',flex:1}}>
                <StatusBar backgroundColor='black' barStyle="light-content" />
                    <View onLayout={(e)=>{setScreemWidth(e.nativeEvent.layout.width)}} ref={headerRef} style={{paddingBottom:0,paddingTop:5,width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'column',marginBottom:20}}>
                        <View style={{width:'100%',flexDirection:'row'}}>
                                {
                                    statusListUserDetails.statusList?.map((iteM,ind)=>{
                                        // return <View key={ind} index={ind} style={{backgroundColor:'#d3d3d354',borderRadius:30,height:3,marginRight:5,width:(screenWidth-(item))}}>
                                        return <View key={ind} index={ind} style={{backgroundColor:'#d3d3d354',borderRadius:30,height:3,marginRight:5,width:(screenWidth-(statusListUserDetails.statusList?.length*5))/statusListUserDetails.statusList?.length}}>
                                                    <Animated.View
                                                        key={ind} index={ind}  style={[{height:3,borderRadius:30,backgroundColor:'white'},statusObjectIndex===ind?{width: statusTimerWidth.value}:{width:0}]}>
                                                    </Animated.View>
                                                </View>
                                    })
                                }
                        </View>
                                
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10,width:'100%',paddingRight:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',padding:5,paddingLeft:10}}>
                                <TouchableOpacity style={{marginRight:5}} onPress={()=>{navigation.goBack()}}>
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                                <Avatar 
                                    icon={{name:'user', type:'font-awesome'}}
                                    size='small'
                                    rounded
                                    activeOpacity={0.7}
                                    source={{uri:item.profilePic}}
                                />
                                <Text style={{fontSize:17,color:'white',paddingLeft:10}}>{contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===statusListUserDetails._id)]?.name}</Text>
                            </View>
                            <View style={{flexDirection:'row-reverse',alignItems:'center'}}>
                                {statusDuration !==undefined &&
                                    <View style={{flexDirection:'row',alignItems:'center',marginLeft:15}}>
                                        <Feather name="clock" size={20} color="#dddddd" />
                                        <Text style={[{color:'#dddddd',fontSize:12,paddingLeft:5},styles.textShadow]}>{`${statusDuration?.difference} ${statusDuration?.string} ago`}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={(e)=>{handleScreenTouch(e)}} onLongPress={()=>{setPause(true)}} onPressOut={()=>setPause(false)} >
                        <View style={{backgroundColor:'black',justifyContent:'center',flex:1}}>
                            {!pastOnlineStatus && online &&
                                <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
                            }
                            {!online &&
                                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
                            }    
                            <Image resizeMode="contain" style={{height:'100%',width:'100%'}}  source={{uri:statusObject?.imageLocation}} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{marginTop:20,bottom:0,flexDirection:'column',width:'100%',alignItems:'center'}}>
                        <Text numberOfLines={3} style={{color:'white',fontSize:18,marginTop:10,marginBottom:10,padding:5,minWidth:'70%',borderRadius:8,textAlign:'center'}}>{statusObject?.content}</Text>
                    </View>
                    <KeyboardAvoidingView behavior="position" >
                        <View style={[styles.inputDiv,keyboardOn?{marginBottom:40,marginTop:0}:{marginBottom:10,marginTop:20,}]}>
                            <View style={[styles.inputDivSub,{width:'80%',backgroundColor:'white',flexDirection:'row',alignItems:'center'}]}>
                                <TextInput 
                                    style={[styles.textInput]}
                                    value={clientMssg}
                                    multiline={true}
                                    placeholder="Reply"
                                    onChangeText={(mssg)=>{
                                        setClientMssg(mssg);
                                        }
                                    }
                                    onSubmitEditing={()=>{if(online && clientMssg.length>0){submitMssg()}}}
                                />
                            </View>
                            <TouchableOpacity 
                                disabled={!online?true:false}
                                style={styles.send}
                                onPress={()=>{if(online && clientMssg.length>0){submitMssg()}}}
                            >
                                <Ionicons name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

            </View>
        </View>
    );
}

export default StatusView;

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'red'
    },
    textShadow:{
        textShadowColor:'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textShadowRadius:10
    },
    inputDivSub:{
        flexDirection:'column',
        width:'100%',
        borderRadius:8,
        marginLeft:15,
        zIndex:3
    },
    send:{
        alignItems:'center',
        justifyContent:'center',
        height:47,
        width:47,
        borderRadius:60,
        right:15,
        backgroundColor:COLORS.primary,
    },
    inputDiv:{
        zIndex:5,
        elevation:10,
        width:'100%',
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'flex-end',
        justifyContent:'space-between',
        minHeight:45,
    },  
    textInput:{
        minHeight:47,
        maxHeight:55,
        borderColor:null,
        borderRadius:8,
        paddingLeft:20,
        paddingRight:20,
        fontSize:17,
        backgroundColor:'white',
        lineHeight:22,
        width:'90%',
    },
})