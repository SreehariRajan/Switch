import React, { useEffect, useState} from 'react';
import { View,StyleSheet,Text} from 'react-native';
import { useContext } from 'react';
import {Context} from '../Context';
import * as SecureStore from 'expo-secure-store';
import CreateAccount from './CreateAccount';
import ChatMenuScreen from './ChatMenuScreen';
import {COLORS} from '../Colors';

import * as MediaLibrary from 'expo-media-library';
import OtpVerification from './OtpVerification';
import LoadingView from './LoadingView';
import getToken from '../api/getToken';


function LandingPage() {
    
    const {userDetails,tokenDetails} = useContext(Context);
    const [userNumber,setUserNumber,user,setUser]=userDetails;
    const [token,setToken] = tokenDetails;
    const [loading,setLoading] = useState(true);
    async function fetchDetails(){
        // SecureStore.setItemAsync('phoneNumber',"");
        // SecureStore.setItemAsync('userName',"");
        // SecureStore.setItemAsync('token',"");
        let number = await SecureStore.getItemAsync('phoneNumber');
        let user = await SecureStore.getItemAsync('userName');
        const tokenfetched = await SecureStore.getItemAsync('token');
        // const refreshTokenfetched = await SecureStore.getItemAsync('refreshToken');
        if (tokenfetched){
            // if (tokenfetched){
            //     const response = await getToken(number,token,refreshTokenfetched)
            //         .then(async(res)=>{
            //             if (res){
            //                 if (res.status===200){
            //                     if (res.data.token && res.data.refreshToken){
            //                         setToken(res.data.token);
            //                         await SecureStore.setItemAsync("refreshToken",res.data.refreshToken);
            //                     }
            //                 }

            //             }
            //         })

            // }
            // else{
                setToken(tokenfetched)
            // }
        };

        setUserNumber(number);
        setUser(user); 
        setLoading(false);
    };

    async function AskPermissions(){
        const mediaPermission = await MediaLibrary.requestPermissionsAsync(false);
    };
   
    useEffect(()=>{
        AskPermissions();
        fetchDetails();
    },[]);

    return (
        <View style={styles.container}>

            {
                !loading?
            (userNumber && user && token.length!=="")?
                <ChatMenuScreen token={token} />
                :
                <CreateAccount />
                // <OtpVerification />
                :
                <LoadingView />
            }
            {/* <CreateAccount /> */}
        </View>
    );
}
export default LandingPage;

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    }
})