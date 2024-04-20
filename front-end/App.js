import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Home';
import { useState } from 'react';
import Input from './Input';
import Output from './Output';

export default function App() {

  const [view, setView] = useState({home: true});

  return (
    <View style={styles.container}>
      {view.home && <Home setView={setView} />}
      {view.input && <Input setView={setView} />}
      {view.output && <Output setView={setView} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
