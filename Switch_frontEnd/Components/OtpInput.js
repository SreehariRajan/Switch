import React, { useRef,useState,useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { COLORS } from '../Colors';

function OtpInput({setOtp}) {
    const inputOne = useRef(null);
    const inputTwo = useRef();
    const inputThree = useRef();
    const inputFour = useRef();
    const inputFive = useRef();

    

    const [input1,setInput1] = useState("");
    const [input2,setInput2] = useState("");
    const [input3,setInput3] = useState("");
    const [input4,setInput4] = useState("");
    const [input5,setInput5] = useState("");

    const [focus1,setFocus1] = useState(false);
    const [focus2,setFocus2] = useState(false);
    const [focus3,setFocus3] = useState(false);
    const [focus4,setFocus4] = useState(false);
    const [focus5,setFocus5] = useState(false);


    useEffect(() => {
        if (input1?.length>=0 && input2?.length>=0 && input3?.length>=0 && input4?.length>=0 && input5?.length>=0){
            setOtp(input1+input2+input3+input4+input5);
        }
    }, [input1,input2,input3,input4,input5]);

    useEffect(()=>{
        inputOne.current?.focus();
        
    },[inputOne.current]);

    return (
       <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
           <TextInput
                maxLength={1}
                onFocus={()=>setFocus1(true)} 
                onBlur={()=>setFocus1(false)} 
                value={input1} 
                onChangeText={(e)=>{if(e.length>0){inputTwo.current?.focus()};if(e.length<=1)setInput1(e)}} 
                keyboardType="number-pad" ref={inputOne} 
                style={[styles.inputs,focus1?{borderColor:COLORS.primary}:{borderColor:'transparent'}]} 
            />
           <TextInput
                maxLength={1}
                onFocus={()=>setFocus2(true)} 
                onBlur={()=>setFocus2(false)} 
                value={input2} 
                onChangeText={(e)=>{if(e.length>0){inputThree.current?.focus()};if(e.length<=1)setInput2(e)}} 
                onKeyPress={({nativeEvent})=>{if (nativeEvent.key==='Backspace'){if (input2.length===0){inputOne.current?.focus()}}}} 
                keyboardType="number-pad" 
                ref={inputTwo} 
                style={[styles.inputs,focus2?{borderColor:COLORS.primary}:{borderColor:'transparent'}]} 
           />
           <TextInput
                maxLength={1}
                onFocus={()=>setFocus3(true)} 
                onBlur={()=>setFocus3(false)} 
                value={input3} 
                onChangeText={(e)=>{if(e.length>0){inputFour.current?.focus()};if(e.length<=1)setInput3(e)}} 
                onKeyPress={({nativeEvent})=>{if (nativeEvent.key==='Backspace'){if (input3.length===0){inputTwo.current?.focus()}}}}  
                keyboardType="number-pad" 
                ref={inputThree} 
                style={[styles.inputs,focus3?{borderColor:COLORS.primary}:{borderColor:'transparent'}]} 
           />
           <TextInput
                maxLength={1}          
                onFocus={()=>setFocus4(true)} 
                onBlur={()=>setFocus4(false)} 
                value={input4} 
                onChangeText={(e)=>{if(e.length>0){inputFive.current?.focus()};if(e.length<=1)setInput4(e)}} 
                onKeyPress={({nativeEvent})=>{if (nativeEvent.key==='Backspace'){if (input4.length===0){inputThree.current?.focus()}}}}   
                keyboardType="number-pad" 
                ref={inputFour} 
                style={[styles.inputs,focus4?{borderColor:COLORS.primary}:{borderColor:'transparent'}]} 
           />
           <TextInput
                maxLength={1}
                onFocus={()=>setFocus5(true)} 
                onBlur={()=>setFocus5(false)} 
                value={input5} 
                onChangeText={(e)=>{if(e.length<=1){setInput5(e)}}} 
                onKeyPress={({nativeEvent})=>{if (nativeEvent.key==='Backspace'){if (input5.length===0){inputFour.current?.focus()}}}}  
                keyboardType="number-pad" 
                ref={inputFive} 
                style={[styles.inputs,focus5 ?{borderColor:COLORS.primary}:{borderColor:'transparent'}]} 
           />
       </View>
    );
}

export default OtpInput;

const styles = StyleSheet.create({
    inputs:{
        padding:8,
        paddingRight:16,
        paddingLeft:16,
        // borderRadius:8,
        backgroundColor:'#f7f7f7',
        borderWidth:1,
        // borderColor:'gray',
        margin:10,
        fontSize:23,
        // width:40,
        alignItems:'center',
        textAlign:'center',
        color:'black',

    }
})