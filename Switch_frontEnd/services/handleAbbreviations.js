import React from 'react';
import { abbreviationArray, abbreviationObj } from '../constants/Abbreviations';

function handleAbbreviations(message) {
    // console.log(message)
    var newMessage = "";
    const wordsList = message.split(" ");
    wordsList.forEach((word,index)=>{
        if (abbreviationArray.includes(word.toUpperCase())){
            const expansion = abbreviationObj[word.toUpperCase()];
            if (index!==wordsList.length-1){ 
                newMessage=newMessage+expansion+" ";
            }
            else{
                newMessage=newMessage+expansion; 
            }
            
            console.log(newMessage,"new")
        }
        else{
            newMessage = newMessage.concat(word+" ");
        }
    })
    // console.log(newMessage)
    return newMessage;
}

export default handleAbbreviations;