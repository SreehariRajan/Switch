import React, { useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View,TextInput,ImageBackground,Keyboard, FlatList,KeyboardAvoidingView,ScrollView, TouchableOpacity,StatusBar,Image,BackHandler,AppState, Alert } from 'react-native';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { useRoute } from '@react-navigation/core';
import { AsyncStorage, } from 'react-native';


// import Animated , {SlideInRight,FadeInUp} from 'react-native-reanimated'; 

// import Animated,{}


import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store';

// icons
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// constants
import { BASE_URL } from '../constants/urls';
import {COLORS} from '../Colors';

// services
// import { Converter } from '../services/ImageConverter';
import {handleAudioRecordingStatus,handleTypingStatus} from '../services/handleStatus';
import FetchMessagesLength from '../hooks/useMessagesLength';
import FetchMessages from '../hooks/useMessages';
import {Context} from '../Context';

// components

import TextInputView from './TextInputView';
import MssgDiv from './MssgDiv';
import AttachOptionsView from './AttachOptionsView';
import HeaderWithOptions from './HeaderWithOptions';
import ContactView from './ContactView';
import EmojiKeyboard from './EmojiKeyboard';
import FetchSeenLength from '../hooks/useSeenLength';
import IndexFinder from '../services/IndexFinder';
import AlertView from './AlertView';

function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const {tonumber,name,imageUri,notificationNumber,setNotificationNumber}=route.params;
    const {userDetails,selectedMssgDetails,contactsDetails,longPressStatusDetails,replyMssgDetails,selectedMssgArrayDetails,tokenDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [selectedMssg,setSelectedMssg]=selectedMssgDetails;
    const [token,setToken] = tokenDetails;
    const [contacts,setContacts]=contactsDetails;
    const [longPressStatus,setLongPressStatus] = longPressStatusDetails ; 
    const [selectedReplyMssg,setSelectedReplyMssg] = replyMssgDetails;
    const [selectedMssgArray,setSelectedMssgArray]=selectedMssgArrayDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;
    const [starredMssgs,setStarredMssgs] = useState([]);
    const [mssgArray,setMssgArray]=useState([]);
    const [mssgArrayPart,setMssgArrayPart]=useState([]);
    const [attachSelected,setAttachSelected]=useState(false);
    const [newMessageLength,setNewMssgLength]=useState(0);
    const [searchClicked,setSearchClicked]=useState(false);
    const [search,setSearch]=useState("");

    const [err,setErr] = useState(false);


    const keyboardRef = useRef();
    const ScrollRef = useRef(null);
    const textInputRef = useRef(null);
    const [keyboardOn,setKeyboardOn]=useState(false);
    const [EmojikeyboardOn,setEmojiKeyboardOn]=useState(false);
    const [date,setDate]=useState("");
    const [scrolling,setScrolling]=useState(false);
    const [clientMssg,setClientMssg]=useState("");
    const [online,setOnline] = useState(false);
    const [imageUnavailable,setImageUnavailable] = useState(false);
    const [starredMssg,setStarredMssg] = useState(false);
    const [localstarredMssgLength,setLocalStarredMssgLength] = useState(-1);
    const [starredMssgShow,setStarredMssgShow] = useState(false);
    const [unstarredMssg,setUnStarredMssg] = useState(false);
    const [seenLength,setSeenLength] = useState(-1);
    const [lastSeen,setLastSeen] = useState();
    var socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });
    useEffect(() => {
        async function savedLength(){
            const lengthof = await AsyncStorage.getItem(tonumber+"starredMssgsLength");
            setLocalStarredMssgLength(Number(lengthof));
        }
        savedLength();
    }, [starredMssgs])

    //fecthing mssgs from local
    useEffect(() => {
        async function getLocalMssg(){
            const mssgsString = await AsyncStorage.getItem(tonumber+'messages');
            const mssgs = JSON.parse(mssgsString);
            if (mssgs){
                var mssgPart =await mssgs.slice(-12);
                mssgPart = await mssgPart.reverse();
                setMssgArrayPart(mssgPart);
                setMssgArray(mssgs);
                const length =await mssgs.length;
            }
        }
        getLocalMssg();
    }, []);

    useEffect(() => {
        const handleClose = ()=>{
                navigation.goBack();
                return true;  
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove();

    }, []);

    // saving mssgs to local
    useEffect(() => {
        const blurListener = navigation.addListener('blur',async ()=>{
                setNotificationNumber(0);
                if (newMessageLength>0){
              
                    AsyncStorage.setItem(tonumber+'messages',JSON.stringify(mssgArray));
                }
                // setStarredMssgs([]);
                // AsyncStorage.setItem(tonumber+'messages',"");
        })
        return blurListener
    }, [newMessageLength,mssgArray]);

    useEffect(() => {

        async function handleAppState(nextAppState){
               if (nextAppState !== 'active'){
                    setNotificationNumber(0);
                    if (newMessageLength>0){
                        AsyncStorage.setItem(tonumber+'messages',JSON.stringify(mssgArray));
                    }
               } 
       };
       AppState.addEventListener('change',handleAppState);
       return () => {
           AppState.addEventListener('change',handleAppState);
           // AppState.removeEventListener('change',handleAppState);
       }
   }, [newMessageLength,mssgArray]);

    useEffect(() => {
        const blurListener = navigation.addListener('blur',async ()=>{
            if (seenLength>-1){
                AsyncStorage.setItem(tonumber+'seenLength',String(seenLength));
            }
    })
    return blurListener
    }, [seenLength]);

    // real time starredmssgChange response
    useEffect(() => {
        socket.on(`Recieve changeStarMessageStatus ${userNumber} ${tonumber}`,async (mssg)=>{
            if (mssg){
                const index =await IndexFinder(mssg,mssgArray);
                const indexPart =await IndexFinder(mssg,mssgArrayPart);
                var selected = mssg;
                selected.starredMessage=false;

                var mssges = mssgArray;
                mssges[index]=selected;

                if (index !==-1){
                    setMssgArray(mssges);
                }
                if (indexPart !==-1){
                    setMssgArrayPart(mssges);
                }
                setNewMssgLength(length=>length+1);    
            }
        
        });
       
    }, [])

    //real time message fetching...
    useEffect(()=>{
        if (!socket){
            return;
        };
        socket.on('error', function (reason){
            console.error('Unable to connect Socket.IO', reason);
        });
        socket.on(`Recieve Message ${userNumber} ${tonumber}`,async (mssg)=>{
            if (mssg){
                setMssgArray((messages)=>[...messages,mssg]);
                setMssgArrayPart((messages)=>[mssg,...messages]);
                setNewMssgLength(length=>length+1);    
            }
        
        });
    },[]);

    //check whether the toNumber user is online or not
    useEffect(() => {

        //asking for online status for user
        socket.emit(`onlineStatusForUser`,{tonumber,userNumber});

        //giving user status
        socket.on(`onlineStatusCheck ${userNumber}`,({askedUser})=>{
         
            if (askedUser){
                //sending userStatus
              
                socket.emit('onlineStatusChecked',{online:true,user:askedUser});
            }
        });

        //reply for online Status
        socket.on(`onlineStatusChecked ${userNumber}`,(statusObject)=>{
            if (statusObject){
             
                //sending userStatus
                setOnline(statusObject.online);
                setLastSeen(statusObject.timeObject);
            }
        })
    },[]);

    // fetching seen length from local
    useEffect(() => {
       async function getSeenLength(){
           const len = await AsyncStorage.getItem(tonumber+'seenLength');
           if (len){
               setSeenLength(Number(len));
           }
       }
       getSeenLength();
    }, []);


    // for seen status
    useEffect(() => {
    //real time
       socket.emit('seenMssgLength',{mssgLength:mssgArray.length,to:tonumber,from:userNumber})

       socket.on(`seenMssgLength ${tonumber} ${userNumber}`,newLength=>{
            if (newLength>seenLength){
                setSeenLength(newLength);
            }
       })

    //not real time
    async function fetchSeenLength(){
        // const token = await SecureStore.getItemAsync('token');
        const response =await FetchSeenLength(userNumber,tonumber,token)
                    .then((res)=>{
                  
                        if (res?.data){
                            if (res.data>seenLength){
                                setSeenLength(res.data)
                            }
                        }
                    })
    }
    fetchSeenLength();

    }, [token])

    //get new messages if any....
    useEffect(() => {
        async function checkNewmssgs(){
            const mssgsString = await AsyncStorage.getItem(tonumber+'messages');
            const mssgs = await JSON.parse(mssgsString);
            const mssgLength = mssgs? mssgs.length : 0;
            // const token = await SecureStore.getItemAsync("token");
            const response = await FetchMessagesLength(userNumber,tonumber,token)
                                .then(res=>{
                               
                                    if (res.status===200){
                                    if (res.data){
                                     
                                        if (mssgs){
                                            if (res.data > mssgLength){
                                              
                                                getMessages(mssgLength);
                                            }
                                        }
                                        else{
                                            getMessages(mssgLength); 
                                        }
                                    }
                                    }
                                    else{
                                        console.log("yyyyyyyyyyyyyyyy")
                                    }
        })
        };
        async function getMessages(lengthofArray){
            // async function permissions(){
            //     const permission =await MediaLibrary.getPermissionsAsync();
            //     console.log("ttttttttttttttttttttttttttttttttTTTTTTTTTTTTTTTT",permission);
            //     if (permission.granted){
            //         return true;
            //     }
            //     else{
            //         let Permission = await MediaLibrary.requestPermissionsAsync();
            //         console.log(Permission);
            //         return Permission.granted;
            //     }
                
            // }
            // const token = await SecureStore.getItemAsync("token");
            const response = await FetchMessages(userNumber,tonumber,lengthofArray,token)
                            .then(res=>{
                                if (res.data){
                                    const arrayForMssg = res.data;
                                    const arrayForPart = res.data.reverse();
                                    setMssgArrayPart(mssg=>[...arrayForPart,...mssg])
                                  
                                    setMssgArray(mssg=>[...mssg,...arrayForPart.reverse()]);
                                    
                                    // permissions()
                                    // .then(async permission=>{
                                    //     // if (permission){
                                    //     //     for (const mssg of res.data){
                                    //     //         console.log("this is res",mssg.ImageStatus);
                                    //     //             async function ImageManage(){
                                    //     //                 if (mssg.ImageStatus === true){
                                    //     //                     const localUri = await Converter(mssg.image.imageEncoded)
                                    //     //                     const mssgObj = await {message:mssg.message,ImageStatus:mssg.ImageStatus,image:{localUri:localUri},replyStatus:mssg.replyStatus,forwardStatus:mssg.forwardStatus,repliedFor:mssg.repliedFor,time:mssg.time,timeObject:mssg.timeObject,from:mssg.from,to:mssg.to};                                                           
                                    //     //                     setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);
                                    //     //                     setMssgArray((mssg)=>[...mssg,mssgObj]);
                                    //     //                 }
                                    //     //                 else{
                                    //     //                     setMssgArrayPart(mssgArrayPart=>[mssg,...mssgArrayPart]);
                                    //     //                     setMssgArray((mssgs)=>[...mssgs,mssg]);
                                    //     //                 }
                                    //     //             }
                                    //     //             await ImageManage();    
                                    //     // };
                                    //     // }
                                    // })
                                    setNewMssgLength(length=>length + res.data.length);
                                }
                            })
        };
        checkNewmssgs();
        
    }, [token]);
    //keyboard listeners
    // useEffect(() => {
    //     Keyboard.addListener('keyboardDidHide',()=>{
    //         setKeyboardOn(false);
    //         handleTypingStatus('end',userNumber,contacts);
    //     });
    //     Keyboard.addListener('keyboardDidShow',()=>{
    //         setKeyboardOn(true);
    //         socket.on(`typingStatusCheck ${userNumber}`,(details)=>{
    //             console.log(details.askedUser,"oooooooothis is working god")
    //             if (details.askedUser && details.checkNumber){
    //                 //sending userStatus
    //                 console.log(details.askedUser)
    //                 socket.emit('typingStatusChecked',{typing:true,user:details.askedUser,ofUser:userNumber});
    //             }
    //         });
    //         handleTypingStatus('start',userNumber,contacts);
    //     });
    //     return ()=>{
    //         Keyboard.removeAllListeners;
    //     };
    // });

    //auto scrolling to new messages 
    useEffect(() => {
        if (ScrollRef.current){
            setTimeout(()=>ScrollRef.current.scrollToIndex({index:notificationNumber}),200);
        }
       
    }, []);

    useEffect(() => {
        setImageUnavailable(false);
    }, [selectedReplyMssg]);

    useEffect(()=>{
        if (selectedReplyMssg !== null){
            setAttachSelected(false);
        }
    },[selectedReplyMssg]);


    //to get the date of the view items changing....
    const onViewableItemsChanged =({viewableItems})=>{
        // console.log("hsgfsgf",viewableItems[0].item);
        const monthsList = ['Jan','Feb','Mar','April','May','Jun','July','Aug','Sept','Oct','Nov','Dec' ];
        if (viewableItems[0] !==undefined && viewableItems[0].item !==undefined){
            if (viewableItems[0].item.timeObject.day !==undefined && viewableItems[0].item.timeObject.month!==undefined && viewableItems[0].item.timeObject.year !== undefined){
                const Time = new Date();
                const year = Number(Time.getFullYear());
                const month = Number(Time.getMonth()+1);
                const day = Number(Time.getDate());
                var dateString = `${viewableItems[0].item.timeObject.day} ${monthsList[viewableItems[0].item.timeObject.month-1]} ${viewableItems[0].item.timeObject.year}`;
                if (year === viewableItems[0].item.timeObject.year && month === viewableItems[0].item.timeObject.month && day-1 === viewableItems[0].item.timeObject.day ){
                dateString = "Yesterday"
                }
                setDate(dateString);
            }
            else{
                setDate('');

            }
        }
    };
    

    //handling scroll to bottom button
    const handleScrollToBottom =() =>{
        if (ScrollRef.current && ScrollRef.current!==null){
                ScrollRef.current.scrollToIndex({index:0,animated:true});
        }
    };

    //when scrolltoindex failed not neccessary at now ig.
    const scrollToIndexFAiled = (err) =>{
        handleInfiniteScrolling();
        console.log("iiiiiiiiiiiiiiiiii")
        const offset = err.averageItemLength*err.index;
        if (ScrollRef.current && ScrollRef.current!==null){
            ScrollRef.current.scrollToOffset({offset:offset});
            setTimeout(()=>ScrollRef.current.scrollToIndex({index:err.index}),100);
        }
    };

    const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

    const handleDateShow = () =>{
        setScrolling(true);
    };
    const handleDateHide = () =>{
        setTimeout(()=>setScrolling(false),2000);
        // setScrolling(false);
    };

    const handleInfiniteScrolling = async() =>{
        var PartLength =await mssgArrayPart.length;
      
        // var mssgsToadd =await mssgArray.slice(PartLength,PartLength+12);
        var mssgsToadd =await mssgArray.slice(-(PartLength+12),-PartLength);
        // var mssgsToadd =await mssgArray.slice(mssgArray.length-(PartLength+12),-PartLength);
        mssgsToadd.reverse();
        
        setMssgArrayPart(mssg=>[...mssg,...mssgsToadd]);
    };

    async function submitMssg(){
        setErr(false);
        const Time = new Date();
        const year = Number(Time.getFullYear());
        const month = Number(Time.getMonth()+1);
        const day = Number(Time.getDate());
        const hours = Number(Time.getHours());
        const minutes = Number(Time.getMinutes());
        const seconds = Number(Time.getSeconds());
        console.log("Emit",Time,year,month,day);
        if (clientMssg){
            const mssgObj = await {message:clientMssg,starredMessage:starredMssg,ImageStatus:false,DocumentStatus:false,AudioStatus:false,audio:{value:null},document:{value:null},image:{value:null},replyStatus:selectedReplyMssg!==null?true:false,forwardStatus:false,repliedFor:selectedReplyMssg!==null?selectedReplyMssg:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
            socket.on('connect_error', ()=> {
                setErr(true);
             });
            socket.emit(`Send Message`,mssgObj,(status)=>{
                console.log(status,"this is awsome man common lets start");

                if (status===200){
                    setMssgArray([...mssgArray,mssgObj]);
                    setSelectedReplyMssg(null);
                    setMssgArrayPart([mssgObj,...mssgArrayPart]);
                    if (starredMssg){
                        setStarredMssgs(mssgs=>[mssgObj,...mssgs])
                    }
                    setNewMssgLength(length=>length+1);
                    setSeenLength(mssg=>mssg+1);
                    setLatestMssg(mssgObj);
                    setClientMssg("");
                }
                else{
                    setErr(true);
                    
                }
            });
            // setKeyboardOn(false);
            // Keyboard.dismiss();s
        };
    };

    useEffect(()=>{
        setTimeout(()=>setErr(false),3000);
    },[err]);
    useEffect(() => {
        if (latestMssg?.repliedStatus && latestMssg.repliedFor.status){
            setMssgArray([...mssgArray,latestMssg]);
            setMssgArrayPart([latestMssg,...mssgArrayPart]);
            setNewMssgLength(length=>length+1);
            setSeenLength(mssg=>mssg+1);
        }
    }, [latestMssg]);
    
    useEffect(() => {
        if (searchClicked){
            if (keyboardRef.current){
                keyboardRef.current.focus();
            }
        }
     }, [searchClicked]);


    return (
    <View style={styles.container}>
        
        {
            err && 
            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"Something went wrong"} subContent={"message not sent"} />
        }
        <StatusBar backgroundColor={COLORS.contactView} barStyle='light-content' />
        {/* <Text>this is user {user}</Text> */}
        {selectedMssgArray.length===0?
            (!searchClicked?
                <View style={{flexDirection:'row',alignItems:'center',width:'100%',backgroundColor:COLORS.primary,elevation:2}} >
                    <ContactView 
                    lastSeen={lastSeen} 
                    setLastSeen={setLastSeen} 
                    chatScreen={true} 
                    online={online} 
                    name={name} 
                    imageUri={imageUri} 
                    tonumber={tonumber} 
                    starredMssgs={starredMssgs}
                    mssgArrayPart={mssgArrayPart}
                    setMssgArrayPart={setMssgArrayPart}
                    handleInfiniteScrolling={handleInfiniteScrolling}
                    mssgArray={mssgArray}
                    ScrollRef={ScrollRef}
                    />
                    <TouchableOpacity style={{paddingRight:20,backgroundColor:COLORS.primary,height:'100%',alignItems:'center',flexDirection:'row'}} onPress={()=>{setSearchClicked(true)}}>
                        <FontAwesome name="search" size={20} color="#ffffff9e" />
                    </TouchableOpacity>
                </View>
            :
                <View style={{width:'100%',height:62,paddingLeft:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:COLORS.primary}}>
                    <TouchableOpacity onPress={()=>{setSearch("");setSearchClicked(false)}}>
                        <Ionicons name="arrow-back" size={25} color="white" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <TextInput placeholder="Search message" ref={keyboardRef} value={search} onChangeText={text=>{setSearch(text)}} style={styles.search} />
                        <FontAwesome name="search" size={20} color="#ffffff7a" />
                    </View>
                </View>
            )
            :
            <HeaderWithOptions 
                token={token} 
                setUnStarredMssg={setUnStarredMssg} 
                starredMssgs={starredMssgs} 
                setStarredMssgs={setStarredMssgs} 
                newMessageLength={newMessageLength} 
                setNewMssgLength={setNewMssgLength} 
                mssgArrayPart={mssgArrayPart} 
                mssgArray={mssgArray} 
                setMssgArray={setMssgArray} 
                setMssgArrayPart={setMssgArrayPart} 
                toNumber={tonumber}
                setErr={setErr}
            />
        }
        <ImageBackground
            source={require('../assets/images/chatScreenBg.png')} 
            style={styles.mssgView}>
            {
                scrolling && date !=="" &&
                <View style={styles.dateView}>
                    <Text style={styles.dateViewText} >{date}</Text>
                    {/* <Text>{mssg.timeObject.month}</Text> */}
                </View>
            }
            {
                // starredMssgs.length>0 && 
                starredMssgs.length>0 && starredMssgs.length>localstarredMssgLength &&
                <View style={[{position:'absolute',top:10,left:10,zIndex:3,width:'95%',borderRadius:8},starredMssgShow && {height:'100%',backgroundColor:'#f5f3f3',elevation:4}]}>
                    <TouchableOpacity style={{width:45,height:45}} onPress={()=>navigation.navigate("StarredMssgView",
                        {
                        fromProfile:false,
                        name:name,               
                        starredMssgs:starredMssgs,
                        toNumber:tonumber,
                        userNumber:userNumber,
                        user:user,
                        mssgArrayPart:mssgArrayPart,
                        setMssgArrayPart:setMssgArrayPart,
                        handleInfiniteScrolling:handleInfiniteScrolling,
                        mssgArray:mssgArray,
                        ScrollRef:ScrollRef,
                        })}>
                    {/* <TouchableOpacity style={{width:45,height:45}} onPress={()=>setStarredMssgShow(!starredMssgShow)}> */}
                        <MaterialCommunityIcons name="message-alert" size={40} color={"red"} />
                        
                    </TouchableOpacity>
                </View>
            }
            {attachSelected &&
                <View
                    // duration={5000}
                    style={[styles.attachView,keyboardOn?{top:0}:{top:'35%'}]}
                >   
                    <TouchableOpacity
                        style={{padding:10,height:60,
                            width:60,
                            justifyContent:'center',
                            alignItems:'center',
                            flexDirection:'row',
                            backgroundColor:COLORS.primary,
                            borderRadius:60,
                            elevation:5,
                            marginBottom:10}}
                        onPress={()=>setAttachSelected(!attachSelected)}
                    >
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <AttachOptionsView
                        token={token}
                        date={null} 
                        setEmojiKeyboardOn={setEmojiKeyboardOn}
                        name={name} 
                        tonumber={tonumber} 
                        setMssgArrayPart={setMssgArrayPart} 
                        setMssgArray={setMssgArray} 
                        setNewMssgLength={setNewMssgLength}
                        setErr={setErr}
                        
                        />
                </View>
                // :
                // <TouchableOpacity
                //     style={[styles.attachView,styles.attachViewOff]}
                //     onPress={()=>setAttachSelected(!attachSelected)}
                //     >
                //     <Entypo name="attachment" size={25} color={COLORS.primary} />
                // </TouchableOpacity>
               

            }
            {mssgArray !==undefined && mssgArrayPart!==undefined &&
                <FlatList
                    keyboardShouldPersistTaps="always"
                    ref={ScrollRef}
                    style={[styles.mssgViewChild,{marginBottom:selectedReplyMssg?65:0}]}
                    data={search.length>0?mssgArray.filter(item=>{
                        return search!==""?item.message.toLowerCase().includes(search.toLowerCase()):item;
                    })
                    :
                    mssgArrayPart
                    }
                    // data = {mssgArrayPart}
                    inverted={search.length>0?false:true}
                    // initialScrollIndex={10}
                    onScrollToIndexFailed={scrollToIndexFAiled}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    // viewabilityConfig={{
                    // itemVisiblePercentThreshold: 50
                    onScrollBeginDrag={handleDateShow}
                    onEndReached={handleInfiniteScrolling}
                    onMomentumScrollEnd ={handleDateHide}
                    onEndReachedThreshold={0.3}
                    renderItem = {({item,index})=>
                        <MssgDiv mssgArrayPart={mssgArrayPart} 
                                setMssgArrayPart={setMssgArrayPart}

                                setSearchClicked={setSearchClicked}
                                setSearch={setSearch}
                                search={search}

                                handleInfiniteScrolling={handleInfiniteScrolling} 
                                mssgArray={mssgArray} 
                                ScrollRef={ScrollRef} 
                                toUser={name} 
                                toNumber={tonumber} 
                                mssg={item} 
                                index={index} 
                                userNumber={userNumber} 
                                lengthofArray={mssgArray.length} 
                                notificationNumber={notificationNumber} 
                                user={user}
                                starredMssgs={starredMssgs}
                                setStarredMssgs={setStarredMssgs}
                                seenLength={seenLength}
                        />
                                                }
                    keyExtractor={(item,index)=>index.toString()}
                />
            }
            {!selectedReplyMssg &&
            <TouchableOpacity
                onPress={handleScrollToBottom}
                style={styles.scrollToEnd}>
                <FontAwesome name="angle-double-down" size={22} color='gray' />
            </TouchableOpacity>
            }
        </ImageBackground>
        {EmojikeyboardOn &&
            <EmojiKeyboard 
                setClientMssg={setClientMssg}
            />
        }
        <TextInputView
            token={token} 
            contacts={contacts}
            tonumber={tonumber}
            name={name}
            setMssgArrayPart={setMssgArrayPart}
            setMssgArray={setMssgArray}
            setNewMssgLength={setNewMssgLength}
            selectedReplyMssg={selectedReplyMssg}
            imageUnavailable={imageUnavailable}
            userNumber={userNumber}
            // attachOptionHeight={attachOptionHeight}
            // attachOptionWidth={attachOptionWidth}
            setImageUnavailable={setImageUnavailable}
            setSelectedReplyMssg={setSelectedReplyMssg}
            textInputRef={textInputRef}
            setKeyboardOn={setKeyboardOn}
            clientMssg={clientMssg}
            setClientMssg={setClientMssg}
            keyboardOn={keyboardOn}
            setAttachSelected={setAttachSelected}
            attachSelected={attachSelected}
            submitMssg={submitMssg}
            handleScrollToBottom={handleScrollToBottom}
            user={user}
            setEmojiKeyboardOn={setEmojiKeyboardOn}
            starredMssg={starredMssg}
            setStarredMssg={setStarredMssg}
        />
    </View>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    attachViewOff:{
        backgroundColor:'white',
        borderBottomLeftRadius:0,
        borderTopLeftRadius:80,
        padding:6,
        paddingTop:19,
        paddingBottom:15,
    },
    attachView:{
        backgroundColor:'transparent',
        position:'absolute',
        right:0,
        zIndex:2,
        flexDirection:'column',
        alignItems:'center',
        padding:10,
        borderTopLeftRadius:20,
        borderBottomLeftRadius:20,
        // elevation:10
    },
    scrollToEnd:{
        zIndex:5,
        position:'absolute',
        bottom:80,
        right:20,
        backgroundColor:'white',
        elevation:3,
        width:33,
        height:33,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
    },
    dateViewText:{
        color:'white',
        fontSize:13
    },
    dateView:{
        position:'absolute',
        // elevation:2,
        zIndex:2,
        top:10,
        alignSelf:'center',
        backgroundColor:'#0000004d',
        minWidth:130,
        minHeight:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    usertext:{
        marginTop:50,
        width:'100%',
        backgroundColor:'green',
        height:30
    },
    mssgViewChild:{
        // paddingLeft:20,
        // paddingRight:20,
        paddingBottom:20,
        height:'100%',
    },
    mssgView:{
        alignSelf:'center',
        width:'100%',
        backgroundColor:COLORS.thertiarySub,
        // backgroundColor:'#f6f6f6',
        // backgroundColor:'#f5f3f3',
        flex:1,
        shadowColor: '#000',
        paddingBottom:70,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        // paddingTop:10
        
    },  
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%',
        backgroundColor:COLORS.thertiarySub,
        paddingTop:0
    },
    searchContainer:{
        width:'95%',
        alignItems:'center',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:COLORS.primary,
        borderRadius:5,
        // elevation:2,
        height:40,
    },
    search:{
        width:'90%',
        height:'100%',
        borderRadius:30,
        paddingLeft:20,
        paddingRight:20,
        fontSize:16,
        color:'#ffffffdb',
        textDecorationLine:"none"

    },
});
