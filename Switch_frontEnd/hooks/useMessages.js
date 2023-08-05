import { useState,useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function FetchMessages(from,to,lengthofArray,token){
    // console.log("enered")
        return axios({
            method:'get',
            headers:{'Authorization':`Bearer ${token}`},
            url:`${BASE_URL}/getMessages/${from}/${to}/${lengthofArray}`,
        })

};

// export const AWS_BUCKET_NAME_PHOTOS="connectin-photos";
// export const AWS_ACCESS_KEY="AKIA2ZZJJWYIRQRQRBAY";
// export const AWS_SECRET_KEY="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";