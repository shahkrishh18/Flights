import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FlightCard } from './FlightCard';

export const FlightResults = ({ flights, isLoading, error, onFlightPress }) => {
  if (isLoading) {
    return (
      <View style={styles.resultsContainer}>
        <ActivityIndicator size="large" color="#4285f4" />
        <Text style={styles.resultsText}>Searching for flights...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTextError}>{error}</Text>
      </View>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>Find your next flight! ✈️</Text>
      </View>
    );
  }

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Search Results</Text>
      <FlatList
        data={flights.slice(0, 5)}
        renderItem={({ item }) => <FlightCard item={item} onPress={onFlightPress} />}
        keyExtractor={(item, index) => item.id || index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultsSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  resultsContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  resultsTextError: {
    fontSize: 16,
    color: '#d9534f',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    paddingRight: 16,
    marginHorizontal: 16,
  },
});