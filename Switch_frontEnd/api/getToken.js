import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function getToken(numberText,token,refreshToken){
    // console.log("nnnnnnnnnnnnnnnnnnnnn",token)
    axios({
        method:'post',
        url:`${BASE_URL}/getToken`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${refreshToken}`},
        data:{
            phoneNumber:`${numberText}`,
            token:token,
        } 
    })
};