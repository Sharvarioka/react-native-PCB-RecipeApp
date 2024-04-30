import React from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Dimensions,Image} from 'react-native';
import {COLORS, SIZES} from '../constants';

const FirstPage =({navigation})=> {
  return (
    <View style={styles.HomeScreen}>
      <Image source={require('./Printed-Circuit-Board.jpg')} style={styles.backgroundImage} />
      <Text style={styles.welcomeText}>Welcome </Text>
      <Text style={styles.textStyle}>Record your query and render to that timestamp </Text>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('HomeScreen')}>
          <Text>Let's go</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    welcomeText:{
        fontSize: Dimensions.get('window').height / 32.44,
        marginTop: Dimensions.get('window').height / 47.7,
        paddingVertical: Dimensions.get('window').height / 27,
        color: '#631b87',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textStyle:{
        fontSize: Dimensions.get('window').height / 45,
        marginTop: Dimensions.get('window').height / 47.7,
        paddingVertical: Dimensions.get('window').height / 27,
        color: 'black',
        textAlign: 'center'
    },
    button:{
        
        height: Dimensions.get('window').height/13.5,
        alignItems: 'center',
        justifyContent:'center',
        marginTop: SIZES.padding * 2,
        borderRadius: SIZES.radius / 1.5,
        paddingHorizontal: SIZES.padding * 2,
        marginRight: SIZES.padding * 2,
        backgroundColor: COLORS.gray,
    },
    HomeScreen: {
      backgroundColor: 'pink',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderRadius: SIZES.radius / 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch'
    }
});
export default FirstPage;