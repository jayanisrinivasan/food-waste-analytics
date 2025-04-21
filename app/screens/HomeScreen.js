import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { database, ref, onValue } from '../firebase';
import LogItem from '../components/LogItem';

export default function HomeScreen() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const wasteRef = ref(database, 'waste_logs');
    onValue(wasteRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, val]) => ({ id, ...val })).reverse();
        setLogs(parsed);
      }
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {logs.map(log => (
        <LogItem key={log.id} {...log} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 }
});

