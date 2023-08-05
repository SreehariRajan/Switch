import React from 'react';
import { StyleSheet,View,Text,Image,TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../Colors';
import { Ionicons } from '@expo/vector-icons';

function ReplyPreview({name,selectedReplyMssg,imageUnavailable,userNumber,setImageUnavailable,setSelectedReplyMssg}) {
    return (
        <View style={[styles.replyMssgView]}>
            <View 
            style={styles.MssgViewSub}>
                <View 
                
                style={styles.headerSelectedMssg}>
                    <Text numberOfLines={1} style={styles.selectedMssgUser}>{selectedReplyMssg.from.userNumber===userNumber?"You":name}</Text>
                </View>
                <TouchableOpacity style={{position:'absolute',top:3,right:3,zIndex:5}} onPress={()=>{setSelectedReplyMssg(null);setImageUnavailable(false)}}>
                        <AntDesign name="closecircle" size={15} color={COLORS.primary} />
                </TouchableOpacity>
                {selectedReplyMssg.ImageStatus &&
                        (
                            !imageUnavailable ?
                                <Image
                                    style={{width:50,height:50,marginRight:5,borderRadius:3,position:'absolute',top:4,right:0}} 
                                    source={{uri:selectedReplyMssg.image.location}}
                                    // source={{uri:selectedReplyMssg.image.localUri}}
                                    onError={()=>setImageUnavailable(true)}
                                />
                                :
                                <View style={[styles.imageNotAvailable,{backgroundColor:'white'}]}>
                                    <MaterialIcons name="image-not-supported" size={35} color="gray" />
                                </View>
                        )
                    }
                    {
                        selectedReplyMssg.AudioStatus &&
                            <View style={{width:45,height:45,borderRadius:8,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:5,position:'absolute',top:4,right:0}}>
                                <MaterialIcons name="multitrack-audio" size={30} color={COLORS.primary} />
                            </View>
                    }
                    {
                        selectedReplyMssg.DocumentStatus &&
                            <View style={{width:45,height:45,borderRadius:8,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center',marginRight:5,position:'absolute',top:4,right:0}}>
                                <Ionicons style={[styles.optionSub]} name="document-text" size={30} color={COLORS.primary} />
                            </View>
                    }
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                    <Text numberOfLines={1} style={{width:'80%'}} >
                    {
                        selectedReplyMssg.AudioStatus || selectedReplyMssg.DocumentStatus ?
                        (selectedReplyMssg.audio.name?
                            `${selectedReplyMssg.audio.name}`
                            :
                            `${selectedReplyMssg.document.name}`
                        )
                        :
                        `${selectedReplyMssg.message}`
                    }
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default ReplyPreview;

const styles = StyleSheet.create({
    replyMssgView:{
        // paddingBottom:10,
        paddingLeft:4,
        paddingRight:4,
        paddingTop:4,
        paddingBottom:4,
        zIndex:1,
    }, 
    MssgViewSub:{
        backgroundColor:COLORS.mssgColor,
        height:60,
        borderRadius:10,
        padding:5,
        borderColor:'#e9ebff',
        borderWidth:1
    },
    headerSelectedMssg:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5,
        // position:'absolute',
        // top:3,
        width:"80%"
    },
    selectedMssgUser:{
        color:COLORS.primary,
        fontWeight:'bold',
        fontSize:13
    },
    imageNotAvailable:{
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
        marginBottom:0,
        // margin:5
    },
})