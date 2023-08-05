import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function deleteTimmerMssgs(mssg,userNumber,token){
    axios({
        method:'post',
        url:`${BASE_URL}/deleteTimmerMssgs`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            mssg:mssg,
            userNumber:userNumber,
        } 
    })
};