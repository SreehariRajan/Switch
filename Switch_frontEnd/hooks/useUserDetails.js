import { useState,useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function checkUserExist(userNumber){
    console.log("enered")
        return axios({
            method:'get',
            url:`${BASE_URL}/getUser/+91${userNumber}`,
        })

};