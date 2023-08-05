import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Text,View,TextInput, TouchableOpacity,StyleSheet,StatusBar,Image, Keyboard, ScrollView } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { useContext } from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

import {Context} from '../Context';
import createAccount from '../api/CreateAcc';
import {COLORS} from '../Colors';
import { handleProfilePicSelection } from '../services/handleMultimedia';
import uploadTos3 from '../services/uploadTos3';
import NetInfo from '@react-native-community/netinfo';
import checkUserExist from '../hooks/useUserDetails';
import AlertView from './AlertView';
import LoadingView from './LoadingView';

import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function AddUserDetails() {

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);
    const [loading,setLoading] = useState(false);

    const {userDetails,tokenDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [token,setToken]= tokenDetails;
    const route = useRoute();
    const {phoneNumber} = route.params;
    const navigation = useNavigation();
    const [numberText,setNumberText]=useState("");
    const [userTemp,setUserTemp]=useState("");
    const [imageUri,setImageUri] = useState(null);

    const [err,setErr]=useState("");
    useEffect(()=>{
        setNumberText(phoneNumber);
    },[]);

    useEffect(()=>{
        // check if user exist
        async function check(){
            setLoading(true);
        const response = await checkUserExist(phoneNumber)
            .then(res=>{
                setLoading(false);
                if (res.status===200){
                    if (res?.data){
                        if (res.data.message==="exists"){
                            setImageUri(res.data.details.imageLocation);
                            setUserTemp(res.data.details.userName);
                        }
                        // else if (res.data.message==="does not exists"){

                        // }
                    }
                }
                else{
                    setMssg("Oops, something went wrong")
                }
            })
        }
        check();
    },[]);

    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        if (online){
            setTimeout(()=>setPastOnlineStatus(online),3000);
        }
        return () => {
            
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

    const onSubmit = async() =>{
        console.log("ok doneee");
        setErr("");
        if (numberText.length===0 && userTemp.length===0 && imageUri===null){
            setErr("All fields are mandatory");
        }
        else if (numberText.length===10 && userTemp){
            if (! isNaN(numberText)){
                setLoading(true);
                const fileNameObject = await imageUri.split('/');
                const fileName = await fileNameObject[fileNameObject.length-1];
                const fileObject =await  {
                    uri:imageUri,
                    name:String(fileName),
                    type:"image/png",

                };
                var response;
                var uploadedLocation;
                if (fileNameObject[0].includes("http")){
                    response = await createAccount(numberText,userTemp,imageUri);
                    await SecureStore.setItemAsync('userProfilePic',imageUri);
                }
                else{
                    uploadedLocation = await uploadTos3(fileObject,"images/profile");
                    response = await createAccount(numberText,userTemp,uploadedLocation);
                    await SecureStore.setItemAsync('userProfilePic',uploadedLocation);
                }
                console.log("yes done aws")
                // const response = await createAccount(numberText,userTemp,uploadedLocation);
                setLoading(false);
                console.log(response.data.token)

                if (response?.status===200){
                    if (response?.data.token){
                        await SecureStore.setItemAsync('token',response.data.token);
                        // await SecureStore.setItemAsync('refreshToken',response.data.refreshToken);
                        setUser(userTemp);
                        setUserNumber(numberText);
                        setToken(response.data.token);
                        await SecureStore.setItemAsync('phoneNumber',"+91"+numberText);
                        await SecureStore.setItemAsync('userName',String(userTemp));
                        // await SecureStore.setItemAsync('userProfilePic',uploadedLocation);
                        await SecureStore.setItemAsync('enableAbbreviationShow','true');
                        setUserTemp("");
                        setNumberText("");
                        navigation.navigate("ChatMenu");
                    }
                    else{
                        setMssg("Oops, something went wrong");
                        // setTimeout(()=>navigation.goBack(),5000);
                    }
                }
                else{
                    setMssg("Oops, something went wrong")
                }
            }
            else{
                setErr("Enter a valid number");
            }
        }
    }

    const handleAddProfilePic = async() =>{
        const uri =await handleProfilePicSelection();
        setImageUri(uri);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            {loading &&
                <LoadingView />
            }
            {!pastOnlineStatus && online &&
                <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
            }
            {!online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
            }
            {show && mssg==="Oops, something went wrong" &&
                <AlertView 
                icon={<AntDesign name="exclamationcircle" size={26} color="orange" />} content={mssg} />
            }
            <View style={{width:'100%',flexDirection:'row',alignItems:'flex-start',padding:20}}>
                 <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={COLORS.primary} />
                 </TouchableOpacity>
             </View>
             <Text style={{color:'black',fontSize:24,fontWeight:'bold',marginBottom:20}}>Add details</Text>
            <ScrollView contentContainerStyle={{flexDirection:'column',alignItems:'center',width:'100%',justifyContent:'center',paddingBottom:20}} style={styles.subDiv}>
                <TouchableOpacity onPress={handleAddProfilePic}>
                    <BackgroundImage source={{uri:imageUri}} imageStyle={{borderRadius:100,backgroundColor:'#0000004f'}} style={styles.image}>
                        <View style={{backgroundColor:COLORS.primary,position:'absolute',bottom:'5%',right:4,width:45,borderRadius:50,flexDirection:'row',alignItems:'center',justifyContent:'center',height:45}}>
                            <Entypo  name="camera" size={20} color="white" />
                        </View>
                        
                    </BackgroundImage>
                </TouchableOpacity>
                <Text style={{width:'80%',textAlign:'left',color:'gray',marginBottom:5}}>Phone Number</Text>
                <View style={styles.numberDiv}>
                    <Text style={styles.country}>{"+91"}</Text>
                    <Text style={{fontSize:18,color:'gray'}}>{phoneNumber}</Text>
                </View>
                <Text style={{width:'80%',textAlign:'left',color:'gray',marginBottom:5}}>User Name</Text>
                <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor="#a8a8a8"
                    style={styles.input} 
                    value={userTemp}
                    onChangeText={(user)=>{setUserTemp(user);setErr("")}}
                    maxLength={20}
                />
                <Text style={styles.err}>{err}</Text>
                <LinearGradient 
                    start={{x:0,y:0}} 
                    end={{x:1,y:0}} 
                    style={[styles.submit,(userTemp.length===0 || !online) && {borderColor:COLORS.primary,borderWidth:1,borderRadius:7}]}
                    colors={(userTemp.length!==0 && online)?[COLORS.primary,COLORS.secondary]:["white","white"]}>
                        <TouchableOpacity 
                            disabled={userTemp.length<=0 || !online ?true:false}
                            style={{width:'100%',alignItems:'center'}}
                            onPress={onSubmit}
                        >
                            <Text style={[styles.submitText,(userTemp.length!==0 && online ) ?{color:"white"}:{color:COLORS.primary}]}>FINISH</Text>
                        </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}

export default AddUserDetails;

const styles = StyleSheet.create({
    submitText:{
        fontSize:16
    },
    submit:{
        padding:12,
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:7,
        marginTop:20
    },
    image:{
        width:150,
        height:150,
        marginBottom:20
    },
    err:{
        fontSize:15,
        color:'white',
        marginBottom:10
    },
    inputNumber:{
        // width:'90%',
        // backgroundColor:'red',
        // textAlign:'center',
        // paddingLeft:10,
        height:'100%',
        fontSize:20,
        color:'black'
    },
    country:{
        fontSize:18,
        color:'gray'
    },
    numberDiv:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        paddingLeft:10,
        paddingRight:10,
        width:'80%',
        height:50,
        // backgroundColor:'#3d3a7fa1',
        borderRadius:7,
        marginBottom:20,
        shadowColor:'black',
        borderColor:'gray',
        borderWidth:1,
        
    },
    // submit:{
    //     // backgroundColor:'#2e2a75',
    //     backgroundColor:COLORS.primary,
    //     height:50,
    //     width:'70%',
    //     justifyContent:'center',
    //     alignItems:'center',
    //     borderRadius:7,
    // },
    subDiv:{
        // flex:1,
        // backgroundColor:'#494779',
        // flexDirection:'column',
        width:'100%',
        // alignItems:'center',
        // justifyContent:'center',
        borderTopLeftRadius:200,
        // borderTopLeftRadius:10
    },
    input:{
        paddingLeft:10,
        paddingRight:10,
        width:'80%',
        height:50,
        // backgroundColor:'#3d3a7fa1',
        borderRadius:7,
        fontSize:20,
        marginBottom:20,
        color:'black',
        textAlign:'center',
        borderColor:'gray',
        borderWidth:1,
    },
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      width:'100%',
    //   justifyContent:'center',
    //   paddingTop:90,
    //   paddingLeft:20,
    //   paddingTop:10
    },
  });