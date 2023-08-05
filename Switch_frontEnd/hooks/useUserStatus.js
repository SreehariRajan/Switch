import { useState,useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function FetchUserStatus(from,token){
    console.log("enered")
        return axios({
            method:'get',
            headers:{'Authorization':`Bearer ${token}`},
            url:`${BASE_URL}/getUserStatus/${from}`,
        })

};