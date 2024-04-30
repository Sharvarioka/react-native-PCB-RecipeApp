
import React, {useEffect} from 'react';
import {StyleSheet, Text, View,Button,ToastAndroid,TouchableOpacity,PermissionsAndroid,Dimensions, ScrollView} from 'react-native';
import Video from 'react-native-video';
import AudioRecord from 'react-native-audio-record';
import * as RNFS from 'react-native-fs';
import {backend_url} from '../urlconstants';
import {SIZES,COLORS} from '../constants';
// import { ScrollView } from 'react-native-gesture-handler';

let responseJsonFile;
let arrayOfObjects=[];
// let total_sec;
async function askPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Budget App Microphone Permission',
          message: 'Budget App needs access to your microphone ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the mic");
      } else {
        // console.log("mic permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Budget App storage Permission',
          message: 'Budget App needs access to your storage ',
          // buttonNeutral: "Ask Me Later",
          // buttonNegative: "Cancel",
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the storage");
      } else {
        // console.log("storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
}

let player = React.createRef()
const HomeScreen = () => {
    askPermission();
    useEffect(() => {
          AudioRecord.init( {
            sampleRate: 16000, // default 44100
            channels: 1, // 1 or 2, default 1
            bitsPerSample: 16, // 8 or 16, default 16
            audioSource: 6, // android only (see below)
            wavFile: 'test.wav', // default 'audio.wav'
          });
          async function getData(){
            const response = await fetch(backend_url + '/getjson', {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            responseJsonFile = await response.json();
            // console.log(responseJsonFile.response);
          } 
          
          getData();
    });


  
  const onStartRecord = async () => {
    // setIsPlaying(p => !p);
    
    ToastAndroid.show('Recording started!', ToastAndroid.LONG);
    AudioRecord.start();
    console.log("start record console");
    setTimeout(onStopRecord, 5000);
  };

  const onStopRecord = async () => {
    ToastAndroid.show('Recording stopped!', ToastAndroid.SHORT);
    console.log("older console");
    const j =  await AudioRecord.stop();
    console.log("j is",j);
    const readFile = await RNFS.readFile(j, 'base64');
    const response = await fetch(backend_url + '/sendaudio', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sound: readFile,
      }),
    });


    //editdistance logic
    let res = " ";
    let dist = 999999;
    let answer = " ";
   const editDistance = async (userString, actionArray,index) => {
      let m = userString.length;
      // console.log("actionString is:",actionString);
      p=actionArray.length;
      for (let k=0;k<p;k++){
        let n = actionArray[k].length;
      userString = userString.toLowerCase();
      actionString = actionArray[k].toLowerCase();
     
      
      let c = new Array(m + 1).fill(0);
      c.forEach((x, index) => {
        c[index] = new Array(n + 1);
      });
      let b = [];
      for (let j = 0; j <= m; j++) c[j][0] = j;
      for (let j = 0; j <= n; j++) c[0][j] = j;
  
      for (let i = 1; i <= m; i++){
        for (let j = 1; j <= n; j++) {
          var delta = 0;
          if (userString[i - 1] != actionString[j - 1]) delta = 1;
          c[i][j] = Math.min(
            c[i - 1][j] + 1,
            c[i][j - 1] + 1,
            c[i - 1][j - 1] + delta,
          );
        }
      }
      if (c[m][n] <= 4) {
        dist = c[m][n];
        res = actionString;
        answer = responseJsonFile.response[index];
        // console.log("answer is ",answer);
        console.log("c is",c[m][n]);
        console.log("action",actionString);
        return answer;
      }
      // return answer;
      } 
    };

    const getFinalEditDistanceResult = async(userString) =>{
      if (!userString) {
        return [];
      }
      let res1;
      for (let i=0; i < responseJsonFile.response.length; i++) {
      res1 = await editDistance(userString,responseJsonFile.response[i].Actions,i);
      if(res1){
        arrayOfObjects.push(res1);
        }       
      }
      return arrayOfObjects;
    }; 

    const responseJson = await response.json();
    ToastAndroid.show(responseJson.text,ToastAndroid.LONG);
    console.log(responseJson.text);
    const foundArrayOfObjects = await getFinalEditDistanceResult(responseJson.text);
   // const foundArrayOfObjects = await getFinalEditDistanceResult("sugar jar");
    
    if(foundArrayOfObjects.length){
      console.log("found is",foundArrayOfObjects);
      setOptionsShow(true);
    } else {
      ToastAndroid.show("Please provide a correct annotation",ToastAndroid.LONG);
    }
  };
  

  const onPressButton = (ele) => {
    setOptionsShow(false);
    const start_timestamp = (ele["start_timestamp"]).split(":");
    const total_sec= parseFloat(start_timestamp[0])*3600+parseFloat(start_timestamp[1])*60+parseFloat(start_timestamp[2])
    // console.log("res and time ",ele["narration"],parseFloat(total_sec))
    player.seek(parseFloat(total_sec))
    arrayOfObjects=[];
  }

  const optionListDisplay = () => {
    return arrayOfObjects.map((element, index) =>  
    <TouchableOpacity
      style={styles.displayListButton}
      onPress= {() => {onPressButton(element)}}
      key = {index}
    >
      <Text>{element["narration"]}</Text>
    </TouchableOpacity>
    );
    
  };
  
  const [isPlaying, setIsPlaying] = React.useState(false);  
  const [isMuted, setIsMuted] = React.useState(false);
  const [optionsShow,setOptionsShow] = React.useState(false);
  
  return (  
      <View>
        <View style={optionsShow ? styles.renderLogic: ''}>
          <Video style={styles.backgroundVideo}
          controls
          naturalSize={{width:1600,height:900}}
          source={require('../P2.mp4')}
          // source={{uri:'https://drive.google.com/file/d/1gIzMq-eKT8LTqGeGnSjfa6QUb-CMETcJ/view?usp=sharing'}}
               
          poster={"https://i.picsum.photos/id/866/1600/900.jpg"}
          ref={r => (player = r)}
          muted={isMuted}
          paused={isPlaying}
          />
         <TouchableOpacity style={styles.recordButton} onPress={() => {setIsPlaying(p => !p)}}>
          <Text>Play</Text>
          </TouchableOpacity>

           <TouchableOpacity style={styles.recordButton} onPress={() => {setIsMuted(m => !m)}}>
          <Text>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recordButton} onPress={onStartRecord}>
          <Text>Record</Text>
          </TouchableOpacity> 
        </View>  

        <ScrollView style={optionsShow ? '' : styles.renderLogic}>
              {optionListDisplay()}
          <TouchableOpacity style={styles.exitButton} onPress={()=>{setOptionsShow(false),arrayOfObjects=[]}}>
              <Text>Exit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
    }


export default HomeScreen;
const styles= StyleSheet.create({
  playButton:{
    height: Dimensions.get('window').height/13.5,
    backgroundColor:'black',
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  displayListButton:{
    height: Dimensions.get('window').height/13.5,
    backgroundColor:'lightseagreen',
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    width:Dimensions.get('window').width
  },
  textInStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: Dimensions.get('window').height / 10,
    marginBottom: Dimensions.get('window').height / 10,
    backgroundColor: 'lightgoldenrodyellow',
    borderColor: 'white',
    margin: Dimensions.get('window').width / 10,
    borderColor: 'brown',
    borderWidth: 1,
  },
  renderLogic:{
    display:'none'
  },
backgroundVideo:{
    width:0.9*Dimensions.get('window').width,
    height:500,
    position:'absolute',
    justifyContent:'center',
    alignContent:'center',
    marginLeft:Dimensions.get('window').width/20,
    marginTop:Dimensions.get('window').height/10
  },
  recordButton:{   
    height: Dimensions.get('window').height/17,
    width:Dimensions.get('window').width/2,
    alignItems: 'center',
    justifyContent:'center',
    marginTop: SIZES.padding * 2,
    borderRadius: SIZES.radius / 1.5,
    paddingHorizontal: SIZES.padding * 2,
    marginRight: SIZES.padding * 2,
    backgroundColor : 'darkseagreen'
   
},
exitButton:{   
  height: Dimensions.get('window').height/17,
    width:Dimensions.get('window').width/4.5,
    alignItems: 'center',
    justifyContent:'center',
    marginTop: SIZES.padding * 2,
    borderRadius: SIZES.radius / 1.5,
    paddingHorizontal: SIZES.padding * 2,
    marginRight: SIZES.padding * 2,
  backgroundColor : 'red'
}
})