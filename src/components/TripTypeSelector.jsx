import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const TripTypeSelector = ({ tripType, setTripType }) => {
  const tripTypes = ['Round Trip', 'One-way', 'Multi-city'];
  
  return (
    <View style={styles.tripTypeContainer}>
      {tripTypes.map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.tripTypeButton,
            tripType === type && styles.tripTypeButtonActive,
          ]}
          onPress={() => setTripType(type)}
        >
          <Text
            style={[
              styles.tripTypeText,
              tripType === type && styles.tripTypeTextActive,
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tripTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tripTypeButtonActive: {
    backgroundColor: '#4285f4',
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tripTypeText: { fontSize: 14, fontWeight: '500', color: '#666666' },
  tripTypeTextActive: { color: '#ffffff' },
});