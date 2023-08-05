import React,{useEffect} from 'react';
import { StyleSheet,BackHandler, View,TouchableOpacity,Text, ImageBackground, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';

import { useNavigation,useRoute } from '@react-navigation/native';
import { COLORS } from '../Colors';
import MssgDiv from './MssgDiv';

function StarredMssgView(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const {fromProfile,name,starredMssgs,toNumber,userNumber,user,setStarredMssgShow,handleInfiniteScrolling,mssgArray,mssgArrayPart,setMssgArrayPart,ScrollRef} = route.params;
    console.log(starredMssgs,"starrred");
    useEffect(() => {
        async function saveLength(){
            console.log("viewing",starredMssgs.length)
            await AsyncStorage.setItem(toNumber+"starredMssgsLength",String(starredMssgs.length));
        }
        saveLength();
    }, [starredMssgs,toNumber]);

    useEffect(() => {
        const handleCloseMenuScreen = ()=>{
                navigation.goBack();
                return true;  
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleCloseMenuScreen);

        return ()=>backHandler.remove();

    }, []);

    return (
        <View style={styles.container}>
            <View style={{width:'100%',padding:20,backgroundColor:COLORS.primary,flexDirection:'row',alignItems:"center"}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{flexDirection:'row',alignItems:'flex-end',}}>
                    <Text style={{fontSize:18,color:'white',marginLeft:20}}>Important messages</Text>
                    <Text numberOfLines={1} style={{fontSize:12,color:'white',marginLeft:20,maxWidth:80,}}>{`${name}`}</Text>
                    <Text numberOfLines={1} style={{fontSize:12,color:'white'}}>'s chat</Text>
                </View>
            </View>
            <ImageBackground style={{flex:1,width:'100%',paddingBottom:10}} source={require('../assets/images/chatScreenBg.png')}>
                {starredMssgs.length>0?
                    <FlatList 
                        style={{width:'100%',height:'100%'}}
                        data={starredMssgs}
                        renderItem={({item,index})=>
                            <MssgDiv
                                fromProfile={fromProfile}
                                starredMssgsView={true}
                                setStarredMssgShow={setStarredMssgShow}
                                handleInfiniteScrolling={handleInfiniteScrolling} 
                                mssg={item} 
                                notificationNumber={null}                               
                                starredMssgs={null}
                                setStarredMssgs={null}
                                mssgArrayPart={mssgArrayPart} 
                                setMssgArrayPart={setMssgArrayPart}
                                handleInfiniteScrolling={handleInfiniteScrolling} 
                                mssgArray={mssgArray} 
                                ScrollRef={ScrollRef} 
                                // toUser={name} 
                                toNumber={toNumber}  
                                index={index} 
                                userNumber={userNumber} 
                                lengthofArray={mssgArray.length}      
                                user={user} 
                        />        
                        }
                        keyExtractor={(item,index)=>index.toString()}
                    />
                    :
                    <Text style={{color:'white',fontSize:17,width:'100%',textAlign:'center',marginTop:50}}>No important messages yet...</Text>
                }
            </ImageBackground>
        </View>
    );
}

export default StarredMssgView;

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
    }
})