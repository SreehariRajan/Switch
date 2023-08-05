import { useNavigation, useRoute } from '@react-navigation/core';
import React,{useEffect, useRef, useState,useContext} from 'react';
import { StyleSheet, View,TextInput,TouchableOpacity,StatusBar,Text, ScrollView } from 'react-native';
import { COLORS } from '../Colors';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {Context} from '../Context';


function TextMssgDraft() {
    const {userDetails,latestMssgDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const route = useRoute();
    const navigation = useNavigation();
    const {token,date} = route.params;
    const [keyboardOn,setKeyboardOn] = useState(false);
    const [clientMssg,setClientMssg] = useState("");
    const textInputRef = useRef(null);

    useEffect(()=>{
        if (textInputRef.current){
            textInputRef.current.focus();
        }
    },[textInputRef]);

    async function submitMssg(){
        const mssgObj =await {message:clientMssg,starredMessage:false,ImageStatus:false,DocumentStatus:false,AudioStatus:false,audio:{value:null},document:{value:null},image:{value:null},replyStatus:false,forwardStatus:false,repliedFor:{value:null},time:`${date.hours>12?`${date.hours-12}`:`${date.hours}`}.${date.minutes.toString().length<2?`0${date.minutes}`:date.minutes} ${date.hours>=12?"pm":"am"}`,timeObject:date,from:{user:user,userNumber:userNumber}};

        navigation.navigate("ForwardMssgView",
                        {setMssgArrayPart:null,
                            toNumberFrom:null,
                            TimerMessageDraft:true,
                            mssgObj:mssgObj
                        })
    }
    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{justifyContent:'flex-end',flex:1}}  style={{width:'100%',paddingBottom:10}}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Ionicons style={{marginRight:20}} name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{fontSize:18,color:'white'}}>Text message</Text>
            </View>
            <View style={styles.inputDiv}>
                
                <View style={[styles.inputDivSub,{width:'80%',backgroundColor:'white',flexDirection:'row',alignItems:'center'}]}>
                    <TextInput 
                        ref={textInputRef}
                        textAlignVertical="top"
                        onFocus={()=>setKeyboardOn(true)}
                        onBlur={()=>{console.log("popopopppppppppppppppppppppppppppppppp");setKeyboardOn(false)}}
                        style={[styles.textInput]}
                        value={clientMssg}
                        multiline={true}
                        numberOfLines={15}
                        placeholder="Type"
                        onChangeText={(mssg)=>{
                            setClientMssg(mssg);
                            }
                        }
                        onSubmitEditing={()=>submitMssg()}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.send}
                    onPress={()=>submitMssg()}
                >
                   <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default TextMssgDraft;

const styles = StyleSheet.create({
    header:{
        width:'100%',
        padding:20,
        backgroundColor:COLORS.primary,
        position:'absolute',
        top:0,
        flexDirection:'row',
        alignItems:"center",
        marginBottom:20
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
        // height:47,
        borderColor:null,
        borderRadius:8,
        padding:20,
        fontSize:17,
        backgroundColor:'white',
        lineHeight:22,
        width:'90%',
        justifyContent:'flex-start'
    },
})