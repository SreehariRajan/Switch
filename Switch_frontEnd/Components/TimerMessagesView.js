import React, { useState,useEffect,useContext } from 'react';
import {View,StyleSheet, FlatList,StatusBar,Text,TouchableOpacity,BackHandler, ImageBackground} from 'react-native';
import MssgDiv from './MssgDiv';
import {COLORS} from '../Colors';
import FetchTimmerMessages from '../hooks/useTimerMessages';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import {Context } from '../Context';
import LoadingView from './LoadingView';
import AlertView from './AlertView';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';


function TimerMessagesView() {
    const navigation = useNavigation();
    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const [mssg,setMssg]=useState("");
    const [show,setShow] = useState(false);
    const [loading,setLoading] = useState(true);
    
    const [Timmermssgs,setTimmerMssgs] = useState([]);
    const {userDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser] = userDetails;

    useEffect(() => {
        const handleClose = ()=>{
                navigation.goBack();
                return true;  
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove();

    }, []);

    useEffect(() => {
        async function getMssgs(){
            console.log("uuu",userNumber)
            const token = await SecureStore.getItemAsync('token');
            const response =await FetchTimmerMessages(userNumber,token)
                                .then(res=>{
                                    if (res){
                                        setLoading(false);
                                        if (res.status===200){
                                            console.log(res.data,"resss")
                                            setTimmerMssgs(res.data);
                                        }
                                    }
                                })
        // fetch timer messages data here 
        }
        if (online){
            getMssgs()
        }
        else{
            setLoading(false);
        }
    }, [userNumber,online]);

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
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{fontSize:18,color:'white',marginLeft:20}}>Timer messages</Text>
            </View>
            {!pastOnlineStatus && online &&
                <AlertView icon={<Ionicons name="cellular-sharp" size={30} color="green" />} content={"Back to Online"} />
            }
            {!online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={30} color="orange" />} content={"You are Offline"} />
            }
            <ImageBackground
                source={require('../assets/images/chatScreenBg.png')}  
                style={{flex:1,width:'100%',paddingTop:20}}
            >
                
                {!loading ?
                    (Timmermssgs.message==="empty"?
                    <Text style={{width:'100%',textAlign:'center'}}>You havent send any timmer message yet</Text>
                    :
                    <FlatList
                        style={{flex:1,width:'100%'}} 
                        data={Timmermssgs.timmerMssgs}
                        renderItem={({item,index})=><MssgDiv
                            TimerMessagesView={true}
                            setStarredMssgShow={null}
                            // handleInfiniteScrolling={handleInfiniteScrolling} 
                            mssg={item} 
                            notificationNumber={null}                               
                            starredMssgs={null}
                            setStarredMssgs={null}
                            // mssgArrayPart={mssgArrayPart} 
                            // setMssgArrayPart={setMssgArrayPart}
                            // handleInfiniteScrolling={handleInfiniteScrolling} 
                            // mssgArray={mssgArray} 
                            // ScrollRef={ScrollRef} 
                            // toUser={name} 
                            toNumber={item.to.userNumber}  
                            index={index} 
                            userNumber={item.from.userNumber} 
                            // lengthofArray={mssgArray.length}      
                            user={item.from.user} 
                            />   
                        }
                keyExtractor={(item,index)=>index.toString()}   
                    />
                    )
                : 
                    <LoadingView />
                }
                
            </ImageBackground>
 
        </View>
    );
}

export default TimerMessagesView;

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        width:'100%'
    },
    header:{
        width:'100%',
        padding:20,
        backgroundColor:COLORS.primary,
        // position:'absolute',
        // top:0,
        flexDirection:'row',
        alignItems:"center",
    },
})