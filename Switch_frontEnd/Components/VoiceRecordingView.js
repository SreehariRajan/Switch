import React,{useState,useEffect,useContext} from 'react';
import {handleAudioRecordingStatus,handleTypingStatus} from '../services/handleStatus';
import handleSubmitAudio from '../services/handleSubmitAudio';
import { BASE_URL } from '../constants/urls';
import { StyleSheet,View,Text,TouchableOpacity,TextInput,Keyboard,StatusBar, Alert } from 'react-native';
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
import {  useRoute } from '@react-navigation/native';
import {Context} from '../Context';
import { MaterialIcons } from '@expo/vector-icons';



function VoiceRecordingView() {
    const route = useRoute();
    const navigation = useNavigation();
    const {token,timeObject} = route.params;
    const {userDetails,latestMssgDetails,audioDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [recording,setRecording] = useState();
    const [showText,setShowText] = useState(true);
    const [recordingTime,setRecordingTime]=useState(0);
    const [mssgShow,setMssgShow] = useState(false);
    const [audio,setAudio]=useState(null);
    const [soundObj,setSoundObj]=useState(null);
    const [currentAudio,setCurrentAudio]=useState({});
    const [playing,setPlaying] = useState(false);
    const [audioIndex,setAudioIndex,playingAudio,setPlayingAudio]=audioDetails;
    const [audioUri,setAudioUri] = useState(null);
    const [demoAudioTime,setDemoAudioTime]=useState(0);

    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });

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

    async function startRecording(){
        // handleAudioRecordingStatus('start',userNumber,contacts);
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

    async function stopRecording(){
        // handleAudioRecordingStatus('end',userNumber,tonumber);
        await recording.stopAndUnloadAsync();
        const status =await recording.getStatusAsync();
        console.log(status.durationMillis,"duartion")

        if (status.durationMillis >1000){
            const uri = await recording.getURI();
            setAudioUri(uri);
            setDemoAudioTime(recordingTime)
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

            setMssgShow(true);
            // uri,name,setMssgArray,setMssgArrayPart,setNewMssgLength
            
            // handleSubmitAudio(fileObject,setMssgArray,setMssgArrayPart,setNewMssgLength,user,userNumber,tonumber,duration);
        }
        else{
            console.log("sryyyyyyy")
            setRecording(undefined);
        }
    }
    async function handleCancelRecording(){
        await recording?.stopAndUnloadAsync();
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
  
      async function submit (){
        const fileNameObject = await audioUri.split('/');
        const fileName = await fileNameObject[fileNameObject.length-1];
        const fileObject =await  {
            uri:audioUri,
            name:fileName,
            type:"audio/mp3",

        };
        const mssgObj = await {fileObject:fileObject,userNumber:userNumber,user:user,duration:demoAudioTime,time:timeObject.time,timeObject:timeObject.timeObject}
        navigation.navigate("ForwardMssgView",
                        {setMssgArrayPart:null,
                            toNumberFrom:null,
                            TimerMessageDraft:true,
                            mssgObj:mssgObj,
                            recorded:true
                        })
      }
      async function handleAudioPlay(){
                  if (audio===null){
                      const playbackObj=await new Audio.Sound();
                      const status= await playbackObj.loadAsync({uri:audioUri,didJustFinish:true},{shouldPlay:true,isLooping:false});
                      playbackObj.setOnPlaybackStatusUpdate((e)=>_onPlaybackStatusUpdate(e));
                      setPlaying(true)
                      setPlayingAudio(true);
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
    return (
        
        <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={{position:'absolute',top:0,width:'100%',flexDirection:'column',alignItems:'center'}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>{handleCancelRecording();navigation.goBack()}}>
                        <Ionicons style={{marginRight:20}} name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{fontSize:18,color:'white'}}>Record</Text>
                </View>

            {
               mssgShow &&
                (
                <View style={{padding:20,width:300}}>
                <LinearGradient 
                    colors={[COLORS.mssgColor,COLORS.mssgColor]}
                    start={{x:0,y:0}}
                    end={{x:1,y:0}}
                    style={[{
                        borderBottomRightRadius:15,
                        borderTopLeftRadius:8,
                        borderBottomLeftRadius:8,
                        },
                        {borderTopRightRadius:8,borderBottomRightRadius:8}
                        ]}>
                    <View style={{width:260,flexDirection:'row',alignItems:'center',padding:5}}>
                        <TouchableOpacity onPress={()=>{
                            handleAudioPlay();
                        }
                            } style={{height:50,width:50,alignItems:'center',flexDirection:'row',backgroundColor:'#ffffffd6',borderRadius:8,justifyContent:'center',marginRight:5}}>
                        {!playing ?
                            <Entypo name="controller-play" size={38} color={COLORS.primary} />
                            :
                            <AntDesign name="pause" size={38} color={COLORS.primary} />
                        }
                        </TouchableOpacity>
                        <View style={{flexDirection:'column',alignItems:'flex-start',height:'100%'}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:200}}>
                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                    <Entypo style={{marginRight:2}} name="controller-record" size={6} color={"#ffffffd6"} /> 
                                    <Text style={[{fontSize:10,color:'white'}]}>
                                        rec
                                    </Text>
                                </View>
                                <Text style={[{fontSize:10,paddingRight:6,fontSize:10,color:'white'}]}>
                                    {
                                        demoAudioTime<=60?
                                            (String(demoAudioTime).length<2?
                                            `00:0${demoAudioTime}`
                                            :
                                            `00:${demoAudioTime}`)
                                        :
                                        String(Math.floor(demoAudioTime/60)).length<2?
                                            String(demoAudioTime%60).length<2?
                                                `0${Math.floor(demoAudioTime/60)}:0${demoAudioTime%60}`
                                            :
                                                `0${Math.floor(demoAudioTime/60)}:${demoAudioTime%60}`
                                        :
                                            String(demoAudioTime%60).length<2?
                                                `0${Math.floor(demoAudioTime/60)}:0${demoAudioTime%60}`
                                            :
                                                `${Math.floor(demoAudioTime/60)}:${recordingTime%60}`
                                    }
                                </Text>
                            </View>
                            
                            {/* <Text numberOfLines={1} style={[{width:190},mssg?.from?.userNumber===userNumber?{color:'white'}:{color:'black'}]}>{mssg.audio.name?mssg.audio.name:"audio"}</Text> */}
                        </View>
                    </View>
                 </LinearGradient>
                 <TouchableOpacity 
                 onPress={()=>{
                    // audio.unloadAsync();
                    setPlayingAudio(false)
                    setAudioIndex(undefined);
                    setMssgShow(false);
                    setPlaying(false);
                    setSoundObj(null)
                    setAudio(null);
                    setMssgShow(false);
                    setPlaying(false);
                }} 
            style={{position:'absolute',right:10,top:10}}>
                    <MaterialIcons name="cancel" size={24} color={COLORS.primary} />
                 </TouchableOpacity>
                 </View> 
                
                )
            }
             </View>  
            <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%'}}>
            {recording &&
                <Text style={{color:'red',marginBottom:20,fontSize:20}}>
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
            }
            <TouchableOpacity
                onPress={recording?stopRecording:startRecording}
                style={{elevation:10}}
                >
                <LinearGradient
                    style={styles.send}
                    colors={[COLORS.primary,COLORS.secondary]}
                    // colors={[COLORS.primary,'#2266e3']}
                    // colors={['#2e70e2','#522ee2']}
                    >
                    {showText && <FontAwesome name="microphone" size={35} color={recording?'red':'white'} />}
                </LinearGradient>              
            </TouchableOpacity>
            {recording &&
                <View style={{flexDirection:'column',alignItems:'center',justifyContent:'flex-start',width:'100%',marginTop:10}}>
                        <View style={{flexDirection:'row-reverse',alignItems:'center',}}>
                            <Text style={{color:'red'}}> {showText ?"Rec":""}</Text>
                            {showText &&
                            <Entypo name="controller-record" size={18} color="red" />   
                            }   
                        </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>handleCancelRecording()}><Text style={{color:'black',fontSize:20,marginTop:20}}>cancel</Text></TouchableOpacity>
                    </View>
                </View>
            }
            </View>

            <TouchableOpacity
                onPress={()=>submit()}
                style={{position:'absolute',bottom:20,right:20}}
                disabled={!mssgShow?true:false}
                >
                <LinearGradient
                    style={{width:60,height:60,borderRadius:60,justifyContent:'center',alignItems:'center',}}
                    colors={mssgShow?[COLORS.primary,COLORS.secondary]:['#08080866','#08080866']}
                    // colors={[COLORS.primary,'#2266e3']}
                    // colors={['#2e70e2','#522ee2']}
                    >
                    <AntDesign name="arrowright" size={24} color="white" />
                </LinearGradient>              
            </TouchableOpacity>        
        </View>
    );
}

export default VoiceRecordingView;

const styles = StyleSheet.create({
    send:{
        alignItems:'center',
        justifyContent:'center',
        height:100,
        width:100,
        borderRadius:60,
        elevation:10
        // backgroundColor:COLORS.primary
    },
    header:{
        width:'100%',
        padding:20,
        backgroundColor:COLORS.primary,
        // position:'absolute',
        // top:0,
        flexDirection:'row',
        alignItems:"center",
        marginBottom:20
    },  
})