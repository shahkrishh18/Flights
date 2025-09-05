// import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import { TextInputField } from './TextInputField';
// import { DateFields } from './DateFields';
// import { TripTypeSelector } from './TripTypeSelector';
// import { PassengerCounter } from './PassengerCounter';

// export const SearchForm = ({
//   tripType,
//   setTripType,
//   passengers,
//   setPassengers,
//   origin,
//   setOrigin,
//   destination,
//   setDestination,
//   departureDate,
//   returnDate,
//   showDatePicker,
//   handleSwapLocations,
//   onSearch,
// }) => {
//   return (
//     <View style={styles.searchForm}>
//       <View style={styles.locationContainer}>
//         <TextInputField
//           label="Origin"
//           value={origin}
//           onChangeText={setOrigin}
//           placeholder="e.g., JFK"
//         />
//         <TouchableOpacity
//           style={styles.swapButton}
//           onPress={handleSwapLocations}
//         >
//           <Text style={styles.swapIcon}>⇅</Text>
//         </TouchableOpacity>
//         <TextInputField
//           label="Destination"
//           value={destination}
//           onChangeText={setDestination}
//           placeholder="e.g., LHR"
//         />
//       </View>
//       <DateFields
//         departureDate={departureDate}
//         returnDate={returnDate}
//         showDatePicker={showDatePicker}
//       />
//       <TripTypeSelector tripType={tripType} setTripType={setTripType} />
//       <PassengerCounter passengers={passengers} setPassengers={setPassengers} />

//       <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
//         <Text style={styles.searchButtonText}>Search Flights</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchForm: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 16,
//   },
//   locationContainer: { position: 'relative', justifyContent: 'center' },
//   swapButton: {
//     position: 'absolute',
//     right: 12,
//     top: '50%',
//     transform: [{ translateY: -40 }],
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor: '#e0e0e0',
//     borderWidth: 1,
//     zIndex: 1,
//   },
//   swapIcon: { fontSize: 20, color: '#4285f4' },
//   searchButton: {
//     backgroundColor: '#4285f4',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   searchButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TextInputField } from './TextInputField';
import { DateFields } from './DateFields';
import { TripTypeSelector } from './TripTypeSelector';
import { PassengerCounter } from './PassengerCounter';

export const SearchForm = ({
  tripType,
  setTripType,
  passengers,
  setPassengers,
  origin,
  setOrigin,
  destination,
  setDestination,
  departureDate,
  returnDate,
  showDatePicker,
  handleSwapLocations,
  onSearch,
}) => {
  return (
    <View style={styles.searchForm}>
      <View style={styles.locationContainer}>
        <View style={styles.inputWrapper}>
          <TextInputField
            label="Origin"
            value={origin}
            onChangeText={setOrigin}
            placeholder="London (LON)"
          />
        </View>
        
        <TouchableOpacity
          style={styles.swapButton}
          onPress={handleSwapLocations}
        >
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInputField
            label="Destination"
            value={destination}
            onChangeText={setDestination}
            placeholder="New York (NYC)"
          />
        </View>
      </View>
      <DateFields
        departureDate={departureDate}
        returnDate={returnDate}
        showDatePicker={showDatePicker}
      />
      <TripTypeSelector tripType={tripType} setTripType={setTripType} />
      <PassengerCounter passengers={passengers} setPassengers={setPassengers} />

      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>Search Flights</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchForm: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  locationContainer: {
    // position: 'relative',
    flexDirection: 'column',
    width: '100%',
    gap: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  swapButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginHorizontal: 8,
    zIndex: 1,
  },
  swapIcon: { fontSize: 20, color: '#4285f4' },
  searchButton: {
    backgroundColor: '#4285f4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});