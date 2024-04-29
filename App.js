
// import React, {useEffect} from 'react';
// import {StyleSheet, Text, View,Button,ToastAndroid,TouchableOpacity,PermissionsAndroid,Dimensions, Keyboard} from 'react-native';
// import Video from 'react-native-video';
// // import VideoPlayer from 'react-native-video-player';
// import AudioRecord from 'react-native-audio-record';
// import * as RNFS from 'react-native-fs';
// import {backend_url} from './urlconstants';
// import {COLORS, SIZES, FONTS, icons} from './constants';


// let responseJsonFile;
// async function askPermission() {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: 'Budget App Microphone Permission',
//           message: 'Budget App needs access to your microphone ',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         // console.log("You can use the mic");
//       } else {
//         // console.log("mic permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }

//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Budget App storage Permission',
//           message: 'Budget App needs access to your storage ',
//           // buttonNeutral: "Ask Me Later",
//           // buttonNegative: "Cancel",
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         // console.log("You can use the storage");
//       } else {
//         // console.log("storage permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }
// }

// let player = React.createRef()
// const App = () => {
//     askPermission();
//     useEffect(() => {
//           AudioRecord.init( {
//             sampleRate: 16000, // default 44100
//             channels: 1, // 1 or 2, default 1
//             bitsPerSample: 16, // 8 or 16, default 16
//             audioSource: 6, // android only (see below)
//             wavFile: 'test.wav', // default 'audio.wav'
//           });
//           async function getData(){
//             const response = await fetch(backend_url + '/getjson', {
//               method: 'GET',
//               headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//               },
//             });
//             responseJsonFile = await response.json();
//             console.log(responseJsonFile.response);
//           } 

//           getData();
//     });



//   const onStartRecord = async () => {

//     ToastAndroid.show('Recording started!', ToastAndroid.LONG);
//     AudioRecord.start();
//     console.log("start record console");
//     setTimeout(onStopRecord, 5000);
//   };

//   const onStopRecord = async () => {
//     ToastAndroid.show('Recording stopped!', ToastAndroid.SHORT);
//     console.log("older console");
//     const j =  await AudioRecord.stop();
//     // console.log("j is",j);
//     const readFile = await RNFS.readFile(j, 'base64');
//     const response = await fetch(backend_url + '/sendaudio', {
//         method: 'POST',
//         headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         sound: readFile,
//       }),
//     });


//     //editdistance logic
//     let res = " ";
//     let dist = 999999;
//     let answer = " ";
//    const editDistance = async (userString, actionArray,index) => {
//       let m = userString.length;
//       // console.log("actionString is:",actionString);
//       p=actionArray.length;
//       for (let k=0;k<p;k++){
//         let n = actionArray[k].length;
//       userString = userString.toLowerCase();
//       actionString = actionArray[k].toLowerCase();


//       let c = new Array(m + 1).fill(0);
//       c.forEach((x, index) => {
//         c[index] = new Array(n + 1);
//       });
//       let b = [];
//       for (let j = 0; j <= m; j++) c[j][0] = j;
//       for (let j = 0; j <= n; j++) c[0][j] = j;

//       for (let i = 1; i <= m; i++){
//         for (let j = 1; j <= n; j++) {
//           var delta = 0;
//           if (userString[i - 1] != actionString[j - 1]) delta = 1;
//           c[i][j] = Math.min(
//             c[i - 1][j] + 1,
//             c[i][j - 1] + 1,
//             c[i - 1][j - 1] + delta,
//           );
//         }
//       }
//       if (c[m][n] < dist) {
//         dist = c[m][n];
//         res = actionString;
//         answer = responseJsonFile.response[index];
//         console.log("answer is ",answer);
//         console.log("c is",c[m][n]);
//         console.log("action",actionString);
//       }
//       return answer;
//       } 
//     };
//     const getFinalEditDistanceResult = async(userString) =>{
//       let res1;
//       for (let i=0; i < responseJsonFile.response.length; i++) {
//       res1 = await editDistance(userString,responseJsonFile.response[i].Actions,i)
//       }
//       console.log("res is",res1);
//       return res1;
//     }

//     const responseJson = await response.json();
//     ToastAndroid.show(responseJson.text,ToastAndroid.LONG);

//     const found = await getFinalEditDistanceResult("waste eggshells");

//     // const found = responseJsonFile.response.find(element => element["narration"] == "pour pistachio from blender onto bowl")
//     console.log("found is",found)

//     if(found){
//     const start_timestamp = (found["start_timestamp"]).split(":");
//     const total_sec= parseFloat(start_timestamp[0])*3600+parseFloat(start_timestamp[1])*60+parseFloat(start_timestamp[2])
//     console.log(parseFloat(total_sec))
//     player && player.seek(parseFloat(total_sec))
//     }
//     else{
//       console.log("not found")
//       ToastAndroid.show("Not found",ToastAndroid.LONG);

//     }
//   };


//   const [isPlaying, setIsPlaying] = React.useState(false);  
//   const [isMuted, setIsMuted] = React.useState(false);
//   return (  
//       <View> 
//           <Video style={styles.backgroundVideo}
//           controls
//           naturalSize={{width:1600,height:900}}
//           source={require('./P2_120_compressed.mp4')
//           }          
//           poster={"https://i.picsum.photos/id/866/1600/900.jpg"}
//           ref={r => (player = r)}
//           muted={isMuted}
//           paused={isPlaying}

//           />

//           <Button
//             onPress={() => {setIsPlaying(p => !p)}}  
//             title={isPlaying ? 'Play' : 'Stop'}  
//           />  return (
//             <NavigationContainer theme={theme}>
//               <Stack.Navigator
//                 detachInactiveScreens={true}
//                 screenOptions={{
//                   headerShown: false,
//                 }}>
//                 <Stack.Screen name="SignUp" component={SignUp} />
//                 <Stack.Screen name="Root" component={Root} />
//               </Stack.Navigator>
//             </NavigationContainer>
//           );
//           <Button
//             onPress={() => setIsMuted(m => !m)}  
//             title={isMuted ? 'Mute' : 'Unmute'}  
//           />
//           <Button
//             onPress={onStartRecord}  
//             title={'Record'}  
//           />    
//       </View> 
//   );  
// }

// export default App;
// const styles= StyleSheet.create({
//   playButton:{
//     height: Dimensions.get('window').height/13.5,
//     backgroundColor:'black',
//     borderRadius: SIZES.radius / 1.5,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
// backgroundVideo:{
//     width:0.9*Dimensions.get('window').width,
//     height:500,
//     position:'absolute',
//     justifyContent:'center',
//     alignContent:'center',
//     marginLeft:Dimensions.get('window').width/20,
//     marginTop:Dimensions.get('window').height/10
//   },
// })


import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, FirstPage } from './screens/index';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
