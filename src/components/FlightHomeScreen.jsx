import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Header } from '../components/Header';
import { SearchForm } from '../components/SearchForm';
import { FlightResults } from '../components/FlightResults';
import { FlightDetailsModal } from '../components/FlightDetailsModal';
import { getFlightDetailsAPI, getAirportEntity, searchFlightsAPI } from '../services/serviceApi';

const { width } = Dimensions.get('window');

export const GoogleFlightsApp = () => {
  const [tripType, setTripType] = useState('Round Trip');
  const [passengers, setPassengers] = useState(1);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('departure');
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const showDatePicker = target => {
    setDatePickerTarget(target);
    setPickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate =
      selectedDate ||
      (datePickerTarget === 'departure' ? departureDate : returnDate);
    setPickerVisible(Platform.OS === 'ios');
    if (datePickerTarget === 'departure') setDepartureDate(currentDate);
    else setReturnDate(currentDate);
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination airports.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      const originData = await getAirportEntity(origin);
      const destData = await getAirportEntity(destination);

      const results = await searchFlightsAPI(
        originData.skyId,
        destData.skyId,
        departureDate,
        returnDate,
        passengers,
        tripType,
        originData.entityId,
        destData.entityId
      );

      setFlights(results);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightPress = async (flight) => {
    setSelectedFlight(flight);
    setModalVisible(true);
    setDetailsLoading(true);

    try {
      const details = await getFlightDetailsAPI(flight.id, flight.legs || []);
      setFlightDetails(details);
    } catch (err) {
      setFlightDetails({ error: err.message });
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <SearchForm
          tripType={tripType}
          setTripType={setTripType}
          passengers={passengers}
          setPassengers={setPassengers}
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          departureDate={departureDate}
          returnDate={returnDate}
          showDatePicker={showDatePicker}
          handleSwapLocations={handleSwapLocations}
          onSearch={handleSearch}
        />

        <FlightResults 
          flights={flights} 
          isLoading={isLoading} 
          error={error} 
          onFlightPress={handleFlightPress} 
        />
      </ScrollView>

      {isPickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datePickerTarget === 'departure' ? departureDate : returnDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      
      <FlightDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedFlight={selectedFlight}
        flightDetails={flightDetails}
        detailsLoading={detailsLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
});

export default GoogleFlightsApp;