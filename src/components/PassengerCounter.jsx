import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const PassengerCounter = ({ passengers, setPassengers }) => (
  <View style={styles.passengersContainer}>
    <Text style={styles.passengersLabel}>Passengers</Text>
    <View style={styles.passengersControls}>
      <TouchableOpacity
        style={styles.passengerButton}
        onPress={() => setPassengers(Math.max(1, passengers - 1))}
      >
        <Text style={styles.passengerButtonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.passengersCount}>{passengers} Adult</Text>
      <TouchableOpacity
        style={styles.passengerButton}
        onPress={() => setPassengers(passengers + 1)}
      >
        <Text style={styles.passengerButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  passengersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  passengersLabel: { fontSize: 16, fontWeight: '500', color: '#333333' },
  passengersControls: { flexDirection: 'row', alignItems: 'center' },
  passengerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  passengerButtonText: { fontSize: 18, color: '#666666' },
  passengersCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginHorizontal: 16,
    minWidth: 60,
    textAlign: 'center',
  },
});