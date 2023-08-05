import React,{useEffect} from 'react';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native';
import { View,StyleSheet,Text,BackHandler } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../Colors';
import { ImageBackground,Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ContactsProfile(){
    const route=useRoute();
    const {name,tonumber,imageUri,starredMssgs,userNumber,user,setStarredMssgShow,handleInfiniteScrolling,mssgArray,mssgArrayPart,setMssgArrayPart,ScrollRef}=route.params;
    const navigation = useNavigation();

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
            <TouchableOpacity
             onPress={()=>navigation.navigate("ImagePreview",{time:null,name:name,tonumber:null,setMssgArray:null,setMssgArrayPart:null,setNewMssgLength:null,fromChatScreen:true,image:{location:imageUri},fileObject:null})}
            >
                <ImageBackground
                    resizeMode="contain"
                    source={!imageUri?require('../assets/download.jpg'):{uri:imageUri}} 
                    style={styles.profilePic}>
                    <TouchableOpacity
                        style={{marginTop:10,}}
                        onPress={()=>navigation.goBack()}
                    >
                        <Entypo name="cross" size={30} color='white' />
                    </TouchableOpacity>
                    <View style={styles.nameNumberView}>
                        <Text style={styles.name}>{` ${name}`}</Text>
                        <Text style={styles.number}>{`  ${tonumber} `}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
            <View style={styles.options}>
                <Text style={{width:'100%',alignItems:'center',justifyContent:'center',paddingLeft:20,fontSize:20,padding:10,paddingBottom:0,color:COLORS.primary,marginBottom:10}}>Media</Text>
                <TouchableOpacity 
                    style={styles.option}
                    onPress={()=>navigation.navigate("StarredMssgView",
                        {
                        fromProfile:true,
                        name:name,               
                        starredMssgs:starredMssgs,
                        toNumber:tonumber,
                        userNumber:userNumber,
                        user:user,
                        mssgArrayPart:mssgArrayPart,
                        setMssgArrayPart:setMssgArrayPart,
                        handleInfiniteScrolling:handleInfiniteScrolling,
                        mssgArray:mssgArray,
                        ScrollRef:ScrollRef,
                        })}
                >
                    <MaterialCommunityIcons name="message-alert" size={25} color={COLORS.primary} />
                    <Text style={{fontSize:17,marginLeft:10}}>Important Messages</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    option:{
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        width:'100%',
        paddingLeft:20,
    },
    nameNumberView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        marginBottom:10
    },
    name:{
        fontSize:24,
        color:'white',
        textShadowColor:'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textShadowRadius:10
    },
    number:{
        fontSize:10,
        color:'white',
        textShadowColor:'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    },
    options:{
        flexDirection:'column',
        alignItems:'flex-start',
        backgroundColor:'white'
    },
    profilePic:{
        // flex:0.45,
        width:Dimensions.get('screen').width,
        height:Dimensions.get('screen').width,
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'space-between',
        paddingLeft:20,
        paddingRight:20,

    },
    container:{
        flex:1,
        flexDirection:'column',
        width:'100%',
        backgroundColor:'white'
    }
})