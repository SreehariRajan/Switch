import React, { useEffect, useRef, useState} from 'react';
import { View,StyleSheet,Text,TouchableOpacity,FlatList,TextInput,StatusBar, ToastAndroid, ScrollView,BackHandler,Keyboard} from 'react-native';
import { useContext } from 'react';
import {Context} from '../Context';
import * as SecureStore from 'expo-secure-store';
import {COLORS} from '../Colors';
import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import ContactView from './ContactView';
import { Entypo } from '@expo/vector-icons';
import forwardMssg from '../services/forwardMssg';
import { FontAwesome } from '@expo/vector-icons';
import sendTimerMessages from '../api/sendTimerMessages';
import uploadTos3 from '../services/uploadTos3';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AlertView from './AlertView';


function ForwardMssgView() {
    const {userDetails,contactsDetails,SelectedContactsDetails,selectedMssgArrayDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const [contacts,setContacts]=contactsDetails;
    const [selectedContacts,setSelectedContacts]=SelectedContactsDetails;
    const [selectedMssgArray,setSelectedMssgArray]=selectedMssgArrayDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;
    const [search,setSearch]=useState("");
    const [searchClicked,setSearchClicked]=useState(false);
    const [checkedTimmer,setCheckedTimmer] = useState(false);
    const [err,setErr] = useState(false);
    
    const route = useRoute();
    const navigation = useNavigation();
    const keyboardRef = useRef(null);

    const {mssgObj,TimerMessageDraft,setMssgArrayPart,toNumberFrom,recorded} = route.params;
    const handleRemove = async(index)=>{
        const lengthoflist =await selectedMssgArray.length;
        setSelectedMssgArray(mssgs=>mssgs.filter((mssg,indx)=>{return index!==indx}));
        if (lengthoflist ===1){
            navigation.goBack();
        }
    }
    useEffect(() => {
        const handleClose = ()=>{
            navigation.goBack();
            return true;
            
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove()

    }, [])

    useEffect(() => {
        if (searchClicked){
            if (keyboardRef.current){
                keyboardRef.current.focus();
            }
        }
     }, [searchClicked]);
    return (
        <View style={styles.container}>
            {
            err && 
            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"Something went wrong"} subContent={"status not sent"} />
            }
            <StatusBar backgroundColor={COLORS.primary} barStyle='light-content' />
            {!searchClicked?
                <View style={{backgroundColor:COLORS.primary,padding:15,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>{Keyboard.dismiss();navigation.goBack()}}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{color:'white',fontSize:18,marginLeft:20}}>{TimerMessageDraft?"Send to":"Forward to"}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{setSearchClicked(true)}}>
                        {/* <FontAwesome name="search" size={15} color="white" /> */}
                        <FontAwesome name="search" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                :
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,backgroundColor:COLORS.primary}}>
                    <TouchableOpacity onPress={()=>{setSearch("");setSearchClicked(false)}}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <TextInput placeholder="Search" ref={keyboardRef} value={search} onChangeText={text=>{setSearch(text)}} style={styles.search} />
                        <FontAwesome name="search" size={20} color="gray" />
                    </View>
                </View>
            }
            <View style={styles.scrolviewContainer}>
                <TouchableOpacity onPress={()=>setCheckedTimmer(!checkedTimmer)} >
                    <View style={{width:'100%',marginBottom:1,paddingLeft:20,backgroundColor:checkedTimmer?COLORS.mssgColor:'white',height:70,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}} >
                        <View style={{backgroundColor:checkedTimmer?COLORS.primary:"white",borderRadius:60,height:50,marginRight:20,alignItems:'center',justifyContent:'center',width:50,borderColor:checkedTimmer?COLORS.primary:'transparent',borderWidth:2}}>
                            <MaterialCommunityIcons name="message-text-clock" size={25} color={checkedTimmer?"white":COLORS.primary} />
                            {
                                checkedTimmer &&
                                    <View style={{position:'absolute',bottom:5,right:0,backgroundColor:COLORS.primary,padding:3,borderRadius:60}} >
                                        <MaterialIcons name="done" size={13} color="white" />
                                    </View>
                            }
                        </View>
                        <View>
                            <Text style={{fontSize:18}}>Timmer forward</Text>
                        </View>
                    </View>
                </TouchableOpacity> 
                <FlatList
                        // contentContainerStyle={styles.scrolviewContainer}
                        style={styles.scrollview}
                        data = {contacts.filter(item=>{
                            return search!==""?item.name.toLowerCase().includes(search.toLowerCase()):item;
                        })}
                        renderItem = {({item,index})=>
                        <ContactView forwardScreen={true} key={index} imageUri={item.imageLocation} name={item.name} tonumber={item.phoneNumber} />}
                        keyExtractor={(item,index)=>index.toString()}
                    />
                <ScrollView horizontal style={{backgroundColor:COLORS.mssgColor,position:'absolute',flexDirection:'row',elevation:5,zIndex:5,bottom:0,zIndex:5,padding:5,paddingLeft:20,paddingRight:20,height:35,width:'100%'}}>
                    {selectedContacts.map((item,ind)=>{
                        return (<Text style={{marginRight:5,fontSize:14}} key={ind} >{`${contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===item)].name},`}</Text>)
                    }) }   
                </ScrollView> 
                <TouchableOpacity
                    disabled={10>selectedContacts.length>0?false:true} 
                    style={[styles.forward,selectedContacts.length>0?{backgroundColor:COLORS.primary}:{backgroundColor:'#c4c4c4'}]}
                    onPress={async()=>{
                        if (TimerMessageDraft){
                            ToastAndroid.show("Adding timmer message",ToastAndroid.SHORT);
                            const token = await SecureStore.getItemAsync('token');
                            if (recorded){
                                const uploadedLocation = await uploadTos3(mssgObj.fileObject,"audios/recorded");
                                const mssgObjt =await {message:" ",starredMessage:false,ImageStatus:false,DocumentStatus:false,AudioStatus:true,audio:{location:uploadedLocation},document:{value:null},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},from:{user:user,userNumber:userNumber},time:mssgObj.time,timeObject:mssgObj.timeObject};
                                const response = await sendTimerMessages(mssgObjt,selectedContacts,token);
                            }
                            else{
                                const response = await sendTimerMessages(mssgObj,selectedContacts,token); 
                            }
                            navigation.navigate("ChatMenu");
                        }
                        else{
                            if (checkedTimmer){
                                console.log("yesss");
                                // navigation.navigate("ChatMenu");
                                // navigation.navigate("TimerMessageDraft");
                                navigation.navigate("TimerMessageDraft",{
                                    selectedMssgArray:selectedMssgArray,
                                    selectedContacts:selectedContacts,
                                    toNumberFrom:toNumberFrom,
                                    setSelectedMssgArray:setSelectedMssgArray,
                                    fromForwardView:true
                                })
                            }
                            else{
                                forwardMssg(selectedMssgArray,selectedContacts,setMssgArrayPart,setLatestMssg,toNumberFrom,setSelectedMssgArray,setErr);
                                navigation.goBack();
                            }
                        }
                        
                    }}

                >
                    <Entypo name="forward" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default ForwardMssgView;

const styles=StyleSheet.create({
    mssgsView:{
        paddingTop:10,
        paddingBottom:5,
        width:'100%',
        maxHeight:150,
        marginBottom:10
    },
    searchContainer:{
        width:'90%',
        alignItems:'center',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        borderRadius:5,
        elevation:2,
        height:40,
        borderColor:'transparent'
    },
    search:{
        width:'90%',
        height:'100%',
        borderRadius:30,
        paddingLeft:20,
        paddingRight:20,
        fontSize:16

    },
    forward:{
        position:'absolute',
        bottom:45,
        right:20,
        backgroundColor:COLORS.primary,
        width:55,
        height:55,
        borderRadius:60,
        alignItems:'center',
        justifyContent:'center'
    },
    scrollview:{
        // paddingTop:10,
        paddingBottom:100,
        // flex:
        // minHeight:'100%'
    },
    scrolviewContainer:{
        flex:1,
        // marginTop:100,
        paddingTop:0,
        width:'100%',
        backgroundColor:'#f5f3f3',
        // borderTopRadius:46,
        // borderTopLeftRadius:46,
        // borderTopRightRadius:46,,
        shadowColor: '#000',
        paddingBottom:40,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        // minHeight:"80%"
    },
    cancel:{
        alignSelf:'flex-end'
    },
    mssg:{
        color:'white',
        lineHeight:18,
        fontSize:15,
        margin:15,
        marginTop:0,
    },
    mssgView:{
        flexDirection:'column',
        maxWidth:'80%',
        alignSelf:'center',
        backgroundColor:COLORS.primary,
        borderRadius:10,
        minHeight:30,
        minWidth:'50%',
        marginBottom:10
    },
    headerText:{
        fontSize:22,
        fontWeight:'bold',
        color:"white"
    },
    header:{
        width:'100%',
        height:60,
        backgroundColor:COLORS.primary,
        elevation:2,
        justifyContent:'center',
        paddingLeft:20,
        paddingRight:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'

    },
    container:{
        flex:1,
        backgroundColor:'white',
        flexDirection:'column'
    }
})