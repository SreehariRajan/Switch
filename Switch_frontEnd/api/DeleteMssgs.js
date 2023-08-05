import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function deleteMssgs(from,to,mssgList,token){
    axios({
        method:'post',
        url:`${BASE_URL}/deleteMssgs`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            from:from,
            to:to,
            mssgList:mssgList
        } 
    })
};