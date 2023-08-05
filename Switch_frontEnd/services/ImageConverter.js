import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { BASE_URI } from '../constants/urls';


export const Converter = async(base64) =>{
    const Time = new Date();
    const year = Number(Time.getFullYear());
    const month = Number(Time.getMonth()+1);
    const day = Number(Time.getDate());
    const hours = Number(Time.getHours());
    const minutes = Number(Time.getMinutes());
    const seconds = Number(Time.getSeconds());
    const milliseconds = Number(Time.getMilliseconds());
    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
    const uniqueKey =await `CA00${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}.png`;
    // const filename =await FileSystem.documentDirectory+`${uniqueKey}`;
    const base64Code =await base64.replace("data:image/png;base64,","");
    // const base64Code =await base64.split("data:image/png;base64,")[1];
    

    const tempUri = FileSystem.cacheDirectory+uniqueKey;
    await FileSystem.writeAsStringAsync(tempUri,base64Code,{encoding:FileSystem.EncodingType.Base64});

    const asset = await MediaLibrary.createAssetAsync(tempUri);

    const album =await  MediaLibrary.getAlbumAsync('Connectin');
    console.log("fot album understandddddddd",album);
    var Uri ="";
    if (album === null){
        await MediaLibrary.createAlbumAsync('Connectin', asset,false);
        const album =await  MediaLibrary.getAlbumAsync('Connectin');
        const items = await MediaLibrary.getAssetsAsync({album:album});
        const itemsArray = await items.assets;
        const insertedImage = await itemsArray[itemsArray.length-1];
        Uri =await insertedImage.uri;
    }
    else{
        await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)
        .then((x)=>console.log("adding",x))
        const items = await MediaLibrary.getAssetsAsync({album:album});
        const itemsArray = await items.assets;
        const insertedImage = await itemsArray[itemsArray.length-1];
        Uri =await insertedImage.uri;
    }

    // await FileSystem.writeAsStringAsync(filename,base64Code,{encoding:FileSystem.EncodingType.Base64});
    // await MediaLibrary.saveToLibraryAsync(filename);
    return Uri;
}