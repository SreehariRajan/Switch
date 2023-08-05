import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function unstarMssg(from,to,mssg,token){
    console.log("nnnnnnnnnnnnnnnnnnnnn",)
    axios({
        method:'post',
        url:`${BASE_URL}/unstarMssg`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            from:from,
            to:to,
            mssg:mssg
        } 
    })
};