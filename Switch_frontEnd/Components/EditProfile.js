import React, { useState,useEffect,useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Keyboard, StyleSheet,BackHandler } from 'react-native';
import {View,Text} from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import { COLORS } from '../Colors';
import {handleProfilePicSelection} from '../services/handleMultimedia';
import updateAcc from '../api/updateAcc';
import { useNavigation } from '@react-navigation/core';
import uploadTos3 from '../services/uploadTos3';
import {Context} from '../Context';
import { StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LoadingView from './LoadingView';
import { AntDesign } from '@expo/vector-icons';
import AlertView from './AlertView';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


function EditProfile() {

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);

    const [name,setName]=useState(null);
    const [InitialName,setInitialName]=useState(null);
    const [number,setNumber]=useState(null);
    const [loading,setLoading] = useState(true);

    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);

    const [profileLocation,setProfileLocation]=useState(null);
    const [initialProfileLocation,setInitialProfileLocation]=useState(null);
    const {userDetails,contactsDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const textInputRef = useRef(null);
    const navigation = useNavigation();
    console.log("oooo")
    useEffect(() => {
        async function fetchDetails(){
            let locationUri = await SecureStore.getItemAsync('userProfilePic');
            let number = await SecureStore.getItemAsync('phoneNumber');
            let name = await SecureStore.getItemAsync('userName');
            setProfileLocation(locationUri);
            setInitialProfileLocation(locationUri);
            setNumber(number);
            setName(name);
            setInitialName(name);
            setLoading(false);
        };
        fetchDetails();
    }, []);

    useEffect(() => {
        return () => {
            setName(null)
        }
    }, [])
    useEffect(() => {
        const handleCloseMenuScreen = ()=>{
                navigation.goBack();
                return true;  
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleCloseMenuScreen);

        return ()=>backHandler.remove();

    }, []);

    useEffect(() => {
        setTimeout(()=>setShow(false),3000);
    }, [show])

    const submit = async()=>{

        setLoading(true);
        const fileNameObject = await profileLocation.split('/');
        const fileName = await fileNameObject[fileNameObject.length-1];
        const fileObject =await  {
            uri:profileLocation,
            name:String(fileName),
            type:"image/png",

        };
        var uploadedLocation;
        const token = await SecureStore.getItemAsync('token');
        console.log("ppp 2")

        if (fileNameObject[0].includes("http")){
            console.log("ppp 6")
            const response = await updateAcc(number,name,profileLocation,token)
            .then(async res=>{
                console.log("updates");
                if (res.status===200 && res.data.message==="success"){
                    await SecureStore.setItemAsync('userProfilePic',profileLocation);
                    console.log("updates");
                    setMssg("Updated Successfully");
                    setShow(true)
                }
                else{
                    setMssg("Something went wrong");
                    setShow(true)
                }
            })
            
        }
        else{
            var uploadedLocation = await uploadTos3(fileObject,"images/profile");
            const response = await updateAcc(number,name,uploadedLocation,token)
            .then(async res=>{
                console.log("updates");
                if (res.status===200 && res.data.message==="success"){
                    await SecureStore.setItemAsync('userProfilePic',uploadedLocation);
                    console.log("updates");
                    setMssg("Updated Successfully");
                    setShow(true)

                }
                else{
                   setMssg("Something went wrong");
                   setShow(true);
                }
            })
        }
        SecureStore.setItemAsync('userName',String(name));
        setUser(name);
        textInputRef.current?.blur();
        Keyboard.dismiss();
        setInitialName(name);
        setLoading(false);
    };
    const handleUpdateProfilePic = async() =>{
        const uri =await handleProfilePicSelection();
        if (uri!=="candelled"){
            setProfileLocation(uri);
        }
    };
    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);
    useEffect(() => {
        if (online){
            setTimeout(()=>setPastOnlineStatus(online),3000);
        }
        return () => {
            
        }
    }, [online])

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
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            {
                loading &&
                <LoadingView />
            }
            {!pastOnlineStatus && online &&
                <AlertView icon={<Ionicons name="cellular-sharp" size={30} color="green" />} content={"Back to Online"} />
            }
            {!online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={30} color="orange" />} content={"You are Offline"} />
            }
            {show && mssg==="Updated Successfully" &&
                <AlertView 
                icon={<AntDesign name="checkcircle" size={30} color="green" />} content={mssg} />
            }
            {show && mssg==="Something went wrong" &&
                <AlertView 
                icon={<AntDesign name="exclamationcircle" size={30} color="orange" />} content={mssg} />
            }
            
            <View style={{backgroundColor:COLORS.primary,padding:15,width:'100%',marginBottom:20,flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{Keyboard.dismiss();navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{color:'white',fontSize:18,marginLeft:20}}>Edit Profile</Text>
            </View>
            <TouchableOpacity disabled={!online?true:false} onPress={handleUpdateProfilePic}>
                <BackgroundImage source={{uri:profileLocation}} imageStyle={{borderRadius:100,backgroundColor:'#0000004f'}} style={styles.image}>
                    <View style={{backgroundColor:online?COLORS.primary:'#999999',position:'absolute',bottom:'5%',right:4,width:45,borderRadius:50,flexDirection:'row',alignItems:'center',justifyContent:'center',height:45}}>
                        <Entypo  name="edit" size={20} color="white" />
                    </View>
                </BackgroundImage>
            </TouchableOpacity>
            <TouchableOpacity disabled={!online?true:false} onPress={()=>{textInputRef.current?.focus()}} style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:20,paddingRight:20}}>
                <FontAwesome5 name="user-alt" size={20} color={COLORS.primary} />
                <View style={{flexDirection:'column',alignItems:'flex-start',marginLeft:20,paddingTop:0,width:'80%'}}>
                    <Text style={{color:'gray',marginTop:0}}>Name</Text>
                    <TextInput editable={!online?false:true} ref={textInputRef} numberOfLines={1} onChangeText={e=>setName(e)} style={{fontSize:20,borderRadius:5,}} value={name} />
                </View>
                <Entypo  name="edit" size={24} color={online?COLORS.primary:'gray'} />
            </TouchableOpacity>
            <View style={{width:'90%',flexDirection:'row',alignItems:'center',marginTop:30}}>
                <FontAwesome5 name="phone-alt" size={20} color={COLORS.primary} />
                <View style={{flexDirection:'column',alignItems:'flex-start',marginLeft:20,paddingTop:0,width:'80%'}}>
                    <Text style={{color:'gray',marginTop:0}}>Phone Number</Text>
                    <Text style={{fontSize:16,borderRadius:5,}}>{userNumber}</Text>
                    {/* <TextInput numberOfLines={1} onChangeText={e=>setName(e)} style={{fontSize:20,borderRadius:5,}} value={name} /> */}
                </View>
            </View>
            {
                (InitialName !== name || profileLocation!==initialProfileLocation) &&
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',width:'100%',paddingRight:20,marginTop:10}}>
                    <TouchableOpacity style={{marginRight:20}} onPress={()=>{setName(user);console.log("exit yyyyyyyyy");navigation.navigate("ChatMenu")}} >
                        <Text style={{fontSize:17,color:COLORS.primary}}>cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={submit} >
                        <Text style={{fontSize:17,color:COLORS.primary}}>save</Text>
                    </TouchableOpacity>
                </View>
            }
            
        </View>
    );
}

export default EditProfile;

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        width:'100%',
        // paddingTop:40,
        backgroundColor:'white'
    },
    image:{
        width:200,
        height:200,
    }
})