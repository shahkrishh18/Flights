import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Platform,
  ActivityIndicator, // NEW: For loading spinner
  FlatList, // NEW: To efficiently display flight results
  Modal, // NEW: For displaying flight details
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; // NEW: Import axios for API calls
import { LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RAPID_API_KEY } from '@env';

const getFlightDetailsAPI = async (itineraryId, legs) => {
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
    params: {
      itineraryId,
      legsIds: legs.map((l) => l.id), // API expects array of leg IDs
      currency: 'USD',
    },
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log(" Flight Details:", JSON.stringify(response.data, null, 2));
    if (response.data?.data?.itinerary) {
  return response.data.data.itinerary;
}
    return {};
  } catch (error) {
    console.error("Flight details error:", error.message);
    throw new Error("Failed to fetch flight details.");
  }
};

const getAirportEntity = async query => {
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
    params: { query },
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data?.data?.length > 0) {
      const airport = response.data.data[0];
      return {
        skyId: airport.skyId,
        entityId: airport.entityId,
      };
    }
    throw new Error(`No airport found for ${query}`);
  } catch (error) {
    console.error('Airport search error:', error.message);
    throw new Error(`Failed to find airport for ${query}`);
  }
};

const searchFlightsAPI = async (
  originSkyId,
  destSkyId,
  departureDate,
  returnDate,
  passengers,
  tripType,
  originEntityId,
  destinationEntityId
) => {
  const formattedDate = departureDate.toISOString().split('T')[0];
  const formattedReturnDate = returnDate?.toISOString().split('T')[0];

  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
    params: {
      originSkyId,
      destinationSkyId: destSkyId,
      originEntityId,
      destinationEntityId,
      date: formattedDate,
      currency: 'USD',
      adults: passengers.toString(),
      ...(tripType === 'Round Trip' && { returnDate: formattedReturnDate }),
    },
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    console.log("🔍 Raw Flight API Response:", JSON.stringify(response.data, null, 2));

    if (response.data?.data?.itineraries) {
      return response.data.data.itineraries;
    }
    return [];
  } catch (error) {
    console.error('Flight search error:', error.message);
    throw new Error('Failed to fetch flight data.');
  }
};


// Get device dimensions for responsive design
const { width } = Dimensions.get('window');

// --- Reusable Components ---

// Header Component (No changes)
const Header = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("AuthScreens");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };
  return (
    <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.googleIcon}>
        <Image
          source={require('../../assets/images/g.png')}
          style={{ width: 22, height: 25 }}
          resizeMethod="resize"
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerTitle}>Google Flights</Text>
    </View>
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerButton} onPress={handleLogout} >
        <View style={styles.notificationContainer}>
          <LogOut style={styles.headerIcon} />
          <View style={styles.notificationBadge} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
  );
};

// TextInputField Component (No changes)
const TextInputField = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputField}>
      <TextInput
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoCapitalize="characters" // Airports are usually uppercase
        backgroundColor="#fff"
      />
      <Text style={styles.inputIcon}>✈️</Text>
    </View>
  </View>
);

// DateField component (No changes)
const DateField = ({ label, value, onPress }) => {
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
        <Text style={styles.inputIcon}>📅</Text>
      </TouchableOpacity>
    </View>
  );
};

// DateFields component (No changes)
const DateFields = ({ departureDate, returnDate, showDatePicker }) => (
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

// Trip Type Selector Component (No changes)
const TripTypeSelector = ({ tripType, setTripType }) => {
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

// Passenger Counter Component (No changes)
const PassengerCounter = ({ passengers, setPassengers }) => (
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

// MODIFIED: SearchForm now includes a "Search Flights" button
const SearchForm = ({
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
  onSearch, // NEW: Prop for the search handler
}) => {
  return (
    <View style={styles.searchForm}>
      <View style={styles.locationContainer}>
        <TextInputField
          label="Origin"
          value={origin}
          onChangeText={setOrigin}
          placeholder="e.g., JFK"
        />
        <TouchableOpacity
          style={styles.swapButton}
          onPress={handleSwapLocations}
        >
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>
        <TextInputField
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          placeholder="e.g., LHR"
        />
      </View>
      <DateFields
        departureDate={departureDate}
        returnDate={returnDate}
        showDatePicker={showDatePicker}
      />
      <TripTypeSelector tripType={tripType} setTripType={setTripType} />
      <PassengerCounter passengers={passengers} setPassengers={setPassengers} />

      {/* NEW: Search Flights Button */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>Search Flights</Text>
      </TouchableOpacity>
    </View>
  );
};

// NEW: Component to display a single flight result
// const FlightCard = ({ item }) => {

//   console.log('Flight Item:', JSON.stringify(item, null, 2));

//     const price = item.price?.formatted || item.price?.raw || 'N/A';
//     const airline =
//     item.legs?.[0]?.carriers?.marketing?.[0]?.name ||
//     item.legs?.[0]?.carriers?.[0]?.name ||
//     'Unknown Airline';

//   return (
//     <View style={styles.flightCard}>
//       <Text style={styles.flightAirline}>{airline}</Text>
//       <Text style={styles.flightPrice}>{price}</Text>
//     </View>
//   );
// };

const FlightCard = ({ item, onPress }) => {
  const price =
    item.price?.formatted || item.price?.raw || item.price?.amount || 'N/A';

  const airline =
    item.legs?.[0]?.carriers?.marketing?.[0]?.name ||
    item.legs?.[0]?.carriers?.[0]?.name ||
    'Unknown Airline';

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.card}>
        <Text style={styles.airline}>{airline}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};


// NEW: Component to display the list of flights, loading indicator, or error message
const FlightResults = ({ flights, isLoading, error, onFlightPress }) => {
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
        data={flights.slice(0, 5)} // Limit to first 20 results for performance
        renderItem={({ item }) => <FlightCard item={item} onPress={onFlightPress} />}
        // keyExtractor={(item) => item.id}
        keyExtractor={(item, index) => item.id || index.toString()} // Fallback if id is missing
      />
    </View>
  );
};

// --- Main App Component ---

export const GoogleFlightsApp = () => {
  // State for search form
  const [tripType, setTripType] = useState('Round Trip');
  const [passengers, setPassengers] = useState(1);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
    const [flightDetails, setFlightDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  // State for date picker
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('departure');

  // NEW: State for API results
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler to show the date picker
  const showDatePicker = target => {
    setDatePickerTarget(target);
    setPickerVisible(true);
  };

  // Handler for when a date is selected
  const onDateChange = (event, selectedDate) => {
    const currentDate =
      selectedDate ||
      (datePickerTarget === 'departure' ? departureDate : returnDate);
    setPickerVisible(Platform.OS === 'ios');
    if (datePickerTarget === 'departure') setDepartureDate(currentDate);
    else setReturnDate(currentDate);
  };

  // Handler for swapping locations
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // NEW: Handler for the search button press
  // NEW: Handler for the search button press
  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination airports.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      // Step 1: Resolve entityIds for origin & destination
      const originData = await getAirportEntity(origin);
      const destData = await getAirportEntity(destination);

      // Step 2: Search flights
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

      console.log("Found flights:", results.length);
      console.log("Origin Data:", originData);
      console.log("Destination Data:", destData);
      console.log("Flight Results:", JSON.stringify(results, null, 2));
      setFlights(results);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

const handleFlightPress = async (flight) => {
  setSelectedFlight(flight);
  setDetailsLoading(true);

  try {
    const details = await getFlightDetailsAPI(flight.id, flight.legs || []);
    console.log("🔍 Flight Details Response:", JSON.stringify(details, null, 2));
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
          onSearch={handleSearch} // MODIFIED: Pass search handler down
        />

        <FlightResults flights={flights} isLoading={isLoading} error={error} onFlightPress={handleFlightPress} />

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
      {selectedFlight && (
<Modal
  visible={true}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      {detailsLoading ? (
        <Text style={styles.loadingText}>Loading details...</Text>
      ) : flightDetails ? (
        <View style={styles.flightDetails}>
    {/* Price */}
    <Text style={styles.flightPrice}>
      ${flightDetails.itinerary?.pricingOptions?.[0]?.totalPrice || "N/A"}
    </Text>

    {/* Route */}
    <Text style={styles.flightRoute}>
      {flightDetails.itinerary?.legs?.[0]?.origin?.name || "Unknown"} →
      {flightDetails.itinerary?.legs?.[0]?.destination?.name || "Unknown"}
    </Text>

    {/* Airline */}
    <Text style={styles.flightAirline}>
      Airline:{" "}
      {flightDetails.itinerary?.legs?.[0]?.segments?.[0]?.marketingCarrier?.name ||
        "Unknown Airline"}
    </Text>

    {/* Duration */}
    <Text style={styles.flightDuration}>
      Duration: {flightDetails.itinerary?.legs?.[0]?.duration || "N/A"} min
    </Text>

    {/* Times */}
    <Text style={styles.flightTime}>
      Departure: {flightDetails.itinerary?.legs?.[0]?.departure || "N/A"}
    </Text>
    <Text style={styles.flightTime}>
      Arrival: {flightDetails.itinerary?.legs?.[0]?.arrival || "N/A"}
    </Text>
  </View>
      ) : (
        <Text style={styles.noData}>No flight details found.</Text>
      )}
    </View>
  </View>
</Modal>


)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  googleIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: '500', color: '#333333' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { marginLeft: 16 },
  headerIcon: { fontSize: 20 },
  notificationContainer: { position: 'relative' },
  searchForm: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
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
    paddingVertical: 6,
  },
  inputText: { fontSize: 16, color: '#333333', flex: 1 },
  inputTextSmall: { fontSize: 14, color: '#333333' },
  inputIcon: { fontSize: 20, marginLeft: 8 },
  dateContainer: { flexDirection: 'row' },
  tripTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
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
  destinationsSection: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    marginBottom: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    paddingRight: 16,
    marginHorizontal: 16,
  },
  destinationColumn: { flexDirection: 'column', marginRight: 16 },
  destinationCard: {
    width: (width - 64) / 2,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  destinationImage: { width: '100%', height: '100%' },
  destinationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  destinationInfo: { position: 'absolute', bottom: 8, left: 8 },
  destinationName: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
  locationContainer: { position: 'relative', justifyContent: 'center' },
  swapButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -40 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    zIndex: 1,
  },
  swapIcon: { fontSize: 20, color: '#4285f4' },

  // NEW: Styles for the Search Button
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

  // NEW: Styles for Flight Results
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
  flightCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightAirline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  flightPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
  },
modalContainer: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 20,
},
modalTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#333',
},
modalSection: {
  marginBottom: 20,
},
modalSectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 10,
  color: '#4285f4',
},
modalText: {
  fontSize: 16,
  marginBottom: 5,
  color: '#333',
},
modalSubtext: {
  fontSize: 14,
  marginBottom: 5,
  color: 'black',
},
flightLeg: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  borderLeftWidth: 4,
  borderLeftColor: '#4285f4',
},
flightSegment: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},
flightInfoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 5,
},
closeButton: {
  backgroundColor: '#4285f4',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
closeButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
error: {
  color: '#d9534f',
  fontSize: 16,
  marginBottom: 20,
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
carrierLogo: {
  width: 100,
  height: 40,
  resizeMode: 'contain',
  marginBottom: 10,
},
modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    justifyContent: "center", // bottom sheet effect
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  flightDetails: {
    marginTop: 20,
  },
  flightPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e88e5",
    marginBottom: 10,
  },
  flightRoute: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  flightAirline: {
    fontSize: 16,
    marginBottom: 5,
  },
  flightDuration: {
    fontSize: 16,
    marginBottom: 5,
  },
  flightTime: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginVertical: 20,
  },
});

export default GoogleFlightsApp;
