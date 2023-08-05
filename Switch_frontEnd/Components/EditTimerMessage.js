import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useState,useContext,useRef } from 'react';
import { View,StyleSheet,StatusBar,Text,Image, Alert, ImageBackground } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Context } from '../Context';
import { MaterialIcons } from '@expo/vector-icons';
import {COLORS} from '../Colors';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import updateTimmerMssg from '../api/updateTimmerMssg';
import deleteTimmerMssgs from '../api/deleteTrimmerMssgs';
import { LinearGradient } from 'expo-linear-gradient';
import MssgDiv from './MssgDiv';
import * as SecureStore from 'expo-secure-store';

// import { Audio } from 'expo-av';

function EditTimerMessage() {
    const route = useRoute();
    const navigation = useNavigation();
    const {mssg} = route.params;

    const [date, setDate] = useState(new Date());
    const [initialDate, setInitialDate] = useState(new Date());
    const {contactsDetails} = useContext(Context);
    const [contacts,setContacts] = contactsDetails;
    const [imageAvailable,setImageAvailable] = useState(true);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [stringMssg,setStringMssg] = useState();
    const [changed,setChanged] = useState(false);
    const textInputRef = useRef(null);
    const [playing,setPlaying] = useState(false);
    const [alteringMssg,setAlteringMssg]=useState(mssg);
    useEffect(()=>{
        const dateObj = new Date();
        dateObj.setHours(mssg.timeObject.hours);
        dateObj.setMinutes(mssg.timeObject.minutes);
        dateObj.setSeconds(mssg.timeObject.seconds);
        dateObj.setDate(mssg.timeObject.day);
        dateObj.setMonth(mssg.timeObject.month-1);
        dateObj.setFullYear(mssg.timeObject.year);
        setDate(dateObj);
        setInitialDate(dateObj);
        setStringMssg(mssg.message);
        console.log(dateObj)
    },[mssg]);

    const monthObject={1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sept",10:"Oct",11:"Nov",12:"Dec"};
    console.log(initialDate,date,changed)
    const handleSubmit = async()=>{
        // setAlteringMssg(mssg=>({...mssg,timeObject:{
        //     hours:date.getHours(),
        //     month:date.getMonth()+1,
        //     year:date.getFullYear(),
        //     minutes:date.getMinutes(),
        //     seconds:date.getSeconds(),
        //     day:date.getDate()
        // }}))
        const token = await SecureStore.getItemAsync('token');
        updateTimmerMssg(mssg.from.userNumber,mssg,alteringMssg,token);
        navigation.navigate("ChatMenu")
        // navigation.navigate("ChatMenu");
    }
    const handleCancel = ()=>{
        // candel here
        navigation.navigate("ChatMenu")
    }
    const handleDelete = ()=>{
        // candel here
        Alert.alert("Are you sure","",[
            {
                text:"yes",
                onPress:async()=>{
                    const token =await SecureStore.getItemAsync('token');
                    deleteTimmerMssgs(mssg,mssg.from.userNumber,token);
                    navigation.navigate("ChatMenu")
                }
            },
            {
                text:"no",
            }
        ])
        
    }
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

      useEffect(()=>{
        setAlteringMssg(mssg=>({...mssg,time:`${date.getHours()>12?`${date.getHours()-12}`:`${date.getHours()}`}.${date.getMinutes().toString().length<2?`0${date.getMinutes()}`:date.getMinutes()} ${date.getHours()>=12?"pm":"am"}`,timeObject:{
            hours:date.getHours(),
            month:date.getMonth()+1,
            year:date.getFullYear(),
            minutes:date.getMinutes(),
            seconds:date.getSeconds(),
            day:date.getDate()
        }}))
        if (date !==initialDate){
            setChanged(true)
        }
        else{
            setChanged(false)
        }
    },[date])
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
             <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{fontSize:18,color:'white'}}>Edit message</Text>
                <TouchableOpacity 
                    style={styles.option}
                    onPress={handleDelete}

                >
                    <MaterialIcons name="delete" size={25} color={"white"} />
                </TouchableOpacity>
            </View>
            <ImageBackground source={require('../assets/images/lightBg.png')} style={{backgroundColor:'white',paddingTop:20,flex:1,width:'100%'}} >
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
                <ScrollView contentContainerStyle={{alignItems:'center'}} style={{width:'100%'}}>
                    <View style={{flexDirection:'row',alignItems:'flex-end',width:'90%',justifyContent:'flex-end',padding:10}}>
                        {/* <Text>Sent</Text> */}
                        <Text style={{fontSize:18,paddingLeft:5,fontWeight:'bold'}}>{contacts[contacts.findIndex((ele,ind)=>ele.phoneNumber===mssg?.to.userNumber)]?.name}</Text>
                    </View>
                    <TouchableOpacity onPress={showTimepicker} style={{flexDirection:'row',alignItems:'center',padding:10,width:'90%',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <FontAwesome name="clock-o" size={20} color="gray" />
                            {/* <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginLeft:5}}>{mssg.time}</Text> */}
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginLeft:5}}>{date.getHours()>12?date.getHours()-12:(date.getHours()===0?12:date.getHours())}</Text>
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginLeft:5}}>:</Text>
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginLeft:5}}>{String(date.getMinutes()).length<2?`0${date.getMinutes()}`:date.getMinutes()}</Text >
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginLeft:5}}>{date.getHours()>12?"pm":"am"}</Text >
                                
                        </View>
                        <Entypo  name="edit" size={20} color="#636363" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showDatepicker} style={{padding:10,flexDirection:'row',alignItems:'center',width:'90%',justifyContent:'space-between',marginTop:10}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <FontAwesome name="calendar" size={20} color="gray" />
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4,marginLeft:5}}>{String(date.getDate()).length<2?`0${date.getDate()}`:date.getDate()} </Text>
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4}}>{monthObject[date.getMonth()+1]} </Text>
                        <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4}}>{String(date.getFullYear()).length<2?`0${date.getFullYear()}`:date.getFullYear()}</Text>
                        

                            {/* <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4,marginLeft:5}}>{mssg.timeObject.day}</Text>
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4}}>{monthObject[mssg.timeObject.month]}</Text>
                            <Text style={{fontSize:15,color:"#636363",fontWeight:'bold',marginRight:4}}>{mssg.timeObject.year}</Text> */}
                        </View>
                        <Entypo  name="edit" size={20} color="#636363" />
                    </TouchableOpacity>
                    <View style={{width:'90%',alignItems:'center',backgroundColor:'white',borderRadius:8,paddingTop:20,paddingBottom:20,marginTop:10}}>
                    {(mssg.AudioStatus || mssg.DocumentStatus || mssg.ImageStatus) &&
                        <MssgDiv
                            TimerMessagesEditView={true}
                            setStarredMssgShow={null}
                            // handleInfiniteScrolling={handleInfiniteScrolling} 
                            mssg={mssg} 
                            notificationNumber={null}                               
                            starredMssgs={null}
                            setStarredMssgs={null}
                            // mssgArrayPart={mssgArrayPart} 
                            // setMssgArrayPart={setMssgArrayPart}
                            // handleInfiniteScrolling={handleInfiniteScrolling} 
                            // mssgArray={mssgArray} 
                            // ScrollRef={ScrollRef} 
                            // toUser={name} 
                            toNumber={mssg.to.userNumber}  
                            index={null} 
                            userNumber={mssg.from.userNumber} 
                            // lengthofArray={mssgArray.length}      
                            user={mssg.from.user} 
                    />   }


                    <TouchableOpacity onPress={()=>{textInputRef.current?.focus()}} style={{flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
                        <TextInput 
                            multiline={true}
                            ref={textInputRef}
                            style={{paddingLeft:10,width:'90%',paddingRight:10,fontSize:16}}
                            value={alteringMssg.message}
                            onChangeText={(e)=>{setAlteringMssg(mssg=>({...mssg,message:e}));if(alteringMssg.message!==mssg.message){setChanged(true)}}}
                        />
                        <Entypo  name="edit" size={20} color="#636363" />
                    </TouchableOpacity>
                    </View>
                    {changed &&
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:20,width:'90%',justifyContent:'flex-end'}}>
                            <TouchableOpacity  onPress={handleCancel}>
                                <Text style={{fontSize:18}}>cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:20}} onPress={handleSubmit}>
                                <Text style={{fontSize:18}}>submit</Text>
                            </TouchableOpacity>
                            
                        </View>
                    }
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

export default EditTimerMessage;

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    header:{
        width:'100%',
        padding:20,
        backgroundColor:COLORS.primary,
        // position:'absolute',
        // top:0,
        flexDirection:'row',
        alignItems:"center",
        flexDirection:'row',
        justifyContent:'space-between'
    },
    image:{
        width:200,
        height:200,
        margin:5,
        // marginBottom:0,
        borderRadius:8,
    },
})