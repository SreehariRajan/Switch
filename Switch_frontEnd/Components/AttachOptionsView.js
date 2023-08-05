import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState,useContext, useEffect } from 'react';
import { View,StyleSheet,Text,TouchableOpacity, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../Colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { BASE_URL } from '../constants/urls';
import { Context } from '../Context';
import { FontAwesome } from '@expo/vector-icons';
import uploadTos3 from '../services/uploadTos3';
import { handleDocuments, handleImages,handleAudios, handleCamera } from '../services/handleMultimedia';


function AttachOptionsView({token,dateFull,date,name,tonumber,setMssgArrayPart,setMssgArray,setNewMssgLength,setEmojiKeyboardOn,TimerMessageDraft,setErr}) {
    const {userDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;

    // const route=useRoute();
    // const {name,tonumber}=route.params;
    const navigation = useNavigation();
    const {selectedImageDetails} = useContext(Context);
    const [selectedImage,setSelectedImage] = selectedImageDetails;
    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });

    async function handleSelection(action){
        

        if (TimerMessageDraft){
            const PresentDate=new Date();
            console.log(dateFull,PresentDate);
            if (dateFull>PresentDate){
            switch(action.type){
                case "Images":
                    const fileObject= await handleImages();
                    if (fileObject){
                        navigation.navigate("ImagePreview",
                        {   
                            token:token,
                            time:date,
                            name:null,
                            tonumber:null,
                            setMssgArray:null,
                            setMssgArrayPart:null,
                            setNewMssgLength:null,
                            fromChatScreen:false,
                            TimerMessageDraft:true,
                            image:null,
                            fileObject:fileObject
                        });
                    }

                    break;
                case "Text":
                    navigation.navigate("TextMssgDraft",
                    {   
                        token:token,
                        date:date,
                    });

                    break;
                case "Camera":
                    const fileObjectCam = await handleCamera();

                    if (fileObjectCam){
                        navigation.navigate("ImagePreview",
                        {   
                            token:token,
                            time:date,
                            name:null,
                            tonumber:null,
                            setMssgArray:null,
                            setMssgArrayPart:null,
                            setNewMssgLength:null,
                            fromChatScreen:false,
                            TimerMessageDraft:true,
                            image:null,
                            fileObject:fileObjectCam
                        });
                    }
                    break;
                case "Recording":
                    const timeObject = await {time:`${date.hours>12?`${date.hours-12}`:`${date.hours}`}.${date.minutes.toString().length<2?`0${date.minutes}`:date.minutes} ${date.hours>=12?"pm":"am"}`,timeObject:date};
                        navigation.navigate("VoiceRecording",
                        {   
                            token:token,
                            timeObject:timeObject
                        });
                    break;


                case 'Audios':
                    const fileObjectAud = await handleAudios();
                    if (fileObjectAud){
                        const uploadedLocation = await uploadTos3(fileObjectAud,"audios");
                        const mssgObj =await {message:" ",starredMessage:false,ImageStatus:false,DocumentStatus:false,AudioStatus:true,audio:{location:uploadedLocation,name:fileObjectAud.name,recording:false},document:{value:null},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${date.hours>12?`${date.hours-12}`:`${date.hours}`}.${date.minutes.toString().length<2?`0${date.minutes}`:date.minutes} ${date.hours>=12?"pm":"am"}`,timeObject:date,from:{user:user,userNumber:userNumber}};
                        navigation.navigate("ForwardMssgView",
                        {setMssgArrayPart:null,
                            toNumberFrom:null,
                            TimerMessageDraft:true,
                            mssgObj:mssgObj
                        })
                    }

                    break
                case 'Emoji':
                    setEmojiKeyboardOn(on=>!on)
                    break;
                case 'Doc':
                    const fileObjectDoc = await handleDocuments();
                    if (fileObjectDoc){
                        const uploadedLocation = await uploadTos3(fileObjectDoc,"documents");
                        const mssgObj =await {message:" ",starredMessage:false,ImageStatus:false,DocumentStatus:true,AudioStatus:false,audio:{value:null},document:{location:uploadedLocation,name:fileObjectDoc.name},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${date.hours>12?`${date.hours-12}`:`${date.hours}`}.${date.minutes.toString().length<2?`0${date.minutes}`:date.minutes} ${date.hours>=12?"pm":"am"}`,timeObject:date,from:{user:user,userNumber:userNumber}};
                        navigation.navigate("ForwardMssgView",
                        {setMssgArrayPart:null,
                            toNumberFrom:null,
                            TimerMessageDraft:true,
                            mssgObj:mssgObj
                        })
                    }

                    break;

            }
            }
            else{
                return Alert.alert("Enter a valid time and date");
            }
        }
        else{
        // console.log(FileSystem);
            const Time = new Date();
            const year = Number(Time.getFullYear());
            const month = Number(Time.getMonth()+1);
            const day = Number(Time.getDate());
            const hours = Number(Time.getHours());
            const minutes = Number(Time.getMinutes());
            const seconds = Number(Time.getSeconds());
            switch(action.type){

                case "Images":
                    const fileObject = await handleImages();

                    navigation.navigate("ImagePreview",
                    {   
                        token:token,
                        time:null,
                        name:name,
                        tonumber:tonumber,
                        setMssgArray:setMssgArray,
                        setMssgArrayPart:setMssgArrayPart,
                        setNewMssgLength:setNewMssgLength,
                        fromChatScreen:false,
                        TimerMessageDraft:false,
                        image:null,
                        fileObject:fileObject,
                    });
                    break;
                case 'Audios':
                    const fileObjectAud = await handleAudios();
                    if (fileObjectAud){
                        const uploadedLocation = await uploadTos3(fileObjectAud,"audios");
                        const mssgObj =await {message:" ",ImageStatus:false,starredMessage:false,DocumentStatus:false,AudioStatus:true,audio:{location:uploadedLocation,name:fileObjectAud.name,recording:false},document:{value:null},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
                        socket.on('connect_error', ()=> {
                            setErr(true);
                         });
                        socket.emit(`Send Message`,mssgObj,
                        status=>{
                            if (status===200){
                                setLatestMssg(mssgObj);
                                setMssgArray(mssgArray=>[...mssgArray,mssgObj]);
                                setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);
                                setNewMssgLength(length=>length+1);
                            }
                            else{
                                setErr(true);
                            }
                        }
                        );
                        
                    }
                    break
                case 'Emoji':
                    setEmojiKeyboardOn(on=>!on)
                    break;
                case 'Doc':
                    const fileObjectDoc = await handleDocuments();
                    if (fileObjectDoc){
                        const uploadedLocation = await uploadTos3(fileObjectDoc,"documents");
                        const mssgObj =await {message:" ",ImageStatus:false,starredMessage:false,DocumentStatus:true,AudioStatus:false,audio:{value:null},document:{location:uploadedLocation,name:fileObjectDoc.name},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
                        socket.on('connect_error', ()=> {
                            setErr(true);
                         });
                        socket.emit(`Send Message`,mssgObj,
                        status=>{
                            if (status===200){
                                setLatestMssg(mssgObj);
                                setMssgArray(mssgArray=>[...mssgArray,mssgObj]);
                                setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);
                                setNewMssgLength(length=>length+1);
                            }
                            else{
                                setErr(true);
                            }
                        }
                        );
                    }
                    break;


            }
        }
        // getCameraPermissions()
    }
    return (
        <View
         style={[styles.container,TimerMessageDraft?{flexDirection:'column'}:{flexDirection:'column'}]}>
            <View style={TimerMessageDraft?{flexDirection:"row",width:'100%',marginBottom:50,justifyContent:"space-evenly"}:{flexDirection:"column",marginBottom:0}}>
                {
                    TimerMessageDraft &&
                    <TouchableOpacity
                        style={[styles.option,{backgroundColor:'#aeecba'}]}
                        onPress={()=>handleSelection({type:"Text"})}
                    >
                        <MaterialCommunityIcons style={[styles.optionSub,{backgroundColor:'#aeecba'}]} name="message-text" size={TimerMessageDraft?30: 25} color="green" />
                    </TouchableOpacity>

                }
                {
                    TimerMessageDraft &&
                    <TouchableOpacity
                        style={[styles.option,{backgroundColor:'#ffdaff'}]}
                        onPress={()=>handleSelection({type:"Camera"})}
                    >
                        <Entypo name="camera" style={[styles.optionSub,{backgroundColor:'#ffdaff'}]} size={30} color={'#ff00ff'} />
                    </TouchableOpacity>

                }
                {
                    TimerMessageDraft &&
                    <TouchableOpacity
                        style={[styles.option,{backgroundColor:'#f0f7ff'}]}
                        onPress={()=>handleSelection({type:"Recording"})}
                    >
                        {/* <Text>recording</Text> */}
                        <FontAwesome name="microphone"style={[styles.optionSub,{backgroundColor:'#f0f7ff'}]} size={30} color={'#49a7ed'} />
                        {/* <Entypo name="camera" style={[styles.optionSub,{backgroundColor:'#ffdaff'}]} size={36} color={'#ff00ff'} /> */}
                    </TouchableOpacity>

                }
            </View>
            <View style={TimerMessageDraft?{flexDirection:"row",width:'100%',justifyContent:"space-evenly"}:{flexDirection:"column"}}>
                <TouchableOpacity
                    style={[styles.option,{backgroundColor:'#e22aad'}]}
                    onPress={()=>handleSelection({type:"Images"})}
                >
                    <MaterialCommunityIcons style={[styles.optionSub,{backgroundColor:'#e22aad'}]} name="folder-multiple-image" size={TimerMessageDraft?30: 25} color="#ffcdee" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option,{backgroundColor:'#006ab5'}]}
                    onPress={()=>handleSelection({type:"Doc"})}
                >
                    <Ionicons style={[styles.optionSub,{backgroundColor:'#006ab5'}]} name="document-text" size={TimerMessageDraft?30: 25} color='#cdd6ff' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option,{backgroundColor:'#8158ea'}]}
                    onPress={()=>handleSelection({type:"Audios"})}
                >
                    <MaterialIcons style={[styles.optionSub,{backgroundColor:'#8158ea'}]} name="audiotrack" size={TimerMessageDraft?30: 25} color='#dbcdff' />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default AttachOptionsView;

const styles=StyleSheet.create({
    optionSub:{
        borderRadius:60,
        // padding:13,
        alignItems:'center',
        // height:60,
        // width:60,
        justifyContent:'center',
        alignItems:'center'
    },
    option:{
        // padding:10,
        
        // paddingLeft:5,
        // paddingRight:5,
        height:60,
        width:60,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'transparent',
        borderRadius:60,
        elevation:5,
        marginBottom:10
    },
    container:{
        // flexDirection:'column',
        alignItems:'center',
        backgroundColor:'transparent',
        zIndex:10
    }
})