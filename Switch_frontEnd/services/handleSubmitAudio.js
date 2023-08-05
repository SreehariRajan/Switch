import io from 'socket.io-client';
import {BASE_URL} from '../constants/urls';
import uploadTos3 from '../services/uploadTos3';
import * as SecureStore from 'expo-secure-store';


async function handleSubmitAudio(fileObject,setMssgArray,setMssgArrayPart,setLatestMssg,setNewMssgLength,user,userNumber,tonumber,duration) {
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

    const Time = new Date();
        const year = Number(Time.getFullYear());
        const month = Number(Time.getMonth()+1);
        const day = Number(Time.getDate());
        const hours = Number(Time.getHours());
        const minutes = Number(Time.getMinutes());
        const seconds = Number(Time.getSeconds());

    const uploadedLocation = await uploadTos3(fileObject,"audios/recorded");
    const mssgObj =await {message:" ",ImageStatus:false,DocumentStatus:false,AudioStatus:true,audio:{location:uploadedLocation,name:fileObject.name,recording:true,duration:duration},document:{value:null},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
        socket.emit(`Send Message`,mssgObj);
        setLatestMssg(mssgObj);
        setMssgArray(mssgArray=>[...mssgArray,mssgObj]);
        setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);
        setNewMssgLength(length=>length+1);
}

export default handleSubmitAudio;