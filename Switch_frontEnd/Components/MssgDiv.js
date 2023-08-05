import React, { useContext,useEffect,useState } from 'react';
import { AsyncStorage, TouchableOpacity } from 'react-native';
import { Touchable } from 'react-native';
import { TouchableHighlight } from 'react-native';
import { View,StyleSheet,Text,TouchableWithoutFeedback } from 'react-native';
import {COLORS} from '../Colors';
import { Context } from '../Context';
import { useNavigation,StackActions } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import IndexFinder from '../services/IndexFinder';
import { Image } from 'react-native';
import ImagePreview from './ImagePreview';
import { ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import handleAbbreviations from '../services/handleAbbreviations';
import { MaterialCommunityIcons } from '@expo/vector-icons';



function MssgDiv({TimerMessagesEditView,setSearchClicked,setSearch,TimerMessagesView,seenLength,mssgArrayPart,setMssgArrayPart,search,handleInfiniteScrolling,mssgArray,ScrollRef,toUser,toNumber,mssg,index,userNumber,setStarredMssgShow,starredMssgsView,user,lengthofArray,notificationNumber,fromProfile,starredMssgs,setStarredMssgs}) {
    const navigation = useNavigation();
    const {contactsDetails,selectedMssgDetails,selectedMssgArrayDetails,selectedIndexDetails,longPressStatusDetails,replyMssgDetails,selectionCheckDetails,audioDetails} = useContext(Context);
    const [contacts,setContacts]=contactsDetails;
    const [selectedMssg,setSelectedMssg]=selectedMssgDetails;
    const [selectedMssgArray,setSelectedMssgArray]=selectedMssgArrayDetails;
    const [audioIndex,setAudioIndex,playingAudio,setPlayingAudio]=audioDetails;
    const [longPressStatus,setLongPressStatus] = longPressStatusDetails ; 
    const [selectedReplyMssg,setSelectedReplyMssg] = replyMssgDetails;
    const [selectedIndex,setSelectedIndex] = selectedIndexDetails;
    const [selected,setSelected] = useState(false);
    const [selectedOne,setSelectedOne] = useState(false);
    const [deleted,setDeleted] = useState(false);

    const [changedMssg,setChangedMssg] = useState(null);

    const [imageAvailable,setImageAvailable] = useState(true);
    const [selectionCheck,setSelectionCheck]=selectionCheckDetails;
    const [playing,setPlaying] = useState(false);

    // const [sound,setSound] = useState();
    const [abbreviationShowEnable,setAbbreviationEnableShow] = useState(false);

    const [audio,setAudio]=useState(null);
    const [soundObj,setSoundObj]=useState(null);
    const [currentAudio,setCurrentAudio]=useState({});

    useEffect(() => {
        if (!longPressStatus){
            setSelected(false);
        }
    }, [longPressStatus])

    useEffect(() => {
        async function Check(){
            SecureStore.getItemAsync('enableAbbreviationShow')
            .then(valueStr=>{
                if (valueStr==="true"){
                    setAbbreviationEnableShow(true);
                }
                else{
                    setAbbreviationEnableShow(false)
                }
            })
            
        }
        Check()
        return () => {
            
        }
    }, []);

    // handle deleted for me check
    useEffect(() => {
       async function deleteCheck(){
           setDeleted(false);
           const deletedMssgArrayString =await AsyncStorage.getItem(mssg?.to.userNumber+"deletedMssg");
           const deletedMssgArray = await JSON.parse(deletedMssgArrayString);
           console.log("deleted number hide",deletedMssgArray?.length,index,seenLength)
           if (deletedMssgArray){
                const index = await IndexFinder(mssg,deletedMssgArray);
                if (index!==-1){
                    setDeleted(true);
                }
            }
       }
       deleteCheck();
    }, [mssg,selectedMssgArray])

    //handle starredMssgs
    useEffect(() => {
        if (starredMssgs !==null){
            if (mssg?.starredMessage){
            // if (mssg.from.userNumber===userNumber){
                setStarredMssgs(mssges=>[...mssges,mssg])
            // }

            }
        }
    }, [])

    //handleAbbreviations
    useEffect(() => {
        async function handleAbbreviation(){
            if (mssg){
                const changedMessage =await handleAbbreviations(mssg.message);
                // console.log(changedMssg,"changeddd")
                setChangedMssg(()=>changedMessage);
                console.log("changedd               mggggggggggguyg",changedMessage)
            }
        }
        if (abbreviationShowEnable && mssg!==undefined && mssg?.from.userNumber!==userNumber){
            handleAbbreviation();
        }
        else{
            if (mssg){
                setChangedMssg(()=>mssg.message)
            }
        }
        
    }, [abbreviationShowEnable,mssg])

    const handleReplymssg = async()=>{
        if ((mssg.replyStatus && !mssg.repliedFor.status) || search?.length>0){
            var Index;
            if (search.length<=0)
                Index =await IndexFinder(mssg.repliedFor,mssgArray);
            else
            {
                Index =await IndexFinder(mssg,mssgArray);
                console.log(Index,"come jfgkudfhgkijhdfjkfh");
            }
            setSearchClicked(false);
            setSearch(()=>"");
            console.log("presseddd")
            if (ScrollRef.current && ScrollRef.current !==null){
                var partArrayLength = mssgArrayPart.length;
                var arrayLength = mssgArray.length;
                Index = arrayLength-(Index+1);
                while (Index >= partArrayLength){
                    console.log(partArrayLength,"mssg div",Index);
                    handleInfiniteScrolling();
                    partArrayLength= mssgArrayPart.length;
                }
                if (Index !==-1 && Index <= partArrayLength){
                    ScrollRef.current.scrollToIndex({index:Index,animated:true,viewPosition:0.5});
                    console.log(index,Index,"iiiiiiiiiiiiiiiiiiiiiiiii");
                    // if (index===Index){
                    setSelectedIndex(Index);
                    setTimeout(()=>setSelectedIndex(null),1000);
                    console.log("yessss inexd")
                    // setTimeout(()=>setSelected(false),2000);
                    // }
                    if (starredMssgsView){
                        // navigation.goBack();
                        if (fromProfile){
                            navigation.dispatch(StackActions.pop(2));
                        }
                        else{
                            navigation.goBack();
                        }
                    }
                    Index=-1;
                }
            }
        }
    };
    const handlePress =async ()=>{
        if (!longPressStatus){
            if (mssg.ImageStatus && !TimerMessagesView){
                if (imageAvailable){
                    console.log("image",mssg.image)
                    navigation.navigate("ImagePreview",{time:null,name:mssg.from.userNumber===userNumber?"You":contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===mssg.from.userNumber)]?.name,tonumber:null,setMssgArray:null,setMssgArrayPart:null,setNewMssgLength:null,fromChatScreen:true,image:mssg.image,fileObject:null});
                }
                else{
                    ToastAndroid.show("Image not available",ToastAndroid.SHORT);
                }
            }
            else if(mssg.DocumentStatus && !TimerMessagesView){
                // if ((await FileSystem.getInfoAsync(FileSystem.documentDirectory+'/documents')).exists===false){
                //     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory+'/documents');
                // }
                // console.log("created")
                // const fileNameObject = await mssg.document.location.split('/');
                // const fileName = await fileNameObject[fileNameObject.length-1];
                // FileSystem.downloadAsync(mssg.document.location,FileSystem.documentDirectory+fileName)
                // .then(({uri})=>{
                //     console.log(uri);
                    
                //     navigation.navigate("PdfViewer",{uri:uri});
                // })
               const ability = await Linking.canOpenURL(mssg.document.location);
               console.log(ability);
               if (ability){
                   Linking.openURL(mssg.document.location)
               }
               else{
                   Alert.alert("No app supports this format");
               }
                // 

            }
            else if(TimerMessagesView){
                navigation.navigate("EditTimerMssg",{mssg:mssg});
            }
            else{
                handleReplymssg();
            }
            setSelectedOne(true);
            setTimeout(()=>setSelectedOne(false),95);
            
        }
        else if (longPressStatus){
            const index = await IndexFinder(mssg,selectedMssgArray);
            console.log(index,"namskarams daaaa");
            if (index === -1){
                setSelectedMssg(mssg);
                setSelectedMssgArray(mssgselected=>[...mssgselected,mssg]);
                setSelected(true);
            }
            else{
                const lengthof = selectedMssgArray.length;
                if (lengthof===1){
                    setLongPressStatus(false);
                }
                setSelectedMssgArray(mssgselected=>mssgselected.filter((item,indx)=>{return indx !==index})); 
                setSelected(false);
                
            }
        }
    }
    const handleLongPress = ()=>{
        if (!longPressStatus && !starredMssgsView && !TimerMessagesView && !TimerMessagesEditView){
            setSelectedMssg(mssg);
            console.log("yes workeddddd")
            setSelectedMssgArray(mssgselected=>[...mssgselected,mssg]);
            setSelected(true);
            console.log("yes workeddddd",selectedMssgArray);
        };
        if (!TimerMessagesView && !TimerMessagesEditView){
            setLongPressStatus(true);
        }
    }

    const swipeActons = (action)=>{
        switch (action.type){
            case 'RIGHT':
                setSelectedReplyMssg(mssg);
                break;
            case 'LEFT':
                // navigation.navigate("ForwardMssgView",{setMssgArrayPart:setMssgArrayPart,toNumberFrom:toNumber})
                break;
                // setSelectedMssg(mssg);
        }
            
    };
    useEffect(()=>{
        if (!selectionCheck){
            setSelected(false)
        }
    },[selectionCheck]);
    useEffect(()=>{
        const blurListener = navigation.addListener('blur',async ()=>{
            setSelected(false);
            setLongPressStatus(false);
        })
        return blurListener
    },[setSelected]);

    const forwardSelectionCheck = async ()=>{
        const index = await IndexFinder(mssg,selectedMssgArray);
        if (index===-1){
            console.log("transparenttttttttttttttttttttttttttttttt");
            return {backgroundColor:'transparent'}
        }
        else{
            console.log("greeeeeeeeeeeeeeeeeeeeeeeeeeeeeennnnn");

             return {backgroundColor:'green'}
        }
    }
    //handling sound play
    useEffect(() => {
      return audio
      ? ()=>{
          console.log("unloading sound");
          audio.unloadAsync();
          setPlayingAudio(false)
          setAudioIndex(undefined);
      }:undefined

    }, [audio]);

    const _onPlaybackStatusUpdate = (playbackStatus) =>{
        if (playbackStatus.isLoaded){
            if (playbackStatus.didJustFinish){
                setPlaying(false);
                setCurrentAudio({});
                setAudio(null);
                setSoundObj(null);
                setPlayingAudio(false)
                setAudioIndex(undefined);
            }
        }
    }


    async function handleAudioPlay(){
        if (!playingAudio || audioIndex===index){
                if (audio===null){
                    const playbackObj=new Audio.Sound();
                    const status= await playbackObj.loadAsync({uri:mssg.audio.location,didJustFinish:true},{shouldPlay:true,isLooping:false});
                    playbackObj.setOnPlaybackStatusUpdate((e)=>_onPlaybackStatusUpdate(e));
                    setPlaying(true)
                    setAudioIndex(index);
                    setPlayingAudio(true);
                    setCurrentAudio(mssg.audio);
                    setAudio(playbackObj);
                    setSoundObj(status)
                    
                }
                if (soundObj?.isLoaded && soundObj.isPlaying){
                    const status=await audio.setStatusAsync({shouldPlay:false});
                    setPlayingAudio(false);
                    setPlaying(false)
                    setSoundObj(status);
                }
                if (soundObj?.isLoaded && !soundObj.isPlaying){
                    const status=await audio.playAsync();
                    setPlaying(true);
                    setPlayingAudio(true);
                    setSoundObj(status);
                }
        }
        else{
            Alert.alert("Another audio is playing")
        }
    }
    
    return (
        <GestureRecognizer
            onSwipeRight={()=>swipeActons({type:'RIGHT'})}
            onSwipeLeft={()=>swipeActons({type:'LEFT'})}
        >   
        {!deleted &&
            <TouchableWithoutFeedback onPress={handlePress} onLongPress={handleLongPress}>
                <View index={index} style={[mssg?.from?.userNumber===userNumber?styles.sendmessage:styles.recievedmssg,(selectedIndex===index || selected) && {backgroundColor:'#198bda3b'}]}>
                    {notificationNumber!=0 && index===notificationNumber-1 && mssg?.from.userNumber!==userNumber &&
                        <View style={styles.newMssgDiv}>
                            <View style={{flex:1,height:1,backgroundColor:'black'}}/>
                            <Text style={[styles.newMssgText]}>New messages</Text>
                            <View style={{flex:1,height:1,backgroundColor:'black'}}/>
                        </View>
                    }
                    {
                        TimerMessagesView &&
                        <Text>to : {contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===mssg.to.userNumber)]?.name}</Text>
                    }
                    <View 
                    style={[styles.Message,mssg?.from?.userNumber===userNumber?[{
                    // <View style={[styles.Message,mssg?.from?.userNumber===userNumber?[{
                        // backgroundColor:COLORS.primary,
                        borderBottomRightRadius:15,
                        borderTopLeftRadius:8,
                        borderBottomLeftRadius:8,
                        backgroundColor:COLORS.mssgColor
                        },
                        !TimerMessagesEditView && !TimerMessagesView && mssgArrayPart[index+1]?.from.userNumber===userNumber && {borderTopRightRadius:8,borderBottomRightRadius:8}
                        ]:
                        [{
                            // backgroundColor:'white',
                        backgroundColor:'white',
                        borderBottomRightRadius:8,
                        borderTopRightRadius:8,
                        borderBottomLeftRadius:15},!TimerMessagesEditView && !TimerMessagesView && mssgArrayPart[index+1]?.from.userNumber!==userNumber && {borderTopLeftRadius:8,borderBottomLeftRadius:8},
                        ]
                        ,mssg?.ImageStatus && {width:210},selectedOne && {backgroundColor:"#ccd5e4"}]}>
                        {
                            mssg?.forwardStatus &&
                            <View style={styles.forwardView}>
                                <Text style={[styles.forwardText,mssg?.from?.userNumber===userNumber?{color:'#0000007d',}:{color:'#00000085'}]}>forwarded</Text>
                                <Entypo name="forward" size={12} color={mssg?.from?.userNumber===userNumber?"#00000085":"#00000085"} />
                            </View>

                        }
                        {
                            mssg?.starredMessage &&
                                <MaterialCommunityIcons style={{paddingLeft:10,paddingTop:5}} name="message-alert" size={13} color="#00000085" />
                        }
                        {
                            mssg?.DocumentStatus === true &&
                            (
                                <View style={{width:200,flexDirection:'row',alignItems:'center',padding:5}}>
                                    <View style={{height:50,width:50,alignItems:'center',flexDirection:'row',backgroundColor:'#94a0b62e',borderRadius:8,justifyContent:'center',marginRight:5}}>
                                        <Ionicons name="document" size={38} color={COLORS.primary} />
                                    </View>
                                    <Text numberOfLines={1} style={[{width:130},{color:'black'}]}>{mssg.document.name?mssg.document.name:"document"}</Text>
                                </View>
                                
                            )
                        }
                        {
                            mssg?.AudioStatus &&
                            (
                                <View style={{width:260,flexDirection:'row',alignItems:'center',padding:5}}>
                                    <TouchableOpacity onPress={()=>{
                                        handleAudioPlay();
                                    }
                                        } style={{height:50,width:50,alignItems:'center',flexDirection:'row',backgroundColor:'#94a0b62e',borderRadius:8,justifyContent:'center',marginRight:5}}>
                                    {!playing ?
                                        <Entypo name="controller-play" size={38} color={COLORS.primary} />
                                        :
                                        <AntDesign name="pause" size={38} color={COLORS.primary} />
                                    }
                                    </TouchableOpacity>
                                    <View style={{flexDirection:'column',alignItems:'flex-start',height:'100%'}}>
                                        {mssg.audio.recording &&
                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:200}}>
                                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                                    <Entypo style={{marginRight:2}} name="controller-record" size={6} color={mssg?.from?.userNumber===userNumber?"#00000085":COLORS.primary} /> 
                                                    <Text style={[{fontSize:10},mssg?.from?.userNumber===userNumber?{color:'#0000007d'}:{color:COLORS.primary}]}>
                                                        rec
                                                    </Text>
                                                </View>
                                                <Text style={[{fontSize:10,paddingRight:6,fontSize:10},mssg?.from?.userNumber===userNumber?{color:'#0000007d'}:{color:COLORS.primary}]}>
                                                    {
                                                        mssg.audio.duration<=60?
                                                            (String(mssg.audio.duration).length<2?
                                                            `00:0${mssg.audio.duration}`
                                                            :
                                                            `00:${mssg.audio.duration}`)
                                                        :
                                                        String(Math.floor(mssg.audio.duration/60)).length<2?
                                                            String(mssg.audio.duration%60).length<2?
                                                                `0${Math.floor(mssg.audio.duration/60)}:0${mssg.audio.duration%60}`
                                                            :
                                                                `0${Math.floor(mssg.audio.duration/60)}:${mssg.audio.duration%60}`
                                                        :
                                                            String(mssg.audio.duration%60).length<2?
                                                                `0${Math.floor(mssg.audio.duration/60)}:0${mssg.audio.duration%60}`
                                                            :
                                                                `${Math.floor(mssg.audio.duration/60)}:${mssg.audio.duration%60}`
                                                    }
                                                </Text>
                                            </View>
                                        }
                                        <Text numberOfLines={1} style={[{width:190},{color:'black'}]}>{mssg.audio.name?mssg.audio.name:"audio"}</Text>
                                    </View>
                                </View>
                            )
                        }
                        {
                            mssg?.ImageStatus===true && 
                            (
                                imageAvailable ?
                                <View style={styles.image}>
                                    {/* <Image 
                                        style={styles.image}
                                        loadingIndicatorSource={require('../assets/download.jpg')}
                                        onError={()=>setImageAvailable(false)}
                                        source={imageAvailable?{uri:mssg?.image?.location}:require('../assets/notAvailable.png')}
                                    /> */}
                                    <Image resizeMode="contain" onError={()=>setImageAvailable(false)} style={{height:'100%',width:'100%'}} source={imageAvailable?{uri:mssg?.image?.location}:require('../assets/notAvailable.png')} />
                                </View>
                                    
                                :
                                <View style={[styles.imageNotAvailable,{backgroundColor:mssg?.from?.userNumber===userNumber?'white':'#f5f3f3'}]}>
                                    <MaterialIcons name="image-not-supported" size={100} color="#E9E9E9" />
                                </View>
                            )
                                
                        }
                        {
                        mssg?.replyStatus &&
                            <View style={[styles.replyMssgDiv,mssg?.from?.userNumber===userNumber?{
                                backgroundColor:"#94a0b62e",
                                borderTopLeftRadius:8,
                                marginRight:0,
                                
                                }:
                                {borderTopRightRadius:8,
                                    marginLeft:0,
                                    backgroundColor:'#0000000f',
                            }]} >
                                <View style={{flexDirection:'column',alignItems:'flex-start'}}>
                                    {!mssg?.repliedFor.status ?
                                        <Text numberOfLines={1} style={[mssg?.from?.userNumber===userNumber?{
                                            color:'black'}:
                                            {color:COLORS.primary},
                                            {fontWeight:'bold',fontSize:12}]}
                                            >
                                            {mssg.repliedFor.from.userNumber===toNumber?toUser:"You"}
                                        </Text>
                                    :
                                        <Text numberOfLines={1} style={[mssg?.from?.userNumber===userNumber?{
                                            color:'black'}:
                                            {color:COLORS.primary},
                                            {fontWeight:'bold',fontSize:12}]}
                                            >
                                            {mssg.repliedFor.from.userNumber!==toNumber?`${toUser}'s Story`:"Your Story"}
                                        </Text>
                                    }
                                    <Text numberOfLines={1} style={[{width:180},mssg?.from?.userNumber===userNumber?{
                                        color:'#424242',fontSize:11}:
                                        {color:COLORS.primary}
                                        ]} >
                                            {
                                                mssg.repliedFor.AudioStatus || mssg.repliedFor.DocumentStatus ?
                                                (mssg.repliedFor.audio.name?
                                                    `${mssg.repliedFor.audio.name}`
                                                    :
                                                    `${mssg.repliedFor.document.name}`
                                                )
                                                :
                                                `${mssg.repliedFor.message}`
                                            }
                                    </Text>
                                </View>
                                {
                                    mssg?.repliedFor.ImageStatus &&
                                    <Image style={{width:45,height:45,borderRadius:8}} source={{uri:mssg?.repliedFor.image.location}} />
                                }
                                {
                                    mssg?.repliedFor.AudioStatus &&
                                        <View style={{width:45,height:45,borderRadius:8,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                            <MaterialIcons name="multitrack-audio" size={30} color={mssg?.from.userNumber===userNumber?COLORS.primary:'black'} />
                                        </View>
                                }
                                {
                                    mssg?.repliedFor.DocumentStatus &&
                                        <View style={{width:45,height:45,borderRadius:8,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                            <Ionicons style={[styles.optionSub]} name="document-text" size={30} color={mssg?.from.userNumber===userNumber?COLORS.primary:'black'} />
                                        </View>
                                }
                            </View>
                        }
                        {
                            (mssg?.from?.userNumber!==userNumber && mssg?.message!==" " && changedMssg!==null) &&
                            <View style={[styles.mssgTextDiv,mssg.forwardStatus?{paddingTop:0}:{paddingTop:5}]}>
                                <Text style={[{fontSize:15,},mssg?.from?.userNumber===userNumber?{color:'white'}:{color:'black'}]}>{changedMssg}</Text>
                            </View>
                        }
                        {
                          !TimerMessagesEditView && (mssg?.from?.userNumber===userNumber && mssg.message!==" ") &&
                            <View style={[styles.mssgTextDiv,mssg.forwardStatus?{paddingTop:0}:{paddingTop:5}]}>
                                <Text numberOfLines={TimerMessagesView?2:0} style={[{fontSize:15,},mssg?.from?.userNumber===userNumber?{color:'black'}:{color:'black'}]}>{mssg.message}</Text>
                            </View>
                        }  
                            <View style={{flexDirection:'row',justifyContent:'flex-end',position:'absolute',bottom:2,right:8}}>
                                {
                                (!TimerMessagesEditView && !TimerMessagesView)?
                                <Text style={[{color:'gray',fontSize:8},mssg?.user===user?{marginRight:10}:{marginLeft:10,}]}>{mssg?.time}</Text>
                                :
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={[{color:'gray',fontSize:8,}]}>{mssg?.timeObject.day}-</Text>
                                    <Text style={[{color:'gray',fontSize:8,}]}>{mssg?.timeObject.month}-</Text>
                                    <Text style={[{color:'gray',fontSize:8,marginRight:5}]}>{mssg?.timeObject.year}</Text>
                                    <Text style={[{color:'gray',fontSize:8,marginRight:10}]}>{mssg?.time}</Text>
                                </View> 
                                }
                            </View>
                        
                    </View>
                    <View style={{flexDirection:'row-reverse',alignItems:'center'}}>
                    {/* {
                        !TimerMessagesEditView && !TimerMessagesView &&
                        <Text style={[{color:'gray',fontSize:11},mssg?.user===user?{marginRight:10}:{marginLeft:10}]}>{mssg?.time}</Text>
                    } */}
                    {/* {
                        TimerMessagesView &&
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={[{color:'gray',fontSize:11,}]}>{mssg?.timeObject.day}-</Text>
                            <Text style={[{color:'gray',fontSize:11,}]}>{mssg?.timeObject.month}-</Text>
                            <Text style={[{color:'gray',fontSize:11,marginRight:5}]}>{mssg?.timeObject.year}</Text>
                            <Text style={[{color:'gray',fontSize:11,marginRight:10}]}>{mssg?.time}</Text>
                        </View>
                    } */}
                    {
                        mssgArray?.length-seenLength===index && userNumber===mssg?.from.userNumber &&
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'gray',marginRight:5}}>Seen</Text>
                            <AntDesign name="eye" size={20} color="gray" />
                        </View>

                    }
                    </View>
                </View>
            </TouchableWithoutFeedback>
            }
        </GestureRecognizer>
    );
}

export default MssgDiv;

const styles = StyleSheet.create({
    imageNotAvailable:{
        width:200,
        height:200,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8,
        margin:5
    },
    image:{
        width:200,
        height:200,
        margin:5,
        // marginBottom:0,
        borderRadius:8,
        backgroundColor:'black'
    },
    forwardView:{
        flexDirection:'row',
        paddingLeft:10,
        paddingTop:5,
        alignItems:'center',
        // position:'absolute',
        // top:1,
        // left:1
    },
    forwardText:{
        marginRight:5,
        fontSize:12,
        // fontWeight:'bold'
    },
    mssgTextDiv:{
        width:'100%',
        // height:'100%',
        // backgroundColor:'green',
        paddingLeft:10,
        paddingRight:20,
        // alignSelf:'flex-end',
        // paddingTop:5,
        paddingBottom:5,
        margin:0
    },
    replyMssgDiv:{
        margin:5,
        marginBottom:0,
        padding:10,
        paddingTop:5,
        paddingBottom:5,
        // minWidth:130,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // minWidth:'100%',
        // minWidth:'100%',
        // maxWidth:'100%'
        width:250
    },
    sendmessage:{
        width:'100%',
        alignItems:'flex-end',
        paddingBottom:5,
        paddingTop:5,
        paddingLeft:20,
        paddingRight:20,
    },
    recievedmssg:{
        width:'100%',
        alignItems:'flex-start',
        paddingBottom:5,
        paddingTop:5,
        paddingLeft:20,
        paddingRight:20,
    },
    newMssgDiv:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:20,

    },
    newMssgText:{
        paddingLeft:5,
        paddingRight:5,
        color:COLORS.primary
    },
    Message:{
        minHeight:40,
        // borderRadius:30,
        alignItems:'flex-start',
        justifyContent:'center',
        minWidth:130,
        // width:30,
        maxWidth:'85%',
        flexWrap:'wrap',
        paddingBottom:9
       
        // borderColor:'black',
        
        // flexDirection:'column'
        // paddingLeft:20,
        // paddingRight:20,
        // // alignSelf:'flex-end',
        // paddingTop:10,
        // paddingBottom:10,
    },
})