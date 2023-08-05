import React, { useEffect,useState,useContext,useRef } from 'react';
import { View,Text, StyleSheet,TextInput,ScrollView,StatusBar,TouchableOpacity, AsyncStorage,Keyboard,FlatList,AppState,ActivityIndicator,BackHandler, ImageBackground } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {Context} from '../Context';
import io from 'socket.io-client';
import { Avatar } from 'react-native-elements';
import {COLORS} from '../Colors';
import { BASE_URL } from '../constants/urls';
import NetInfo from '@react-native-community/netinfo';


import AlertView from './AlertView';
import MenuScreen from './MenuScreen';
import ContactView from './ContactView';

// icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

//apis
import ContactsUsersCheck from '../api/ContactsUsersCheck';
import StatusObject from './StatusObject';
import ContactsUsersStatus from '../api/ContactsUsersStatus';
import FetchUserStatus from '../hooks/useUserStatus';

function ChatMenuScreen() {

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);
    const [loading,setLoading] = useState(true);
    const [loadingStatus,setLoadingStatus] = useState(true);
    const navigation = useNavigation();
    const [search,setSearch]=useState("");
    const [searchClicked,setSearchClicked]=useState(false);
    const [phoneContacts,setPhoneContacts] = useState([]);
    const {userDetails,contactsDetails,statusDetails,userProfile,userStatusDetails,tokenDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const [contacts,setContacts]=contactsDetails;
    const [token,setToken] = tokenDetails;
    const [status,setStatus]=statusDetails;
    const [userStatus,setUserStatus] = userStatusDetails;
    const [latestMssg,setLatestMssg] = latestMssgDetails;
    const [menuOption,setMenuOption] = useState(false);
    const keyboardRef = useRef();
    const [profileLocation,setProfileLocation] = userProfile;
    //managing network status and its status display
    useEffect(() => {
        NetInfo.addEventListener(handleConnectionChange)
    }, []);

    useEffect(() => {
        if (online){
            setTimeout(()=>setPastOnlineStatus(online),3000);
        }
        setShow(true);
        if (!online){
            setTimeout(()=>setShow(false),3000);
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

    console.log(contacts.length,"jsghd")
    // if (online){
        // var socket = io.connect(`${BASE_URL}/messageSocket/connect`);
        var socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
            auth:{
                token:token
            },
            query:{
                userNumber:userNumber
            }
        });


        var socketStatus = io.connect(`${BASE_URL}/statusSocket/connect`,{
            auth:{
                token:token
            },
            query:{
                userNumber:userNumber
            }
        });
    // }
    
    useEffect(() => {
        async function getLocalContacts(){
            const localContactsString = await AsyncStorage.getItem('contacts');
            const localContacts =await JSON.parse(localContactsString);
            console.log(localContacts.length)
            if (localContacts){
               setContacts(localContacts);
               setLoading(false);
            }
        }
        getLocalContacts();
    }, [])

    useEffect(() => {
        async function fetchDetails(){
            let locationUri = await SecureStore.getItemAsync('userProfilePic');
            setProfileLocation(locationUri);
        };
        fetchDetails();
    }, []);
    useEffect(() => {
        if (online){
            (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.PHONE_NUMBERS,
                        ],
                        pageSize:50
                });
                if (await data.length > 0) { 
                    setPhoneContacts(data); 
                }
            }
            })();
        }
      },[online]);

    //emiting online status of the user
    useEffect(() => {
        if (online){
        //listening for user status for others
            socket.on(`onlineStatusCheck ${userNumber}`,({askedUser})=>{
                if (askedUser){
                    //sending userStatus
                    socket.emit('onlineStatusChecked',{online:true,user:askedUser});
                }
            });
        }
        

        //giving status to contacts when logined at intermediate time
    }, [online])
    useEffect(() => {
        if (online){
            if (contacts){
            //sending userStatus
                socket.emit(`userConnected`,{online:true,user:userNumber,contacts:contacts});
            }
        }
    }, [contacts,online])

    useEffect(() => {

         async function handleAppState(nextAppState){
                if (nextAppState !== 'active'){
                    //giving status wehn disconnected
                    if (online){
                        const Time = new Date();
                        const year = Number(Time.getFullYear());
                        const month = Number(Time.getMonth()+1);
                        const day = Number(Time.getDate());
                        const hours = Number(Time.getHours());
                        const minutes = Number(Time.getMinutes());
                        const seconds = Number(Time.getSeconds());
                        console.log("disss")
                        socket.emit(`userDisconnected`,{online:false,user:userNumber,contacts:contacts,timeObject:{year:year,month:month,day:day,hours:hours,minutes:minutes,seconds:seconds}});
                    }
                    if (contacts.length>0){
                        console.log("yes")
                        AsyncStorage.setItem('contacts',JSON.stringify(contacts))
                    }
                } 
        };
        AppState.addEventListener('change',handleAppState);
        return () => {
            AppState.addEventListener('change',handleAppState);
            // AppState.removeEventListener('change',handleAppState);
        }
    }, [contacts,online]);

    useEffect(() => {
        const handleClose = ()=>{
            if (menuOption){
                console.log("iiii")
                setMenuOption(false);
                return true;
                
            }
            else{
                BackHandler.exitApp();
                return true;
            }
            
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove()

    }, [menuOption])


    useEffect(()=>{
        async function getContacts(){
            if (phoneContacts){
                const response = await ContactsUsersCheck(phoneContacts,token,userNumber).then(
                async res=>{
                    if (res.status===200){
                        if (res?.data){
                            setContacts(res.data);
                            setLoading(false);
                        }
                    }
                }
            );
            }
        };
        if (online){
            getContacts();
        }
        else{
            setLoading(false);
        }
    },[phoneContacts,online,token]);

    useEffect(() => {
        if (online){
            socketStatus.on(`Recieve Status ${userNumber}`,async item=>{
                const index = await status.findIndex((ele,ind)=>ele._id===item.phoneNumber);
                if (index>-1){
                    var prevState = await status;
                    var needed = await prevState.splice(index,1)[0];
                    needed.statusList.push(item);
                    // console.log(prevState)
                    await prevState.unshift(needed);
                    setStatus(prevState);
                }
                else{
                    setStatus(status=>[item,...status]);
                }
                
            })
        }
    }, [online])

    useEffect(() => {
        async function getStatus(){
                if (contacts){
                    const response = await ContactsUsersStatus(contacts,token,userNumber).then(
                        res=>{
                            if (res){
                                if (res.status===200){
                                    setStatus(res.data);
                                    console.log(res.data,"oooooooooooooooooooo")
                                    setLoadingStatus(false);
                                }
                            }
                        }
                    )
                }
        }
        if (online){
            getStatus();
        }
        else{
            setLoadingStatus(false);
        }
    }, [contacts,online,token]);

    useEffect(()=>{
        async function fetching(){
            const response =await FetchUserStatus(userNumber,token)
                        .then(res=>{
                            if (res.status===200){
                                console.log(res.data)
                                if (res.data){
                                    setUserStatus(res.data);
                                }
                            }
                        })
        }
        if (online){
            fetching();
        }
    },[online,token]);

    useEffect(() => {
        // Keyboard.addListener('keyboardDidHide',()=>{
        //     setSearch("");
        //     setSearchClicked(false);
        // })
        return () => {
            Keyboard.removeAllListeners;
        }
    }, []);
    useEffect(() => {
        
        socket.on(`Recieve Message ${userNumber}`,(mssg)=>{
            if ( mssg){ 
                setLatestMssg(mssg)
            }
        
        });
    }, [])
    useEffect(() => {
        async function Swap(){
            const Number = latestMssg.from.userNumber===userNumber?latestMssg.to.userNumber:latestMssg.from.userNumber;
            const index = await contacts.findIndex((ele,ind)=>ele.phoneNumber===Number);
            console.log("trying to swap ",index,contacts[0].phoneNumber,latestMssg.from.userNumber)
            if (index>-1){
                console.log("swapppingggg")
                var prevState = await contacts;
                var needed = await prevState.splice(index,1)[0];
                needed.latestMssg=await latestMssg;
                await prevState.unshift(needed);
                console.log(prevState.length,prevState)
                setContacts(prevState);
            }
        }
        if (latestMssg){
            Swap()
        }
    }, [latestMssg]);

    useEffect(()=>{
        if (online){
            if (!socket){
                return;
            };
            socket.on(`Recieve Message ${userNumber}`,async (mssg)=>{
                if (mssg){
                    setLatestMssg(mssg);
                }
            });
        }
    },[online]);

    useEffect(() => {
       if (searchClicked){
           if (keyboardRef.current){
               keyboardRef.current.focus();
           }
       }
    }, [searchClicked]);

    return (
        <View 
            style={styles.container}
        >
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            {!pastOnlineStatus && online &&
                    <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
            }
            {!online && show &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
            }   
            <View style={[styles.topScreenOptions]}>
            {!searchClicked?
                <View style={styles.topScreenOptionsSub}>
                    <TouchableOpacity style={styles.optionBars} onPress={()=>setMenuOption(true)}>
                        <Avatar 
                            icon={{name:'user', type:'font-awesome'}}
                            size='small'
                            rounded
                            activeOpacity={0.7}
                            source={{uri:profileLocation}}
                            containerStyle={{backgroundColor:'#d7d9db'}}
                        />
                    </TouchableOpacity>
                    <Text style={styles.appName}>Switch</Text>
                    <TouchableOpacity onPress={()=>{setSearchClicked(true)}}>
                        <FontAwesome name="search" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            :
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{setSearch("");setSearchClicked(false)}}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <TextInput placeholder="Search" ref={keyboardRef} value={search} onChangeText={text=>{setSearch(text)}} style={styles.search} />
                        <FontAwesome name="search" size={20} color="gray" />
                    </View>
                </View>
                }

            </View>
            
            {
                menuOption && 
                <MenuScreen userName={user} userNumber={userNumber} setMenuOption={setMenuOption} imageLocation={profileLocation} />
            }
            <View style={{height:75,width:'100%',marginBottom:10}}>
                <View style={{height:'100%',width:'100%',flexDirection:'row',alignItems:'center',paddingLeft:10,paddingRight:10}}>
                    <StatusObject token={token} item={userStatus} User={true} /> 
                    {(!loadingStatus && status!==undefined && status.length!==0 &&
                    <FlatList
                        horizontal
                        style={styles.statusScrollView}
                        // data = {status}
                        data = {status.filter(item=>{
                            return search!==""?contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===item._id)]?.name.toLowerCase().includes(search.toLowerCase()):item;
                    
                        })}
                        renderItem = {({item,index})=>

                            <StatusObject index={index} item={item} User={false} />
                            
                        }
                        keyExtractor={(item,index)=>index.toString()}
                    />  
                )}
                </View>      
            </View>
            <View style={styles.options}>
                <Text style={[styles.optionsText]} >Chats</Text>
            </View>
            <ImageBackground source={require('../assets/images/lightBg.png')} style={styles.scrolviewContainer}>
                {!loading ?
                    (contacts!==undefined?
                        <FlatList
                        style={styles.scrollview}
                        data = {contacts.filter(item=>{
                                    return search!==""?item.name.toLowerCase().includes(search.toLowerCase()):item;
                                })}
                        renderItem = {({item,index})=>
                                <ContactView token={token} key={index} name={item.name} Mssg={item.latestMssg} imageUri={item.imageLocation} tonumber={item.phoneNumber} setSearchClicked={setSearchClicked} />
                            }
                        keyExtractor={(item,index)=>index.toString()}

                    />
                    :
                    <Text>no contacts use this app</Text>)
                :
            <ActivityIndicator style={styles.activityIndicator} size="large" color={COLORS.primary}/>
                }
                <TouchableOpacity disabled={!online?true:false} onPress={()=>navigation.navigate("TimerMessageDraft",{fromForwardView:false})} style={[{position:'absolute',bottom:20,right:20,padding:15,borderRadius:60,alignItems:'center',justifyContent:'center'},online?{backgroundColor:COLORS.primary}:{backgroundColor:'#c4c4c4'}]}>
                        <MaterialCommunityIcons name="message-text-clock" size={29} color="white" />
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

export default ChatMenuScreen;
const styles=StyleSheet.create({
    statusScrollView:{
        width:'100%',
        height:'100%',
        paddingRight:10,
        paddingLeft:10
    },
    topScreenOptions:{
        flexDirection:'row',
        padding:10,
        paddingLeft:20,
        paddingRight:20,
        width:'100%',
        alignItems:'center',
    },
    topScreenOptionsSub:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    optionsText:{
        fontSize:16,
        color:COLORS.primary,
        fontWeight:'bold'
    },
    appName:{
        fontSize:20,
        color:'black',
        fontWeight:'bold'
    },
    options:{
        paddingTop:0,
        justifyContent:'flex-end',
        width:'100%',
        paddingLeft:20,
        paddingBottom:10
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
    },
    search:{
        width:'90%',
        height:'100%',
        borderRadius:30,
        paddingLeft:20,
        paddingRight:20,
        fontSize:16

    },
    scrollview:{
        paddingBottom:100
    },
    scrolviewContainer:{
        width:'100%',
        backgroundColor:'#f8f8f8',
        flex:1,
        shadowColor: '#000',
        paddingBottom:40,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
    },
    container:{
        flex:1,
        width:'100%',
        alignItems:'center',
        backgroundColor:'white'
    }
})
