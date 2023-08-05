import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function FetchMessageDemo(from,to,token){
    // console.log("enered")
        return axios({
            method:'get',
            headers:{'Authorization':`Bearer ${token}`},
            url:`${BASE_URL}/getMessageDemo/${from}/${to}`,
        })

};