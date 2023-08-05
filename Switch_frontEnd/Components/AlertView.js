import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function AlertView({icon,content,subContent}) {
    return (
        <View style={styles.container}>
            {/* icon */}
            <View style={{marginRight:20}}>
                {icon}
            </View>
            <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                <Text style={{fontSize:16,fontWeight:'bold'}}>{content}</Text>
                <Text style={{fontSize:11,fontWeight:'bold'}}>{subContent}</Text>
            </View>
        </View>
    );
}

export default AlertView;

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        width:'100%',
        minHeight:65,
        padding:10,
        paddingLeft:30,
        paddingRight:30,
        flexDirection:'row',
        alignItems:'center',
        // justifyContent:'space-between',
        backgroundColor:'white',
        zIndex:10,
        elevation:5
    }
})