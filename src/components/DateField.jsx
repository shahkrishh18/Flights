import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

export const DateField = ({ label, value, onPress }) => {
  const formattedDate = `${value.getDate().toString().padStart(2, '0')}/${(
    value.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${value.getFullYear()}`;
    
  return (
    <View style={[styles.inputContainer, { flex: 1 }]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.inputField} onPress={onPress}>
        <Text style={styles.inputTextSmall}>{formattedDate}</Text>
        <CalendarDays size={20} color="#666666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: '#666666', marginBottom: 4 },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputTextSmall: { fontSize: 14, color: '#333333' },
  inputIcon: { fontSize: 20, marginLeft: 8 },
});