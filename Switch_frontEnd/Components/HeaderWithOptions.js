import React,{useContext} from 'react';
import { View,StyleSheet,TouchableOpacity, Alert, AsyncStorage,StatusBar,Clipboard,ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../Colors';
import { Context } from '../Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import unstarMssg from '../api/UnstarMssg';
import io from 'socket.io-client';
import {BASE_URL} from '../constants/urls';
import { MaterialIcons } from '@expo/vector-icons';
import FetchSeenLength from '../hooks/useSeenLength';
import deleteMssgs from '../api/DeleteMssgs';
import IndexFinder from '../services/IndexFinder';
import * as SecureStore from 'expo-secure-store';

function HeaderWithOptions({token,newMessageLength,setUnStarredMssg,starredMssgs,setStarredMssgs,setNewMssgLength,mssgArrayPart,mssgArray,setMssgArray,setMssgArrayPart,toNumber,setErr}) {
    const {selectedMssgDetails,replyMssgDetails,selectedMssgArrayDetails,longPressStatusDetails,selectionCheckDetails,userDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser] = userDetails;
    const [selectedMssg,setSelectedMssg]=selectedMssgDetails;
    const [selectedReplyMssg,setSelectedReplyMssg] = replyMssgDetails;
    const [selectedMssgArray,setSelectedMssgArray]=selectedMssgArrayDetails;
    const [selectionCheck,setSelectionCheck]=selectionCheckDetails;
    const [longPressStatus,setLongPressStatus] = longPressStatusDetails ; 
    
    const socket = io.connect(`${BASE_URL}/messageSocket/connect`,{
        auth:{
            token:token
        },
        query:{
            userNumber:userNumber
        }
    });

    const navigation = useNavigation();

    const handleUnstar = async()=>{
        console.log("jhvg",selectedMssg.starredMessage);
        socket.on('connect_error', ()=> {
            setErr(true);
         });
        socket.emit(`changeStarMessageStatus`,
        {from:userNumber,to:toNumber,mssg:selectedMssg},
        async (status)=>{
            if (status===200){
                const index = await IndexFinder(selectedMssg,mssgArray);
                const indexPart = await IndexFinder(selectedMssg,mssgArrayPart);

                var selected = await selectedMssg;
                selected.starredMessage=false;

                var mssges = await mssgArray;
                mssges[index]=await selected;
                var mssgesPart =await  mssgArrayPart;
                mssgesPart[index]=await selected;

                if (index !==-1){
                    setMssgArray(mssges);
                }
                if (indexPart !==-1){
                    setMssgArrayPart(mssgesPart);
                }
                setNewMssgLength(newMessageLength+1);

                const indexStarred = await IndexFinder(selectedMssg,starredMssgs);
                await AsyncStorage.setItem(toNumber+"starredMssgsLength",String(starredMssgs.length-1));
                var selectedStarred = await starredMssgs;
                console.log("index",indexStarred)
                await selectedStarred.splice(indexStarred,1);
                setStarredMssgs(selectedStarred);
                setUnStarredMssg(starred=>!starred);
            }
        }
        
        );
        setSelectedMssg(null);
        setSelectionCheck(false);
        setLongPressStatus(false);
        setSelectedReplyMssg(null);
        setSelectedMssgArray([]);
    };

    const handleDelete = ()=>{
        async function fetchSeenLength(){
            const response =await FetchSeenLength(userNumber,toNumber)
                        .then(async(res)=>{
                            console.log("delete pressed",res.data)
                            if (res.data!=-1){
                                console.log("delete pressed")
                                var indexArray = [];
                                var flag=0;
                                for (var i =0;i<selectedMssgArray.length;i++){
                                    const index = await IndexFinder(selectedMssgArray[i],mssgArray);
                                    await indexArray.push(index);
                                    if (index<res.data || selectedMssgArray[i].from.userNumber!==userNumber){
                                        flag=1
                                        break;
                                    }
                                }
                                console.log("array length",indexArray)
                                if (indexArray.length===selectedMssgArray.length && flag===0){
                                    return(
                                    Alert.alert("Delete","",[
                                        {
                                            text:"delete for me",
                                            onPress:()=>handleHideMssg()
                                        },
                                        {
                                            text:"delete for everyone",
                                            onPress:()=>handleDeleteMssg()
                                        },
                                        {
                                            text:"cancel",
                                        }
                                    ])
                                    )

                                }
                                else{
                                    return(
                                    Alert.alert("Delete","",[
                                        {
                                            text:"delete for me",
                                            onPress:()=>handleHideMssg()
                                        },
                                        {
                                            text:"cancel",
                                        }
                                    ])
                                    )
                                }
                            }
                        })
        }
        fetchSeenLength();
    }

    const handleHideMssg = async()=>{
        console.log("one")
        const deletedMssgArrayString = await AsyncStorage.getItem(toNumber+"deletedMssg");
        var deletedMssgArray = await JSON.parse(deletedMssgArrayString);
        if (!deletedMssgArray){
            deletedMssgArray=[]
        }
        const finalDeletedArray = await deletedMssgArray.concat(selectedMssgArray);
        console.log(finalDeletedArray);
        await AsyncStorage.setItem(toNumber+"deletedMssg",JSON.stringify(finalDeletedArray));
        console.log("two")
        // setSelectedMssg(null);
        setNewMssgLength(lengthof=>lengthof+1);
        setSelectionCheck(false);
        setLongPressStatus(false);
        setSelectedReplyMssg(null);
        setSelectedMssgArray([]);

    }

    const handleDeleteMssg = async()=>{
        console.log("del")
        const token =await SecureStore.getItemAsync('token');
        const response =await deleteMssgs(userNumber,toNumber,selectedMssgArray,token);
       
            
            
                for (var i=0;i<selectedMssgArray.length;i++){
                    const index =await IndexFinder(selectedMssgArray[i],mssgArray);
                    const indexPart =await IndexFinder(selectedMssgArray[i],mssgArrayPart);
                    if (index!==-1){
                        console.log("index1")
                        var mssgList =await mssgArray;
                        await mssgList.splice(index,1);
                        setMssgArray(mssgList)

                    }
                    if (indexPart!==-1){
                        console.log("index2")

                        var mssgListPart =await mssgArrayPart;
                        await mssgListPart.splice(indexPart,1);
                        setMssgArray(mssgListPart);
                    }
                }
                // var selected = mssgArray;
                // selected.starredMessage=false;

                // var mssges = mssgArray;
                // mssges[index]=selected;
                // var mssgesPart = mssgArrayPart;
                // mssgesPart[index]=selected;
                // setSelectedMssg(null);
                setSelectionCheck(false);
                setLongPressStatus(false);
                // setSelectedReplyMssg(null);
                setSelectedMssgArray([]);
                setNewMssgLength(newMessageLength+1);

                

            
        
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={styles.optionDiv1}>
                <TouchableOpacity 
                    // style={styles.option}
                    onPress={()=>{
                        setSelectedMssg(null);
                        setSelectionCheck(false);
                        setLongPressStatus(false);
                        setSelectedReplyMssg(null);
                        setSelectedMssgArray([]);
                    }}

                >
                    <Entypo name="cross" size={25} color={"white"} />
                </TouchableOpacity>
            </View>
            <View style={styles.optionDiv2}>
                {selectedMssgArray.length===1 &&
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={()=>{
                            setSelectedReplyMssg(selectedMssg);
                        }}

                    >
                        <Entypo name="reply" size={25} color={"white"} />
                    </TouchableOpacity>
                }
                {
                    selectedMssg?.starredMessage && selectedMssgArray.length===1 &&
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={()=>{
                            handleUnstar()
                        }}

                        >
                            <MaterialCommunityIcons name="message-bulleted-off" size={25} color={"white"} />
                    </TouchableOpacity>
                }
                {selectedMssgArray.length===1 &&
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={()=>{
                            Clipboard.setString(selectedMssgArray[0].message);
                            ToastAndroid.show("Copied to clipboard",ToastAndroid.SHORT);
                            setSelectedMssg(null);
                            setSelectionCheck(false);
                            setLongPressStatus(false);
                            setSelectedReplyMssg(null);
                            setSelectedMssgArray([]);

                        }}

                    >
                        <MaterialIcons name="content-copy" size={25} color="white" />
                    </TouchableOpacity>
                }
                {selectedMssgArray.length===1 &&
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={()=>{
                            Clipboard.setString(selectedMssgArray[0].message);
                            ToastAndroid.show("Copied to clipboard",ToastAndroid.SHORT);
                            setSelectedMssg(null);
                            setSelectionCheck(false);
                            setLongPressStatus(false);
                            setSelectedReplyMssg(null);
                            setSelectedMssgArray([]);

                        }}

                    >
                        <MaterialIcons name="info-outline" size={25} color="white" />
                    </TouchableOpacity>
                }
                <TouchableOpacity 
                    style={styles.option}
                    onPress={handleDelete}

                >
                    <MaterialIcons name="delete" size={25} color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.option}
                    onPress={()=>{
                        navigation.navigate("ForwardMssgView",{mssgObj:null,TimerMessageDraft:false,setMssgArrayPart:setMssgArrayPart,toNumberFrom:toNumber})
                    }}

                >
                    <Entypo name="forward" size={25} color={"white"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default HeaderWithOptions;

const styles = StyleSheet.create({
    optionDiv2:{
        flexDirection:'row',
        alignItems:'center'
    },
    optionDiv1:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    option:{
        marginLeft:30
    },
    container:{
        width:'100%',
        height:62,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingRight:30,
        paddingLeft:30,
        backgroundColor:COLORS.primary
    }
})