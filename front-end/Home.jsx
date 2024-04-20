import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function Home(props) {
    return (
        <View style={styles.column}>
            {/* <Text style={styles.wm}>W&M</Text> */}
            <Image style={styles.wm} source={require('./assets/wm_vertical_single_line_green.png')}></Image>
            <Image style={styles.crab} source={require('./assets/crab.png')} />
            <TouchableWithoutFeedback onPress={() => props.setView({'input': true})}>
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