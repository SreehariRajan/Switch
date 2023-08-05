import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function deleteStatus(statusObject,from,token){
    return axios({
        method:'post',
        url:`${BASE_URL}/deleteStatus`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            from:from,
            statusObject:statusObject
        } 
    })
};