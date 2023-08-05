import axios from "axios";
import React , {createContext , useReducer, useState} from "react";
import {Keyboard} from 'react-native';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
export const Context = createContext();

export const ContextProvider = props =>{
    const [userNumber,setUserNumber]=useState("");
    const [user,setUser]=useState("");
    const [profileLocation,setProfileLocation] = useState(null);
    const [to,setTo]=useState("");
    const [selectedMssg,setSelectedMssg]=useState(null);
    const [selectedReplyMssg,setSelectedReplyMssg]=useState(null);
    const [selectedMssgArray,setSelectedMssgArray]=useState([]);
    const [contacts,setContacts]=useState([]);
    const [selectedContacts,setSelectedContacts]=useState([]);
    const [selectedImage,setSelectedImage]=useState({});
    const [longPressStatus,setLongPressStatus]=useState(false);
    const [selectionCheck,setSelectionCheck]=useState(true);
    const [audioIndex,setAudioIndex]=useState(undefined);
    const [playingAudio,setPlayingAudio]=useState(false);
    const [status,setStatus]=useState([]);
    const [userStatus,setUserStatus]=useState([]);
    const [token,setToken]=useState("");
    const [latestMssg,setLatestMssg] = useState();
    const [selectedIndex,setSelectedIndex] = useState(null);
    return (
        <Context.Provider value={{userDetails:[userNumber,setUserNumber,user,setUser],
                                    userProfile:[profileLocation,setProfileLocation],
                                    toDetails:[to,setTo],
                                    selectedMssgDetails:[selectedMssg,setSelectedMssg],
                                    selectedMssgArrayDetails:[selectedMssgArray,setSelectedMssgArray],
                                    contactsDetails:[contacts,setContacts],
                                    statusDetails:[status,setStatus],
                                    userStatusDetails:[userStatus,setUserStatus],
                                    SelectedContactsDetails:[selectedContacts,setSelectedContacts],
                                    longPressStatusDetails:[longPressStatus,setLongPressStatus],
                                    replyMssgDetails:[selectedReplyMssg,setSelectedReplyMssg],
                                    selectionCheckDetails:[selectionCheck,setSelectionCheck],
                                    selectedImageDetails:[selectedImage,setSelectedImage],
                                    audioDetails:[audioIndex,setAudioIndex,playingAudio,setPlayingAudio],
                                    tokenDetails:[token,setToken],
                                    latestMssgDetails:[latestMssg,setLatestMssg],
                                    selectedIndexDetails:[selectedIndex,setSelectedIndex]
    
                                }}>
            {props.children}
        </Context.Provider>
    );
}