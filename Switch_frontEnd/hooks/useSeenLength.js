import { useState,useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function FetchSeenLength(from,to,token){
    console.log("enered seen length ")
        return axios({
            method:'get',
            headers:{'Authorization':`Bearer ${token}`},
            url:`${BASE_URL}/getSeenLength/${from}/${to}`,
        })

};