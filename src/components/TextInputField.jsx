import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Locate, MapPin } from 'lucide-react-native';

export const TextInputField = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputField}>
      {label.toLowerCase() === 'origin' ? (
        <View style={styles.iconWrapper}>
          <Locate size={20} color="#666" />
        </View>
      ) : (
        <View style={styles.iconWrapper}>
          <MapPin size={22} color="#666" />
        </View>
      )}
      <TextInput
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoCapitalize="characters"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 16, backgroundColor: '#fff' },
  inputLabel: { fontSize: 14, color: '#666666', marginBottom: 4 },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures vertical alignment
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputText: { fontSize: 16, color: '#333333', flex: 1 },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});
