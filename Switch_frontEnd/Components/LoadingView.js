import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../Colors';

function LoadingView() {
    return (
        <View style={styles.container}>
            <ActivityIndicator color={COLORS.primary} size={60} />
        </View>
    );
}

export default LoadingView;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#b4d5ff85",
        alignItems:'center',
        justifyContent:'center',
        zIndex:9,
        elevation:4,
        width:'100%',
        height:'100%',
        position:'absolute',
        top:0
    }
});