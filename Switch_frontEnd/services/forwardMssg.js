import React,{useContext} from 'react';
import {Context} from '../Context';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';
import { BASE_URL } from '../constants/urls';
// 

const forwardMssg=async(selectedForwardMssg,selectedContacts,setMssgArrayPart,setLatestMssg,toNumberFrom,setSelectedForwardMssg,timmerForward,TimmerDate,setErr)=> {

    // const socket = io.connect(`${BASE_URL}/messageSocket/connect`); 
    let userNumber = await SecureStore.getItemAsync('phoneNumber');
    let userName = await SecureStore.getItemAsync('userName');
    const token = await SecureStore.getItemAsync("token");

    const socket =await io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });
    
    const Time = timmerForward?TimmerDate:new Date();
    const year = Number(Time.getFullYear());
    const month = Number(Time.getMonth()+1);
    const day = Number(Time.getDate());
    const hours = Number(Time.getHours());
    const minutes = Number(Time.getMinutes());
    const seconds = Number(Time.getSeconds());
    for (const mssg of selectedForwardMssg){
        for (const tonumber of selectedContacts){
            console.log(tonumber,"useeeeeeeeeeeeeeeeeeeeeeeeeee");
            // audio:{value:null},document:{value:null},image:{value:null},replyStatus:selectedReplyMssg!==null?true:false,forwardStatus:false,repliedFor:selectedReplyMssg!==null?selectedReplyMssg:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};


            const mssgObj = await {starredMessage:false,message:mssg.ImageStatus?" ":mssg.message,ImageStatus:mssg.ImageStatus,DocumentStatus:mssg.DocumentStatus,AudioStatus:mssg.AudioStatus,audio:mssg.audio,document:mssg.document,image:mssg.image,replyStatus:false,forwardStatus:true,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:userName,userNumber:userNumber},to:{userNumber:tonumber}};
            socket.on('connect_error', ()=> {
                setErr(true);
             });
            socket.emit(`Send Message`,mssgObj,
            status=>{
                if (status===200){
                    if (! timmerForward)
                        setLatestMssg(mssgObj);

                    if (tonumber === toNumberFrom){
                        console.log("this is to number usernumber");
                        if (! timmerForward)
                            setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart])
                    };
                    const mssgArrayString =await  AsyncStorage.getItem(tonumber+'messages');
                    var mssgArray =await JSON.parse(mssgArrayString);
                    mssgArray.push(mssgObj);
                    AsyncStorage.setItem(tonumber+'messages',JSON.stringify(mssgArray));
                }
                else{
                    setErr(true);
                }
            });
            
        }
    }
    setSelectedForwardMssg([]);




}

export default forwardMssg;