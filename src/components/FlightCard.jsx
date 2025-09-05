import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const FlightCard = ({ item, onPress }) => {
  const price =
    item.price?.formatted || item.price?.raw || item.price?.amount || 'N/A';

  const airline =
    item.legs?.[0]?.carriers?.marketing?.[0]?.name ||
    item.legs?.[0]?.carriers?.[0]?.name ||
    'Unknown Airline';

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.flightCard}>
        <Text style={styles.airline}>{airline}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flightCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
  },
});