
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import uploadTos3 from './uploadTos3';
import { BASE_URL } from '../constants/urls';

export const handleProfilePicSelection = async() =>{
    let Permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (Permission.granted == false){
        alert("Permission required");
        return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
        aspect:[1,1],
        quality:1
    });
    if (pickerResult.cancelled===true){
        return "candelled";
    }
    console.log(pickerResult)
    return pickerResult.uri;
};
export const handleStatusPicSelection = async() =>{
    let Permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (Permission.granted == false){
        alert("Permission required");
        return {message:"cancel"};
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
        quality:0.3
    });
    if (pickerResult.cancelled===true){
        return {message:"cancel"};
    }
    console.log(pickerResult)
    return pickerResult.uri;
};

export const handleCamera = async() =>{
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted == false){
        alert("Permission required");
        return;
    }
    let pickerCameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing:true,
    });
    if (pickerCameraResult.cancelled===true){
        return;
    }
    console.log(pickerCameraResult,"camera result")
    const fileNameObject = await pickerCameraResult.uri.split('/');
    const fileName = await fileNameObject[fileNameObject.length-1];
    console.log(fileName);
    const fileObject =await  {
        uri:pickerCameraResult.uri,
        name:String(fileName), 
        type:"image/png",

    };

    return fileObject;

};

export const handleImages = async() =>{
    console.log("image")
    let Permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (Permission.granted == false){
        alert("Permission required");
        return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
    });
    if (pickerResult.cancelled===true){
        return;
    }
    console.log(pickerResult)
    const fileNameObject = await pickerResult.uri.split('/');
    const fileName = await fileNameObject[fileNameObject.length-1];

    // const compressedImage = await ImageManipulator.manipulateAsync(
    //     pickerResult.uri,
    //     [],
    //     {compress:0.3,base64:true}
    // );

    console.log(fileName);
    const fileObject =await  {
        uri:pickerResult.uri,
        name:String(fileName),
        type:"image/png",

    };
    return fileObject;
};

// type: "image/*" // all images files
      // type: "audio/*" // all audio files
      // type: "application/*" // for pdf, doc and docx
      // type: "application/pdf" // .pdf
      // type: "application/msword" // .doc
      // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
      // type: "vnd.ms-excel" // .xls
      // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
      // type: "text/csv" // .csv

export const handleDocuments = async() =>{
    const pickerResult = await DocumentPicker.getDocumentAsync({
        type:"application/*"
    });
    if (pickerResult.type==="cancel"){
        return;
    }
    if (pickerResult.type === "success"){
        console.log(pickerResult);
        const fileObject =await  {
            uri:pickerResult.uri,
            name:pickerResult.name,
            type:"document/pdf",

        };
        return fileObject;
        
    }
    else{
        alert("Something went wrong")
    }
}

export const handleAudios = async()=>{
    const pickerResult = await DocumentPicker.getDocumentAsync({
        type:"audio/*"
    });
    if (pickerResult.type==="cancel"){
        return;
    }
    if (pickerResult.type === "success"){
        console.log(pickerResult);
        const fileObject =await  {
            uri:pickerResult.uri,
            name:pickerResult.name,
            type:"audio/mp3",

        };
        return fileObject;
        
    }
    else{
        alert("Something went wrong")
    }

}

// async function getCameraPermissions() {
            // const { Permissions } = Expo;
        //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
        //     if (status === 'granted') {
        //         getCameraRollPermissions();
        //     } 
            
        //   }
        //   async function getCameraRollPermissions() {
        //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //     if (status === 'granted') {
        //         takePictureAndCreateAlbum()
        //     } 
            
        //   }
        //   const takePictureAndCreateAlbum = async () => {
            // let Permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            //             if (Permission.granted == false){
            //                 alert("Permission required");
            //                 return;
            //             }
            //             let pickerResult = await ImagePicker.launchImageLibraryAsync({
            //                 allowsEditing:true,
            //             });
            //             if (pickerResult.cancelled===true){
            //                 return;
            //             }
            //             console.log(pickerResult.uri)
            // // let DocResult = await DocumentPicker.getDocumentAsync({});
            // //     if (DocResult.type==='cancel'){
            // //         return;
            // //     }
            // //     console.log(DocResult);
            // const asset = await MediaLibrary.createAssetAsync(pickerResult.uri);
            // console.log(asset)
            // MediaLibrary.createAlbumAsync('Connectin', asset)
            //   .then(async(x) => {
            //     console.log('Album created!',x);
            //     const details =await MediaLibrary.getAssetInfoAsync(x.id,{shouldDownloadFromNetwork:false});
            //     console.log("assets details   ",details);
            //   })
            //   .catch(error => {
            //     console.log('err', error);
            //   });
        //   }



         // const compressedImage = await ImageManipulator.manipulateAsync(
                    //     pickerResult.uri,
                    //     [],
                    //     {compress:0.3,base64:true}
                    // );
                    // console.log("this is id",pickerResult);

                    // // for saving 
                    // const asset = await MediaLibrary.createAssetAsync(pickerResult.uri);
                    // console.log("this is id",asset);
                    // setSelectedImage({encoded:compressedImage});

                    // const album =await  MediaLibrary.getAlbumAsync('Connectin');
                    // // console.log(insertedImage);
                    // console.log("fot album understandddddddd",album);
                    // if (album === null){
                    //     await MediaLibrary.createAlbumAsync('Connectin', asset,false);
                    //     const album =await  MediaLibrary.getAlbumAsync('Connectin');
                    //     const items = await MediaLibrary.getAssetsAsync({album:album});
                    //     const itemsArray = await items.assets;
                    //     const insertedImage = await itemsArray[itemsArray.length-1];
                    //     setSelectedImage({encoded:compressedImage,localUri:insertedImage.uri});
                    // }
                    // else{
                    //     await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)
                    //     .then((x)=>console.log("adding",x))
                    //     const items = await MediaLibrary.getAssetsAsync({album:album});
                    //     const itemsArray = await items.assets;
                    //     const insertedImage = await itemsArray[itemsArray.length-1];
                    //     setSelectedImage({encoded:compressedImage,localUri:insertedImage.uri});
                    // }
                    // navigation.navigate("ImagePreview",{tonumber:tonumber,setMssgArray:setMssgArray,setMssgArrayPart:setMssgArrayPart,setNewMssgLength:setNewMssgLength,fromChatScreen:false,image:null});
