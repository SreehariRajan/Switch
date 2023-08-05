import React,{useState,useContext,useEffect} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { TouchableOpacity,Text,Dimensions,StatusBar,KeyboardAvoidingView, TextInput,StyleSheet,Keyboard, View,Image,BackHandler  } from 'react-native';
import io from 'socket.io-client';

import { handleStatusPicSelection } from '../services/handleMultimedia';
import uploadTos3 from '../services/uploadTos3';
import {Context} from '../Context';
import {BASE_URL} from '../constants/urls';
import { COLORS } from '../Colors';
import AlertView from './AlertView';

import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';

function AddStatus() {
    const navigation = useNavigation();
    const route = useRoute();
    const {token} = route.params;
    const {userDetails,contactsDetails,userStatusDetails,userProfile} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [userStatus,setUserStatus] = userStatusDetails;
    const [contacts,setContacts]=contactsDetails;
    const [profileLocation,setProfileLocation] = userProfile;
    const [imageUri,setImageUri]=useState(null);
    const [content,setContent]=useState("");
    const [keyboardOn,setKeyboardOn] = useState(false);

    const [err,setErr] = useState(false);

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);

    const {height:windowHeight} = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0 ;

    const containerViewHeight = windowHeight;

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
    
    const handleAddStatusImage = async() =>{
        const uri =await handleStatusPicSelection();
        if (uri.message){
            if (uri.message==="cancel"){
                navigation.goBack();
            }
        }
        else{
            setImageUri(uri);
        }
    };
    useEffect(() => {
      handleAddStatusImage();
    }, []);

    useEffect(() => {
        const handleClose = ()=>{
            navigation.goBack();
            
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove()

    }, [])
    useEffect(() => {
        Keyboard.addListener("keyboardDidHide",()=>setKeyboardOn(false))
        Keyboard.addListener("keyboardDidShow",()=>setKeyboardOn(true))
        return ()=>{
            Keyboard.removeAllListeners;
            
        }
     }, [])
    const handleSubmit = async()=>{
        setErr(false);
        const Time = new Date();
        const time = Time.getTime();
        const year = Number(Time.getFullYear());
        const month = Number(Time.getMonth()+1);
        const day = Number(Time.getDate());
        const hours = Number(Time.getHours());
        const minutes = Number(Time.getMinutes());
        const seconds = Number(Time.getSeconds());
        const fileNameObject = await imageUri.split('/');
        const fileName = await fileNameObject[fileNameObject.length-1];
        const fileObject =await  {
            uri:imageUri,
            name:String(fileName),
            type:"image/png",

        };
        const uploadedLocation = await uploadTos3(fileObject,"images/status");
        var statusObject = await {content:content,contacts:contacts,imageLocation:uploadedLocation,phoneNumber:userNumber,userName:user,time:`${hours>12?`${hours-12}`:`${hours}`}.${minutes.toString().length<2?`0${minutes}`:minutes} ${hours>=12?"pm":"am"}`,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds,Time:time}};
        socket.on('connect_error',()=>{
            setErr(true);
         });
        socket.emit(`Send Status`,statusObject,
        socketStatus=>{
            if (socketStatus===200){
                setUserStatus((prev)=>[...prev,statusObject])
                setImageUri(null);
                setContent("");
                navigation.goBack();
            }
            else{
                setErr(true);
            }
        }
        );
        statusObject.seen=[];
        statusObject.seenMySelf=false;
    }

    useEffect(()=>{
        setTimeout(()=>setErr(false),3000);
    },[err]);
    return (
        <View style={[styles.container,{height:containerViewHeight}]}>
            {
            err && 
            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"Something went wrong"} subContent={"status not sent"} />
            }
            <StatusBar backgroundColor='black' barStyle="light-content" />
            <View style={{flexDirection:'column',backgroundColor:'black',alignContent:'center',flex:1}}>
            <View style={{flexDirection:'row',alignItems:'center',padding:5,paddingLeft:5,backgroundColor:'black',marginBottom:20}}>
                <TouchableOpacity style={{marginRight:5}} onPress={()=>{navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                
                <Avatar 
                    icon={{name:'user', type:'font-awesome'}}
                    size='small'
                    rounded
                    activeOpacity={0.7}
                    source={{uri:profileLocation}}
                />
                <Text style={{fontSize:17,color:'white',paddingLeft:10}}>Add story</Text>
            </View>
            <View style={{flex:1,backgroundColor:'black',justifyContent:'center',zIndex:1}}>
                {!pastOnlineStatus && online &&
                    <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
                }
                {!online &&
                    <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
                }    
                <Image resizeMode="contain" style={{height:'100%',width:'100%'}} source={{uri:imageUri}} />
            </View>
            <KeyboardAvoidingView behavior="position" >
                <View style={[styles.inputDiv,keyboardOn?{marginBottom:20,marginTop:0}:{marginBottom:10,marginTop:20,}]}>
                    <View style={[styles.inputDivSub,{width:'80%',backgroundColor:'transparent'}]}>
                        <TextInput 
                            style={[styles.textInput]}
                            value={content}
                            multiline={true}
                            placeholder="Add caption"
                            onChangeText={(mssg)=>{
                                setContent(mssg);
                                }
                            }
                            onSubmitEditing={()=>{if(online)handleSubmit()}}
                        />
                    </View>
                    
                    <TouchableOpacity
                        disabled={!online?true:false} 
                        style={styles.send}
                        onPress={()=>{if (online){handleSubmit()}}}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

export default AddStatus;

const styles=StyleSheet.create({
    container:{
        width:'100%',
        backgroundColor:'black',
    },
    submit:{
        width:'50%',
        padding:10,
        borderRadius:8,
        backgroundColor:COLORS.primary,
        marginTop:5,
        alignItems:'center',
        justifyContent:'center'
    },
    input:{
        width:'50%',
        borderColor:COLORS.primary,
        borderWidth:2,
        borderRadius:8,
        marginTop:5,
        padding:5
    },
    inputDivSub:{
        flexDirection:'column',
        width:'100%',
        borderBottomLeftRadius:30,
        borderBottomEndRadius:30,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        marginLeft:15,
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
        zIndex:10,
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
        lineHeight:22
    },

})