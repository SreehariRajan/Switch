import React, { useState,useEffect } from 'react';
import { StatusBar, StyleSheet, View,Text,KeyboardAvoidingView,BackHandler,TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { COLORS } from '../Colors';
import AttachOptionsView from './AttachOptionsView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import forwardMssg from '../services/forwardMssg';
import ChatScreenBg from '../svg/ChatScreenBg';
import ChatBg from '../assets/ChatBg.svg';
import AlertView from './AlertView';
import { MaterialIcons } from '@expo/vector-icons';

function TimerMessageDraft() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [err,setErr]= useState(false);
    // const [date,setDate] = useState({
    //     date:1,
    //     month:1,
    //     year:2020
    // });
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedMssgArray,
        selectedContacts,
        toNumberFrom,
        setSelectedMssgArray,
        fromForwardView} = route.params;

    console.log("date,da",typeof(date))
    const [time,setTime] = useState({
        hour:"1",
        minutes:"1",
        amOrpm:"am"
    });
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
    
      const showTimepicker = () => {
        showMode('time');
      }
    
      useEffect(() => {
        const handleClose = ()=>{
            navigation.goBack();
            return true;
            
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress',handleClose);

        return ()=>backHandler.remove()

    }, [])


    const monthObject={1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sept",10:"Oct",11:"Nov",12:"Dec"};
    return (
        // <View style={styles.container}>
        // <ImageBackground source={<ChatBg />} style={styles.container}>
        <ImageBackground source={require('../assets/images/lightBg.png')} style={styles.container}>
            {
            err && 
            <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"Something went wrong"} subContent={"message not sent"} />
            }
        {/* <ChatScreenBg style={{position:'absolute',height:10,backgroundColor:'transparent'}}/> */}
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Ionicons style={{marginRight:20}} name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{fontSize:18,color:'white'}}>Timer messaging</Text>
            </View>
            <View style={{paddingTop:20,width:'100%',alignItems:'center',flexDirection:'column'}}>
                {/* <Text>Select Time and date</Text> */}
                <View style={{flexDirection:"column",width:'100%',justifyContent:'center',alignItems:'center',marginBottom:50}}>
                    <LinearGradient style={{width:200,height:200,borderRadius:100,marginBottom:10,justifyContent:'center',alignItems:'center'}} colors={["white","white"]}>
                        <TouchableWithoutFeedback onPress={()=>showTimepicker()} style={styles.clockView}>
                            <View style={{flexDirection:"row",alignItems:'center'}}>
                                <Text style={{fontSize:30,marginRight:3,fontWeight:'bold'}}>{date.getHours()>12?date.getHours()-12:(date.getHours()===0?12:date.getHours())}</Text >
                                <Text style={{fontSize:30,marginRight:3,fontWeight:'bold'}}>:</Text>
                                <Text style={{fontSize:30,marginRight:3,fontWeight:'bold'}}>{String(date.getMinutes()).length<2?`0${date.getMinutes()}`:date.getMinutes()}</Text >
                            </View>
                            <Text style={{fontSize:20,position:'absolute',bottom:40,marginRight:3,color:'gray'}}>{date.getHours()>12?"pm":"am"}</Text >
                        </TouchableWithoutFeedback>
                    </LinearGradient>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={false}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    <TouchableOpacity onPress={()=>showDatepicker()} style={{marginRight:5,flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:25,color:"#5f5f5f"}}>{String(date.getDate()).length<2?`0${date.getDate()}`:date.getDate()} </Text>
                        <Text style={{fontSize:25,color:"#5f5f5f"}}>{monthObject[date.getMonth()+1]} </Text>
                       <Text style={{fontSize:25,color:"#5f5f5f"}}>{String(date.getFullYear()).length<2?`0${date.getFullYear()}`:date.getFullYear()}</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
            {/* <Text>Select a method</Text> */}
            {fromForwardView?
                <TouchableOpacity
                    style={styles.forward}
                    onPress={()=>{
                        const PresentDate=new Date();
                        if (PresentDate<date)
                            forwardMssg(selectedMssgArray,selectedContacts,null,null,toNumberFrom,setSelectedMssgArray,true,date,setErr);
                        else
                        return Alert.alert("Enter a valid time and date");
                    }}
                >
                    <Entypo name="forward" size={30} color="white" />
                </TouchableOpacity>
            :
                <AttachOptionsView dateFull={date} date={{year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate(),hours:date.getHours(),minutes:date.getMinutes(),seconds:date.getSeconds()}} TimerMessageDraft={true} />}
        </ImageBackground>
    );
}


export default TimerMessageDraft;

const styles = StyleSheet.create({
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
    container:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center',
        width:'100%',
        // justifyContent:'center'
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
    clockView:{
        flexDirection:"column",
        backgroundColor:'white',
        borderRadius:100,
        height:180,
        width:180,
        alignItems:'center',
        justifyContent:'center',
        elevation:10
    }
})