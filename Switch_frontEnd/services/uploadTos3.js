import React from 'react';
import {AWS_ACCESS_KEY,AWS_BUCKET_NAME_PHOTOS,AWS_SECRET_KEY} from '../constants/keys';
import { RNS3 } from 'react-native-aws3';

async function uploadTos3(fileObject,folder) {

    // console.log(fileObject);
    const file =await {
        // `uri` can also be a file system path (i.e. file://)
        uri: fileObject.uri,
        name: fileObject.name,
        type: fileObject.type
      };
      const options =await {
        keyPrefix: `${folder}/`,
        bucket: AWS_BUCKET_NAME_PHOTOS,
        region: "ap-south-1",
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201
      };
      const response = await RNS3.put(file, options)
        if (response.status === 201){
            return response.body.postResponse.location;
        };

}
   
export default uploadTos3;
