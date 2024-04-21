import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Animated, Easing } from 'react-native';
import { useState, useRef, useEffect } from 'react';


export default function Output(props) {

    const displacement = useRef(new Animated.Value(0)).current;
    const [moveLeft, setX] = useState(false);


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


    return (
            <View style={styles.column}>
                <Image style={styles.crab} source={require('./assets/crab_behold.png')} />
                <View>
                    <Image style={styles.output} source={{uri: `https://classic-pegasus-factual.ngrok-free.app/${props.output.url}`}}></Image>
                </View>
                {console.log(props.output.url)}
                <View style={styles.row}>
                    <TouchableWithoutFeedback onPress={() => props.setView({'input': true})}>
                        <Text style={styles.button}>Record Again</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => props.setView({'home': true})}>
                        <Text style={styles.button}>Main</Text>
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
        rowGap: 40,
    },
    crab: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    button: {
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
    output: {
        width: '85%',
        aspectRatio: 1.33,
    }, 
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
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