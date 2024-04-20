import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useRef, useEffect } from 'react';


export default function Home(props) { 

    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const angle = useRef(new Animated.Value(0)).current;
    const [tiltLeft, setTilt] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(angle, {
                    toValue: 1,
                    duration: 500, 
                    useNativeDriver: true,
                    easing: Easing.linear
                }),
                Animated.timing(angle, {
                    toValue: 0,
                    duration: 500, 
                    useNativeDriver: true,
                    easing: Easing.linear
                }),
        ]) 
        ).start();
        setTilt(!tiltLeft);
    }, [])

    const interpolated = angle.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
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
            <TouchableWithoutFeedback onPress={() => getPermission()}> 
                <Text style={styles.start}>Start Analysis</Text>
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
        borderRadius: 20,
        color: '#9a38f3',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#9a38f3',
        overflow: 'hidden'
    }
})