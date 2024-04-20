import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function Output(props) {

    return (
            <View style={styles.column}>
                <Image style={styles.crab} source={require('./assets/crab_behold.png')} />
                <View><Text></Text></View>
                <View></View>
                <TouchableWithoutFeedback>
                    <Text style={styles.button}>External</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => props.setView({'input': true})}>
                    <Text style={styles.button}>Record Again</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => props.setView({'home': true})}>
                    <Text style={styles.button}>Main</Text>
                </TouchableWithoutFeedback>
            </View>

    )
}

const styles = StyleSheet.create({
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
    },
    crab: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    button: {
        padding: 20,
        fontSize: 25,
        borderRadius: 20,
        color: 'white',
        backgroundColor: 'black',
        overflow: 'hidden'
    }
})