import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function createAccount(numberText,name,imageLocation){
    console.log("nnnnnnnnnnnnnnnnnnnnn",)
    return axios({
        method:'post',
        url:`${BASE_URL}/createAcc`,
        headers:{'Content-Type':'application/json'},
        data:{
            phoneNumber:"+91"+numberText,
            userName:name,
            imageLocation:imageLocation
        } 
    })
};