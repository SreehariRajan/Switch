import React,{useContext, useState,useEffect} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { View,BackHandler,TextInput,Image,StyleSheet,TouchableOpacity,Text,StatusBar } from 'react-native';
import { Context } from '../Context';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import {BASE_URL} from '../constants/urls';
import {COLORS} from '../Colors';
import uploadTos3 from '../services/uploadTos3';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import AlertView from './AlertView';


function ImagePreview() {
    const [keyboardOn,setKeyboardOn] = useState(false);
    const [clientMssg,setClientMssg] = useState("");
    const {selectedImageDetails,userDetails,latestMssgDetails} = useContext(Context);
    const [selectedImage,setSelectedImage] = selectedImageDetails;
    const [userNumber,setUserNumber,user,setUser] = userDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;

    const [starredMssg,setStarredMssg] = useState(false);

    const [height,setHeight]=useState(0);
    const [width,setWidth]=useState(0);

    const [err,setErr] = useState(false);

    const route=useRoute();
    const navigation= useNavigation();
    const {token,time,TimerMessageDraft,name,tonumber,setMssgArray,setMssgArrayPart,setNewMssgLength,fromChatScreen,image,fileObject} = route.params;

    useEffect(() => {
        const handleCloseMenuScreen = ()=>{
                navigation.goBack();
                return true;  
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleCloseMenuScreen);

        return ()=>backHandler.remove();

    }, []);

    async function submitMssg(){
        setErr(false);
        const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
            auth:{
                token:token
            },
            query:{
                userNumber:userNumber
            }
        });

        const uploadedLocation = await uploadTos3(fileObject,"images");
        // console.log("submitted location",uploadedLocation);

        const Time = new Date();
        const year = Number(Time.getFullYear());
        const month = Number(Time.getMonth()+1);
        const day = Number(Time.getDate());
        const hours = Number(Time.getHours());
        const minutes = Number(Time.getMinutes());
        const seconds = Number(Time.getSeconds());
        console.log("Emit",Time,year,month,day);
        console.log(minutes.toString())
        
            if (uploadedLocation !==undefined){
                if (!TimerMessageDraft){
                    const mssgObj =await {message:clientMssg,starredMessage:starredMssg,ImageStatus:true,DocumentStatus:false,AudioStatus:false,audio:{value:null},document:{value:null},image:{location:uploadedLocation},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
                    // const mssgObj =await {message:clientMssg,ImageStatus:true,image:{imageEncoded:selectedImage.encoded.base64},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds},from:{user:user,userNumber:userNumber},to:{userNumber:tonumber}};
                    socket.on('connect_error', ()=> {
                        setErr(true);
                     });
                    socket.emit(`Send Message`,mssgObj,
                    status=>{
                        if (status===200)
                        {
                            setMssgArray(mssgArray=>[...mssgArray,mssgObj]);
                            setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);
                            setLatestMssg(mssgObj);

                            // setMssgArray(mssgArray=>[...mssgArray,mssgObj]);
                            // setMssgArrayPart(mssgArrayPart=>[mssgObj,...mssgArrayPart]);

                            setNewMssgLength(length=>length+1);
                            setClientMssg("");
                            navigation.goBack();
                        }
                        else{
                            setErr(true);
                        }
                    }
                    );

                // setKeyboardOn(false);
                // Keyboard.dismiss();s
                }
                else{
                    const mssgObj =await {message:clientMssg,starredMessage:starredMssg,ImageStatus:true,DocumentStatus:false,AudioStatus:false,audio:{value:null},document:{value:null},image:{location:uploadedLocation},replyStatus:false,forwardStatus:false,repliedFor:{value:null},from:{user:user,userNumber:userNumber},time:`${time.hours>12?`${time.hours-12}`:`${time.hours}`}.${time.minutes.toString().length<2?`0${time.minutes}`:time.minutes} ${time.hours>=12?"pm":"am"}`,timeObject:time};
                 
                    navigation.navigate("ForwardMssgView",
                        {setMssgArrayPart:null,
                            toNumberFrom:null,
                            TimerMessageDraft:true,
                            mssgObj:mssgObj
                        })
                }
            }
    };

    useEffect(()=>{
        setTimeout(()=>setErr(false),3000);
    },[err])
    // console.log(image.location)
    return (
        
        <View style={[styles.container,fromChatScreen && styles.ImageShow]}>
            {
            err && 
            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"Something went wrong"} subContent={"message not sent"} />
            }
            <StatusBar backgroundColor={`${!fromChatScreen ? COLORS.primary: "black"}`} barStyle="light-content" />
            {fromChatScreen &&
                <View style={{width:'100%',padding:20,backgroundColor:"black",flexDirection:'row',alignItems:"center",marginBottom:0}}>
                    <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{fontSize:18,color:'white',marginLeft:20}}>{name}</Text>
                </View>
                // <View style={{flexDirection:'row',alignItems:'center',padding:5,paddingLeft:20,backgroundColor:'black',width:'100%',marginBottom:20}}>
                //     <TouchableOpacity style={{marginRight:5}} onPress={()=>{navigation.goBack()}}>
                //         <Ionicons name="arrow-back" size={24} color="white" />
                //     </TouchableOpacity>
                //     <Text style={{fontSize:17,color:'white',paddingLeft:10}}>{name}</Text>
                // </View>
                }
            {!fromChatScreen &&
                <View style={{width:'100%',flexDirection:'row',alignItems:'center',height:50,backgroundColor:COLORS.primary,paddingLeft:10,marginBottom:20,justifyContent:'flex-start'}}>
                     <TouchableOpacity style={{marginRight:10}} onPress={()=>{navigation.goBack()}}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:17}}>{TimerMessageDraft?"Preview":`Send to ${name}`}</Text>
                </View>
            }
            <View style={{flex:1,width:'100%',backgroundColor:'black',justifyContent:'center',zIndex:1}}>
                    <Image resizeMode="contain" style={{height:'100%',width:'100%'}} source={!fromChatScreen?{uri:fileObject.uri}:{uri:image.location}} />
                </View> 
             {!fromChatScreen &&
                <View style={styles.inputDiv}>

                    <View style={[styles.inputDivSub,{width:'80%',backgroundColor:'white',flexDirection:'row',alignItems:'center'}]}>
                        <TextInput 
                            // ref={textInputRef}
                            onFocus={()=>setKeyboardOn(true)}
                            onBlur={()=>{console.log("popopopppppppppppppppppppppppppppppppp");setKeyboardOn(false)}}
                            style={[styles.textInput]}
                            value={clientMssg}
                            multiline={true}
                            placeholder="Type"
                            onChangeText={(mssg)=>{
                                setClientMssg(mssg);
                                }
                            }
                            onSubmitEditing={()=>submitMssg()}
                        />
                        <TouchableOpacity
                            style={{zIndex:3,marginRight:5}}
                            onPress={()=>{setStarredMssg(!starredMssg)}}
                            >
                            {
                                starredMssg?
                                <MaterialCommunityIcons name="message-alert" size={25} color={COLORS.secondary} />
                                :
                                <MaterialCommunityIcons name="message-alert-outline" size={25} color={COLORS.secondary} />
                            }
                            
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.send}
                        onPress={()=>submitMssg()}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            }
        </View>
        
    );
}

export default ImagePreview;

const styles = StyleSheet.create({
    // picShow:{
    //     resizeMode:'stretch',
    //     minHeight:200
    // },
    ImageShow:{
        justifyContent:'center',
        flex:1,
        width:'100%'
    },  
    inputDivSub:{
        flexDirection:'column',
        width:'100%',
        borderRadius:8,
        marginLeft:15,
        // elevation:10,
    },
    send:{
        alignItems:'center',
        justifyContent:'center',
        height:47,
        width:47,
        borderRadius:60,
        right:15,
        backgroundColor:COLORS.primary
    },
    inputDiv:{
        zIndex:1,
        elevation:10,
        width:'100%',
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'flex-end',
        justifyContent:'space-between',
        minHeight:45,
        marginTop:20,
        marginBottom:10
        // backgroundColor:'red',
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
        width:'90%'
    },
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#f5f3f3',
        alignItems:'center',
        backgroundColor:'black'
        // paddingTop:20
        // backgroundColor:'green',
        // width:'100%'
    },
    image:{
        width:'100%',
        height:300,
        marginTop:20
    },
})