import { useNavigation, useRoute } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React,{useState,useEffect} from 'react';
import { View,StyleSheet,Text,TouchableOpacity,StatusBar, Keyboard} from 'react-native';
import verifyOTP from '../api/verifyOtp';
import { COLORS } from '../Colors';
import OtpInput from './OtpInput';
import sendOtp from '../api/sendOtp';
import NetInfo from '@react-native-community/netinfo';

import { Ionicons } from '@expo/vector-icons';
import LoadingView from './LoadingView';
import AlertView from './AlertView';

import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


function OtpVerification(props) {

    const [online,setOnline] = useState(true);
    const [pastOnlineStatus,setPastOnlineStatus] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const {phoneNumber} = route.params;
    const [resend,setResend] = useState(false);
    const [otp,setOtp]=useState("");
    const [mssg,setMssg]=useState("");
    const [loading,setLoading] = useState(false);
    const [show,setShow] = useState(false);

    const handleResendOtp = async()=>{
        setLoading(true);
        const response = await sendOtp(phoneNumber)
                .then((res)=>{
                    setLoading(false);
                    if (res.status===200){
                        if (res.data?.message === "OTP send successfully"){
                            setMssg(res.data.message);
                        }
                    }
                    else{
                        setMssg("Failed to send OTP");
                    }
                })
    }

    const verifyOtp = async()=>{
        setMssg("");
        setLoading(true);
        Keyboard.dismiss();
        const response = await verifyOTP(phoneNumber,otp)
            .then((res)=>{
                setLoading(false);
                if (res.status===200){
                    if (res.data){
                        console.log("succsess",res.data.message)
                        if (res.data.message==="verified"){
                            setMssg("OTP verified")
                            setTimeout(()=>{setOtp("");navigation.navigate("AddUserDetails",{phoneNumber:phoneNumber})},1000);    
                        }
                        else if(res.data?.message){
                            setMssg(res.data.message)
                        }
                        else{
                            setMssg("Something went wrong")
                        }
                    }
                }
                else{
                    setMssg("Oops something went wrong")
                }
            })
    }
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
        
        <View style={{flex:1,alignItems:'center',width:'100%',backgroundColor:'white'}}>
             <StatusBar backgroundColor={'white'} barStyle="dark-content" />
            {loading &&
                <LoadingView />
            }
            {!pastOnlineStatus && online &&
                <AlertView icon={<Ionicons name="cellular-sharp" size={26} color="green" />} content={"Back to Online"} />
            }
            {!online &&
                <AlertView icon={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" size={26} color="orange" />} content={"You are Offline"} />
            }

             {show && mssg.length>0 &&
                <AlertView 
                icon={
                    mssg==="OTP expired"?
                        <Ionicons name="timer-sharp" size={26} color="orange" />
                        :
                        mssg==="OTP verified" || mssg==="OTP send successfully" ?
                                <AntDesign name="checkcircle" size={26} color="green" />
                            :
                                <AntDesign name="exclamationcircle" size={26} color="red" />
            } 
            content={mssg} />
            }
             <View style={{width:'100%',flexDirection:'row',alignItems:'flex-start',padding:20}}>
                 <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={COLORS.primary} />
                 </TouchableOpacity>
             </View>
            <View style={{alignItems:'center',flexDirection:'column',alignItems:'center',width:'95%'}}>
                <Text style={{color:'black',fontSize:24,fontWeight:'bold',marginBottom:20}}>OTP verification</Text>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:'100%',marginBottom:20}}>
                    <Text style={{color:'black',fontSize:15}}>Enter the OTP sent to </Text>
                    <Text style={{color:'black',fontSize:15,fontWeight:'bold'}}>{`+91-${phoneNumber}`}</Text>
                </View>
                <OtpInput setOtp={setOtp} />

               <Text style={{marginTop:20}}>Didn't receive an OTP?</Text>
                <TouchableOpacity onPress={handleResendOtp} style={{marginTop:10}}>
                    <Text style={{color:COLORS.primary,textDecorationLine:'underline',fontWeight:'bold',}}>RESEND OTP</Text>
                </TouchableOpacity>
                <LinearGradient 
                    start={{x:0,y:0}} 
                    end={{x:1,y:0}} 
                    style={[styles.submit,(otp.length<5 || !online) && {borderColor:COLORS.primary,borderWidth:1,borderRadius:7}]}
                    colors={(otp.length===5 && online )?[COLORS.primary,COLORS.secondary]:["white","white"]}>
                        <TouchableOpacity 
                            disabled={otp.length<5 || !online ?true:false}
                            style={{width:'100%',alignItems:'center'}}
                            onPress={verifyOtp}
                        >
                            <Text style={[styles.submitText,(otp.length===5 && online) ?{color:"white"}:{color:COLORS.primary}]}>VERIFY</Text>
                        </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    );
}

export default OtpVerification;

const styles = StyleSheet.create({
    submitText:{
        fontSize:16
    },
    submit:{
        padding:12,
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:7,
        marginTop:20
    },
    borderStyleBase: {
      width: 30,
      height: 45
    },
   
    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },
   
    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
    },
   
    underlineStyleHighLighted: {
      borderColor: "#03DAC6",
    },
  });