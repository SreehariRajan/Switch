import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState,useContext,useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity,AppState } from 'react-native';
import { View,Image,Text } from 'react-native';
import { COLORS } from '../Colors';
import { Context } from '../Context';
import { Ionicons } from '@expo/vector-icons';

function StatusObject({User,index,item,token}) {
    const [viewed,setViewed] = useState(false);
    const navigation = useNavigation();
    const {userDetails,contactsDetails,statusDetails,userProfile,userStatusDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser,]=userDetails;
    const [profileLocation,setProfileLocation] = userProfile;
    const [userStatus,setUserStatus] = userStatusDetails;
    const [itemState,setItemState] = useState([]);

    const [statusAvailable,setStatusAvailable] = useState(false)


    const handleViewCheck = async()=>{
        if (!User){
            console.log(itemState)
            console.log(item,"objectytytytyty")
            if (itemState.statusList){
                var count = 0;
                for (var i=0;i<itemState.statusList.length;i++){
                    const index =await itemState.statusList[i].seen.findIndex((obj,ind)=>obj.userNumber===userNumber);
                    if (index !==-1){
                        count=await count+1;
                    }
                }
                // console.log("countttt",count)
                if (itemState.statusList.length===count){
                    setViewed(()=>true);
                }
                else{
                    setViewed(()=>false)
                }
            }
        }
        if (User){
                var count = 0;
                // const index = await itemState?.findIndex((ele,ind)=>ele.seenMySelf===false);
                // if (index!=-1){
                //     setViewed(false)
                // }
                // else{
                //     setViewed(true);
                // }
                for (var i=0;i<itemState.length;i++){
                    if (itemState[i].seenMySelf===true){
                        count=await count+1;
                    }
                }
                if (itemState.length===count){
                    setViewed(()=>true);
                }
                else{
                    setViewed(()=>false)
                }
            }
        
    }

    useEffect(() => {
        const handlesetState = ()=>{
            if (User){
                setItemState(()=>item);
                if (item?.length>0){
                    setStatusAvailable(true);
                }
            }
            else{
            
                setItemState(item);
                if (item.statusList?.length>0){
                    setStatusAvailable(true);
                }
            }

        }
        handlesetState();
        handleViewCheck();
    }, [itemState,User,statusAvailable])


    const handlePress = ()=>{
        setViewed(()=>true);
        if (User){
            if (userStatus?.length>0){
                navigation.navigate("MyStatus",{token:token});
            }
            else{
                navigation.navigate("AddStatus",{token:token});
            }
        }
        else{
           navigation.navigate("StatusView",{item:item,index:index,token:token})
        }
    }
    return (
        
        <TouchableOpacity onPress={handlePress} style={[styles.container]}>
            {User?
            (userStatus?.length>0 ?
                <LinearGradient style={{width:57,height:57,alignItems:'center',justifyContent:'center',borderRadius:100}} colors={!viewed ? ["#cd8cee","#97aaf1"]:['#bcbcbc','#c7c7c7']} >
                    <View style={{width:53,height:53,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:100}}>
                        <Image style={[{width:47,height:47,borderRadius:60,backgroundColor:'#d7d9db'}]} source={!User?{uri:item?.profilePic}:{uri:profileLocation}} />
                    </View>
                </LinearGradient>
            :
                <View style={{width:57,height:57,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:100}}>
                    <Image style={[{width:53,height:53,borderRadius:60,backgroundColor:'#d7d9db'}]} source={!User?{uri:item?.profilePic}:{uri:profileLocation}} />
                    {User &&
                        <View style={{backgroundColor:'white',borderRadius:50,position:'absolute',bottom:2,right:2}}>
                            <Ionicons style={{alignSelf:'center'}}  name="add-circle-sharp" size={24} color={COLORS.primary} />
                        </View>
                    }
                </View>
            )
            :
            (itemState?
                <LinearGradient style={{width:57,height:57,alignItems:'center',justifyContent:'center',borderRadius:100}} colors={!viewed ? ["#cd8cee","#97aaf1"]:['#bcbcbc','#c7c7c7']} >
                    <View style={{width:53,height:53,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:100}}>
                        <Image style={[{width:47,height:47,borderRadius:60,backgroundColor:'#d7d9db'}]} source={!User?{uri:item?.profilePic}:{uri:profileLocation}} />
                    </View>
                </LinearGradient>
            :
                <View style={{width:57,height:57,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:100}}>
                    <Image style={[{width:53,height:53,borderRadius:60,backgroundColor:'#d7d9db'}]} source={!User?{uri:item?.profilePic}:{uri:profileLocation}} />
                </View>
            )      
            }
            <Text numberOfLines={1} style={{fontSize:11,color:'#666666f7'}} >{User?"Your story":item.contactName}</Text>
        </TouchableOpacity>
    );
}

export default StatusObject;

const styles=StyleSheet.create({
    container:{
        alignSelf:'center',
        alignItems:'center',
        marginRight:10,
        // borderWidth:4,
        // borderRadius:60,
        flexDirection:'column',
        maxWidth:58,

    },

})