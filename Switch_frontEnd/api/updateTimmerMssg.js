import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function updateTimmerMssg(userNumber,mssg,newMssg,token){
    console.log("nnnnnnnnnnnnnnnnnnnnn",newMssg)
    await axios({
        method:'post',
        url:`${BASE_URL}/updateTimmerMssg`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            mssg:mssg,
            userNumber:userNumber,
            newMssg:newMssg
        } 
    })
};