import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';
import axios from "axios";

export default function Input(props) {

    /** References expo-av documentation code at
     *  https://docs.expo.dev/versions/latest/sdk/audio/
     */
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [sample, setSample] = useState();

    async function startRecording() {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
    
          console.log('Starting recording..');
          const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          setRecording(recording);
          console.log('Recording started');
        } catch (err) {
          console.error('Failed to start recording', err);
        }
      }
    
    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
          {
            allowsRecordingIOS: false,
          }
        );
        const uri = recording.getURI();
        setSample(true);
        console.log('Recording stopped and stored at', uri);

        const form = new FormData();
        form.append('sound', uri)

        await axios
          .post('https://classic-pegasus-factual.ngrok-free.app/', {sound: form}, {
            headers: {
                'content-type': 'multipart/form-data'
            }
          })
          .then(res => props.setOutputData(res.data))
          .catch(err => console.log(err))
      }

    return (
        <View style={styles.column}>
            <View style={styles.returnContainer}>
                <TouchableWithoutFeedback onPress={() => props.setView({'home': true})}>
                    <Text style={styles.return}>Return</Text>
                </TouchableWithoutFeedback>
            </View>

            {!sample && !recording && <Image style={styles.crab} source={require('./assets/crab.png')} /> }
            {sample && !recording && <Image style={styles.crab} source={require('./assets/crab_hmm.png')} /> }
            {recording && <Image style={styles.crab} source={require('./assets/crab_listen.png')} />}
            <TouchableWithoutFeedback 
                onPressIn={() => startRecording()} 
                onPressOut={() => {
                    stopRecording();
                    setSample(true);
                }}>
                <View style={recording ? styles.isRecording : styles.isNotRecording}>
                    <Image style={styles.image} source={require('./assets/sound-recording-9.png')} />
                </View>
            </TouchableWithoutFeedback>
            <Text style={styles.instructions}>Press and hold to record audio of your machinery</Text>

            <View style={styles.row}>
                <TouchableWithoutFeedback>
                    <Text style={styles.playBack}>Play Back</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => props.setView({'output': true})}>
                    <Text style={styles.submit}>Submit</Text>
                </TouchableWithoutFeedback>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 30,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
    },
    crab: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    isNotRecording: {
        height: 100,
        aspectRatio: 1,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    isRecording: {
        height: 100,
        aspectRatio: 1,
        borderColor: 'red',
        borderWidth: 3,
        borderRadius: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 80,
        aspectRatio: 1,
    },
    instructions: {
        fontSize: 20,
        textAlign: 'center'
    },
    playBack: {
        padding: 20,
        fontSize: 25,
        borderRadius: 20,
        color: 'white',
        backgroundColor: 'black',
        overflow: 'hidden'
    },
    submit: {
        padding: 20,
        fontSize: 25,
        borderRadius: 20,
        color: '#9a38f3',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#9a38f3',
        overflow: 'hidden'
    },
    returnContainer: {
        position: 'relative',
        right: '35%'

    },
    return: {
        color: 'red',
        fontSize: 20,
    }

})