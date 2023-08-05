import React from 'react';
import { StyleSheet, Text, View ,StatusBar} from 'react-native';
import {  ContextProvider } from './Context';

import { NavigationContainer, } from '@react-navigation/native';
import {  createStackNavigator } from '@react-navigation/stack';
// import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
// import { Appearance, AppearanceProvider, useColorScheme } from 'react-native';
//Compoents
import LandingPage from './Components/LandingPage';
import ChatScreen from './Components/ChatScreen';
import CreateAccount from './Components/CreateAccount';
import { SafeAreaView } from 'react-native';
import ChatMenuScreen from './Components/ChatMenuScreen';
import ForwardMssgView from './Components/ForwardMssgView';
import ContactsProfile from './Components/ContactsProfile';
import ImagePreview from './Components/ImagePreview';
import EditProfile from './Components/EditProfile';
import StatusView from './Components/StatusView';
import AddStatus from './Components/AddStatus';
import MyStatusView from './Components/MyStatusView';
import TimerMessageDraft from './Components/TimerMessageDraft';
import TimerMessagesView from './Components/TimerMessagesView';
import EditTimerMessage from './Components/EditTimerMessage';
import OtpVerification from './Components/OtpVerification';
import AddUserDetails from './Components/AddUserDetails';
import MenuScreen from './Components/MenuScreen';
import VoiceRecordingView from './Components/VoiceRecordingView';
import TextMssgDraft from './Components/TextMssgDraft';
import StarredMssgView from './Components/StarredMssgView';
// import { Easing } from 'react-native-reanimated';
// import PdfViewer from './Components/PdfViewer';
// import MenuScreen from './Components/MenuScreen';


// const config = {
//   animation:'spring',
//   config:{
//     stiffness:900,
//     damping:80,
//     mass:3,
//     overshootClamping:false,
//     restDisplacementThreshold:0.01,
//     restSpeedThreshold:0.01,
//   }
// }
// const closeConfig = {
//   animation:"timing",
//   config:{
//     duration:200,
//     easing:Easing.linear
//   }
// }
export default function App() {
  const Stack = createStackNavigator();
  // const Stack = createSharedElementStackNavigator();
  return (
    // <AppearanceProvider>
      <ContextProvider>
          <NavigationContainer>
              <Stack.Navigator 
               initialRouteName={LandingPage} 
               screenOptions={{
                 headerShown:false,
              //   gestureEnabled:true,
              //   gestureDirection:'horizontal',
              //   transitionSpec:
              //     {open:config,
              //     close:closeConfig
              //   },
              //   cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,
              }
                
              }

              >
                <Stack.Screen name="LandingPage" component={LandingPage} screenOptions={{headerShown:false}}/>
                <Stack.Screen name="createAcc" component={CreateAccount} screenOptions={{headerShown:false}}/>
                <Stack.Screen name="ChatMenu" component={ChatMenuScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} 
                />
                <Stack.Screen name="ForwardMssgView" component={ForwardMssgView} />
                <Stack.Screen name="ContactsProfile" component={ContactsProfile} />
                <Stack.Screen name="ImagePreview" component={ImagePreview} />
                <Stack.Screen name="VoiceRecording" component={VoiceRecordingView} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="StatusView" component={StatusView} />
                <Stack.Screen name="AddStatus" component={AddStatus} />
                <Stack.Screen name="MyStatus" component={MyStatusView} />
                <Stack.Screen name="TimerMessageDraft" 
                  component={TimerMessageDraft} 
                />

                <Stack.Screen name="TimerMessagesView" component={TimerMessagesView} />
                <Stack.Screen name="TextMssgDraft" component={TextMssgDraft} />
                <Stack.Screen name="EditTimerMssg" component={EditTimerMessage} />
                <Stack.Screen name="VerifyOtp" component={OtpVerification} />
                <Stack.Screen name="AddUserDetails" component={AddUserDetails} />
                <Stack.Screen name="MenuScreen" component={MenuScreen} />
                <Stack.Screen name="StarredMssgView" component={StarredMssgView} />
                {/* <Stack.Screen name="PdfViewer" component={PdfViewer} /> */}
                {/* <Stack.Screen name="MenuScreen" component={MenuScreen} /> */}
              </Stack.Navigator>
          </NavigationContainer>
        </ContextProvider>
      // </AppearanceProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
  },
});
