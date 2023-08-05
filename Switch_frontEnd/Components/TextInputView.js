import React, { useState,useEffect, useContext } from 'react';
import { StyleSheet,View,Text,TouchableOpacity,TextInput,Keyboard, ImageBackground } from 'react-native';
import {COLORS} from '../Colors';
import ReplyPreview from './ReplyPreview';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { handleCamera } from '../services/handleMultimedia';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import io from 'socket.io-client';
import { BASE_URL } from '../constants/urls';
import * as SecureStore from 'expo-secure-store';

// import {
//     useAnimatedStyle,
//      useSharedValue, withSequence, withTiming ,withRepeat
//     }
// from 'react-native-reanimated';


import handleSubmitAudio from '../services/handleSubmitAudio';
import {handleAudioRecordingStatus,handleTypingStatus} from '../services/handleStatus';
import { Context } from '../Context';

function TextInputView({token,attachOptionHeight,attachOptionWidth,contacts,tonumber,name,setMssgArray,setMssgArrayPart,setNewMssgLength,selectedReplyMssg,imageUnavailable,userNumber,setImageUnavailable,setSelectedReplyMssg,textInputRef,setKeyboardOn,clientMssg,setClientMssg,keyboardOn,setAttachSelected,attachSelected,submitMssg,handleScrollToBottom,user,setEmojiKeyboardOn,starredMssg,setStarredMssg}) {
    const {latestMssgDetails} = useContext(Context);
    const navigation = useNavigation();
    const [recording,setRecording] = useState();
    const [showText,setShowText] = useState(true);
    const [recordingTime,setRecordingTime]=useState(0);
    const [latestMssg,setLatestMssg] = latestMssgDetails;

    
    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });
    console.log("text input tttt")

    useEffect(()=>{
        if (recording){
            setTimeout(()=>{
                setRecordingTime(recordingTime+1)
            },1000)
        }
        else{
            setRecordingTime(0);
        }
    }
    ,[recordingTime,recording]);

    const handleCameraClicked = async()=>{  
        const fileObject = await handleCamera();

        if (fileObject){
            navigation.navigate("ImagePreview",
            {   
                token:token,
                name:name,
                tonumber:tonumber,
                setMssgArray:setMssgArray,
                setMssgArrayPart:setMssgArrayPart,
                setNewMssgLength:setNewMssgLength,
                fromChatScreen:false,
                image:null,
                fileObject:fileObject
            });
        }

    };
    async function startRecording(){
        handleAudioRecordingStatus('start',userNumber,contacts);
        try{
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({});
            const recording = new Audio.Recording;
            setRecording(recording);
            
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            
            
            
        }
        catch(err){
            console.log(err)
        }
    };
    useEffect(() => {
        
        if (recordingTime!==0){
            socket.on(`recordingStatusCheck ${userNumber} ${tonumber}`,(details)=>{
                
                if (details.askedUser && details.checkNumber){
                    //sending userStatus
                    
                    socket.emit('recordingStatusChecked',{recording:true,user:details.askedUser,ofUser:userNumber});
                }
            });
        }
        
    }, [recordingTime])

    useEffect(() => {
        const hideListener = Keyboard.addListener('keyboardDidHide',()=>{
            setKeyboardOn(false);
            handleTypingStatus('end',userNumber,tonumber);
        });
        const showListener = Keyboard.addListener('keyboardDidShow',()=>{
            setEmojiKeyboardOn(false);
            setKeyboardOn(true);
            console.log("key on")
            console.log(socket.connected)
            socket.on(`typingStatusCheck ${userNumber} ${tonumber}`,(details)=>{
                
                if (details.askedUser && details.checkNumber){
                    //sending userStatus
                    
                    socket.emit('typingStatusChecked',{typing:true,user:details.askedUser,ofUser:userNumber});
                }
            });
            console.log("ttttttttttttttttttttttttttttttttttttttttttttttttoooooooooooooooooooooo",tonumber)
            handleTypingStatus('start',userNumber,tonumber);
        });
        return ()=>{
            Keyboard.removeAllListeners;
        };
    },[]);

    async function stopRecording(){
        handleAudioRecordingStatus('end',userNumber,tonumber);
        await recording.stopAndUnloadAsync();
        const status =await recording.getStatusAsync();
        console.log(status.durationMillis,"duartion")

        if (status.durationMillis >1000){
            const uri = await recording.getURI();

            // await recording.stopAndUnloadAsync();
            // const uri = await recording.getUri();
            console.log("uriiii",uri);
            const duration = await recordingTime;
            setRecording(undefined);
            const fileNameObject = await uri.split('/');
            const fileName = await fileNameObject[fileNameObject.length-1];
            const fileObject =await  {
                uri:uri,
                name:fileName,
                type:"audio/mp3",

            };
            // uri,name,setMssgArray,setMssgArrayPart,setNewMssgLength
            handleSubmitAudio(fileObject,setMssgArray,setMssgArrayPart,setLatestMssg,setNewMssgLength,user,userNumber,tonumber,duration);
        }
        else{
            console.log("sryyyyyyy")
            setRecording(undefined);
        }
    }
    async function handleCancelRecording(){
        handleAudioRecordingStatus('end',userNumber,tonumber);
        await recording.stopAndUnloadAsync();
        setRecording(undefined);
        setRecordingTime(0);
    };

    useEffect(() => {
        if (recording){
            setTimeout(() => {
                setShowText(!showText)
            },700)
        }
        else{
            setShowText(true)
        }
    }, [showText,recording])

    return (
        <ImageBackground source={require('../assets/images/textInputBg.png')} style={[styles.inputDiv,recording && {backgroundColor:'white',bottom:0,paddingBottom:15,paddingTop:5}]}>
            {
                    (selectedReplyMssg && !recording) &&
                        <TouchableOpacity
                            onPress={handleScrollToBottom}
                            style={styles.scrollToEnd}>
                            <FontAwesome name="angle-double-down" size={22} color='gray' />
                        </TouchableOpacity>
                }
            <View style={[styles.inputDivSub,{width:'80%'},selectedReplyMssg?{backgroundColor:'white'}:{backgroundColor:'transparent'},recording && {flexDirection:'row',alignItems:'center',height:47,width:'75%',maxWidth:'75%'}]}>
            {/* <View style={[styles.inputDivSub,keyboardOn?{width:'80%',}:{width:'92%'},selectedReplyMssg?{backgroundColor:'white'}:{backgroundColor:'transparent'}]}> */}
                {
                    (selectedReplyMssg && !recording) &&
                        <ReplyPreview name={name} selectedReplyMssg={selectedReplyMssg} imageUnavailable={imageUnavailable} userNumber={userNumber} setImageUnavailable={setImageUnavailable} setSelectedReplyMssg={setSelectedReplyMssg} />
                }
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',borderRadius:10,paddingLeft:7,paddingRight:7}}>
                    

                    {!recording && 
                        <TouchableOpacity
                            style={{zIndex:3}}
                            onPress={handleCameraClicked}
                            >
                            <Entypo name="camera" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    }
                    {!recording && 
                        <TextInput 
                            ref={textInputRef}
                            onFocus={()=>setKeyboardOn(true)}
                            onBlur={()=>setKeyboardOn(false)}
                            style={[styles.textInput]}
                            value={clientMssg}
                            multiline={true}
                            placeholder="Type"
                            // onKeyPress={handleTypingStatus('start')}
                            // onEn
                            // onTouchEnd={handleTypingStatus('end')}
                            // onEndEditing={handleTypingStatus('end')}
                            onChangeText={(mssg)=>{
                                // handleTypingStatus('start');
                                setClientMssg(mssg);
                                }
                            }
                            onSubmitEditing={()=>submitMssg()}
                        />
                    }
                    {!recording &&
                        <TouchableOpacity
                            style={{zIndex:3,marginRight:15}}
                            onPress={()=>{setStarredMssg(!starredMssg)}}
                            >
                            {
                                starredMssg?
                                <MaterialCommunityIcons name="message-alert" size={24} color={COLORS.primary} />
                                :
                                <MaterialCommunityIcons name="message-alert-outline" size={24} color={COLORS.primary} />
                            }
                            
                        </TouchableOpacity>
                    }
                    {!recording &&
                        <TouchableOpacity
                            style={{zIndex:3}}
                            onPress={()=>{
                                setAttachSelected(!attachSelected);
                                // if (!attachSelected){
                                // attachOptionWidth.value = withTiming('100%',{duration:2000})
                                // attachOptionHeight.value = withTiming(100,{duration:2000})
                                // }
                                // else{
                                //     attachOptionWidth.value = withTiming(0,{duration:2000})
                                //     attachOptionHeight.value = withTiming(0,{duration:2000}) 
                                // }
                            }}
                            >
                            <Entypo name="attachment" size={22} color={COLORS.primary} />
                        </TouchableOpacity>
                    }
                </View>
                {recording &&
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',width:'100%'}}>
                            {showText &&
                                <View style={{width:'80%',flexDirection:'row-reverse',alignItems:'center',position:'absolute',right:10}}>
                                    <FontAwesome name="microphone" size={20} color={recording?'red':'white'} />
                                    <Text style={{color:'red',marginRight:9,marginLeft:3}}>Rec</Text>
                                    <Entypo name="controller-record" size={13} color="red" />   
                                </View>
                            }
                            <View style={{position:'absolute',left:10,flexDirection:'row',alignItems:'center'}}>
                                <TouchableOpacity onPress={()=>handleCancelRecording()}><Text style={{color:'black',fontSize:14}}>cancel</Text></TouchableOpacity>
                                <Text style={{color:'red',marginLeft:20}}>
                                    {
                                        recordingTime<=60?
                                            (String(recordingTime).length<2?
                                            `00:0${recordingTime}`
                                            :
                                            `00:${recordingTime}`)
                                        :
                                        String(Math.floor(recordingTime/60)).length<2?
                                            String(recordingTime%60).length<2?
                                                `0${Math.floor(recordingTime/60)}:0${recordingTime%60}`
                                            :
                                                `0${Math.floor(recordingTime/60)}:${recordingTime%60}`
                                        :
                                            String(recordingTime%60).length<2?
                                                `0${Math.floor(recordingTime/60)}:0${recordingTime%60}`
                                            :
                                                `${Math.floor(recordingTime/60)}:${recordingTime%60}`
                                    }
                                </Text>
                            </View>
                        </View>
                }
            </View>
            {/* ['#2e70e2','#522ee2'] */}
            {clientMssg!=="" ?
                <TouchableOpacity 
                    // style={styles.send}
                    onPress={()=>submitMssg()}
                >   
                    <LinearGradient
                        style={styles.send}
                        colors={[COLORS.primary,COLORS.secondary]}
                        // colors={[COLORS.primary,'#2266e3']}
                        // colors={['#2e70e2','#522ee2']}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            :
                <TouchableOpacity
                    onPress={recording?stopRecording:startRecording}
                    >
                        <LinearGradient
                            style={styles.send}
                            colors={[COLORS.primary,COLORS.secondary]}
                            // colors={[COLORS.primary,'#2266e3']}
                            // colors={['#2e70e2','#522ee2']}
                            >
                            {
                                recording?
                                <Ionicons name="send" size={20} color="white" />
                                :
                                <FontAwesome name="microphone" size={20} color={recording?'red':'white'} />
                            }
                        </LinearGradient>              
                </TouchableOpacity>
            }
        </ImageBackground>
    );
}

export default TextInputView;

const styles = StyleSheet.create({
    scrollToEnd:{
        zIndex:5,
        position:'absolute',
        bottom:70,
        right:20,
        backgroundColor:'white',
        elevation:3,
        width:33,
        height:33,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
    },
    inputDiv:{
        zIndex:1,
        elevation:10,
        backgroundColor:COLORS.thertiarySub,
        position:'absolute',
        bottom:0,
        paddingBottom:15,
        paddingTop:5,
        width:'100%',
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'flex-end',
        justifyContent:'space-between',
        minHeight:45,
        // backgroundColor:'red',
    },
    inputDivSub:{
        flexDirection:'column',
        width:'100%',
        borderBottomLeftRadius:30,
        borderBottomEndRadius:30,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        marginLeft:15,
        // elevation:10,
    },
    textInput:{
        minHeight:47,
        maxHeight:55,
        borderColor:null,
        borderRadius:30,
        paddingLeft:10,
        paddingRight:10,
        fontSize:17,
        backgroundColor:'white',
        lineHeight:22,
        width:'70%'
    },
    send:{
        alignItems:'center',
        justifyContent:'center',
        height:47,
        width:47,
        borderRadius:60,
        right:15,
        // backgroundColor:COLORS.primary
    },  
});