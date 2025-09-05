import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DateField } from './DateField';

export const DateFields = ({ departureDate, returnDate, showDatePicker }) => (
  <View style={styles.dateContainer}>
    <DateField
      label="Departure"
      value={departureDate}
      onPress={() => showDatePicker('departure')}
    />
    <View style={{ width: 16 }} />
    <DateField
      label="Return"
      value={returnDate}
      onPress={() => showDatePicker('return')}
    />
  </View>
);

const styles = StyleSheet.create({
  dateContainer: { flexDirection: 'row' },
});