import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useRef, useEffect } from 'react';


export default function Home(props) { 

    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const displacement = useRef(new Animated.Value(0)).current;
    const [moveLeft, setX] = useState(false);
    const [hasPressed, setHasPressed] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(displacement, {
                    toValue: 1,
                    duration: 500, 
                    useNativeDriver: true,
                    easing: Easing.linear
                }),
                Animated.timing(displacement, {
                    toValue: 0,
                    duration: 500, 
                    useNativeDriver: true,
                    easing: Easing.linear
                }),
        ]) 
        ).start();
        setX(!moveLeft);
    }, [])

    const interpolated = displacement.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 10]
      });
    
    async function getPermission() {
        try {
            if (!permissionResponse.granted) {
                console.log('Requesting permission..');
                await requestPermission();
              }
        } catch {
            console.log('There was an error asking for audio permission');
        } finally {
            if (permissionResponse.status == 'granted') {
                props.setView({'input': true});
                permissionResponse.granted = false;
            }
        }
    }

    return ( 
        <View style={styles.column}>
            {/* <Text style={styles.wm}>W&M</Text> */}
            <Image style={styles.wm} source={require('./assets/wm_vertical_single_line_green.png')}></Image>
            <Animated.View style={{transform: [{translateX: interpolated}]}}>
                <Image style={styles.crab} source={require('./assets/crab.png')} />
            </Animated.View>
            <TouchableWithoutFeedback 
                onPress={() => getPermission()}
                onPressIn={() => setHasPressed(true)}
                onPressOut={() => setHasPressed(false)}> 
                <Text style={hasPressed ? styles.startPress : styles.start}>Start Analysis</Text>
            </TouchableWithoutFeedback>
            <Text style={styles.tribehacks}>Tribehacks</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 40,
    },
    wm: {
        // borderWidth: 5,
        // borderColor: '#115740',
        height: 100,
        aspectRatio: 2.21
    },
    crab: {
        width: 150,
        height: 150,
        borderRadius: 75,
        // transform: [
        //     {scale: this.state.scale},
        //     {rotateY: this.state.rotateY},
        //     {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
        //   ]
    },
    tribehacks: {
        fontSize: 30, 
        color: '#115740',
    },
    start: {
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
    startPress: {
        padding: 20,
        fontSize: 25,
        fontWeight: 'bold',
        borderRadius: 20,
        color: '#B9975B',
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: '#B9975B',
        overflow: 'hidden'
    }
})