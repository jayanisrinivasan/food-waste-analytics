import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LogItem({ object, weight, timestamp }) {
  return (
    <View style={styles.card}>
      <Text style={styles.object}>{object.toUpperCase()}</Text>
      <Text style={styles.weight}>{weight} lbs</Text>
      <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  object: { fontSize: 18, fontWeight: '600' },
  weight: { fontSize: 16 },
  timestamp: { fontSize: 14, color: '#555' }
});

