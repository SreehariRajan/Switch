import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function updateAcc(numberText,name,imageLocation,token){
    console.log("po")
    return axios({
        method:'post',
        url:`${BASE_URL}/updateAcc`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            phoneNumber:`${numberText}`,
            userName:name,
            imageLocation:imageLocation
        } 
    })
};