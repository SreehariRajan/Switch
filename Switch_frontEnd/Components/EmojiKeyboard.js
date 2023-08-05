import React from 'react';
import { StyleSheet } from 'react-native';
import {useRoute } from '@react-navigation/native';
import { View} from 'react-native';
import EmojiSelector from 'react-native-emoji-selector'
import { COLORS } from '../Colors';

function EmojiKeyboard({setClientMssg}) {
    const route=useRoute();
    const {uri} = route.params;
    return (
        <View style={styles.container}>
            <EmojiSelector 
                onEmojiSelected={emoji => setClientMssg((text)=>text+emoji)}
                theme={COLORS.primary}
                columns={12}
            />
        </View>
    );
}

export default EmojiKeyboard;
const styles= StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        backgroundColor:'white'
    }
})