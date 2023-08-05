import React, { useEffect} from 'react';
import { View,StyleSheet} from 'react-native';
import { COLORS } from '../Colors';
import { MaterialIcons } from '@expo/vector-icons';

function CheckBox({checked}) {
    
    return (
        <View style={[styles.container,checked?{backgroundColor:COLORS.primary,borderWidth:2,borderColor:COLORS.primary,}:{backgroundColor:'transparent'}]}>
            {
                checked &&
                    <MaterialIcons name="done" size={13} color="white" />
            }
        </View>
    );
}
export default CheckBox;

const styles=StyleSheet.create({
    container:{
        width:20,
        height:20,
        borderRadius:60,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:5,
        right:13,
        zIndex:5
    }
})