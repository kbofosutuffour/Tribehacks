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
    const [hasPressed, setHasPressed] = useState(false);
    const [hasReturned, setHasReturned] = useState(false);
    const [sound, setSound] = useState();

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
        setSound(uri);
        const audioFile = new File([uri], 'input.m4a', { type: 'audio/m4a' });

        const form = new FormData();
        form.append('sound', {
            uri: uri,
            name: 'input.m4a',
            type: 'audio/m4a',
          })

        await axios
          .post('https://classic-pegasus-factual.ngrok-free.app', form, {
            headers: {
                'content-type': 'multipart/form-data'
            }
          })
          .then(res => {
            props.setOutput(res.data);
        })
          .catch(err => console.log(err))
      }
      

    async function playSound() {
        console.log('testing')
        try {
            console.log('Playing Sound');
            await recording.playBack();
        } catch {
            console.log('Error playing sound')
        }
    }

    
    return (
        <View style={styles.column}>
            <View style={styles.returnContainer}>
                <TouchableWithoutFeedback 
                    onPress={() => props.setView({'home': true})}
                    onPressIn={() => setHasReturned(true)}
                    onPressOut={() => setHasReturned(false)}>
                    <Text style={{
                        color: hasReturned ? 'red' : '#115740',
                        fontSize: 25,
                    }}>Return</Text>
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
                {props.output && <TouchableWithoutFeedback
                    onPress={() => props.setView({'output': true})}
                    onPressIn={() => setHasPressed(true)}
                    onPressOut={() => setHasPressed(false)}>
                    <Text style={hasPressed ? styles.submitPress : styles.submit}>Submit</Text>
                </TouchableWithoutFeedback>}
                {!props.output && <Text style={styles.cannotSubmit}>Submit</Text>}

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
        height: 125,
        aspectRatio: 1,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 75,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    isRecording: {
        height: 125,
        aspectRatio: 1,
        borderColor: 'red',
        borderWidth: 3,
        borderRadius: 75,
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
        fontWeight: 'bold',
        borderRadius: 20,
        color: '#115740',
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: '#115740',
        overflow: 'hidden'
    },
    cannotSubmit: {
        padding: 20,
        fontSize: 25,
        fontWeight: 'bold',
        borderRadius: 20,
        color: 'gray',
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'gray',
        overflow: 'hidden'
    },
    submitPress: {
        padding: 20,
        fontSize: 25,
        fontWeight: 'bold',
        borderRadius: 20,
        color: '#B9975B',
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: '#B9975B',
        overflow: 'hidden'
    },
    returnContainer: {
        position: 'relative',
        right: '35%'

    },
})