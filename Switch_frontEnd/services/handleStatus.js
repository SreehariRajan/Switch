import io from 'socket.io-client';
import { BASE_URL } from '../constants/urls';
import * as SecureStore from 'expo-secure-store';


//recording
export const handleAudioRecordingStatus = (str,userNumber,tonumber)=>{
    // const socket = io.connect(`${BASE_URL}/messageSocket/connect`);
    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:SecureStore.getItemAsync("token")
        },
        query:{
            userNumber:userNumber
        }
    });
    if (str==='start'){
        socket.emit('recordingStatus',{recording:true,user:userNumber,tonumber:tonumber});
    }
    else if (str === 'end'){
        socket.emit('recordingStatus',{recording:false,user:userNumber,tonumber:tonumber});
    }
        
 
};


//typing
export const handleTypingStatus = async(str,userNumber,tonumber)=>{
    // const socket = io.connect(`${BASE_URL}/messageSocket/connect`);
    const token = await SecureStore.getItemAsync("token");
    const socket =await io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });
    if (str==='start'){
        socket.emit('typingStatus',{typing:true,user:userNumber,tonumber:tonumber});
    }
    else if (str === 'end'){
        socket.emit('typingStatus',{typing:false,user:userNumber,tonumber:tonumber});
    }
        
 
};