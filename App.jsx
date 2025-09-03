// import React, { useState } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Image, FlatList } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import moment from 'moment';

// const Stack = createStackNavigator();

// Mock data for flight results
// const mockFlights = [
//   {
//     id: '1',
//     airline: 'American Airlines',
//     price: 287,
//     departureTime: '07:30 AM',
//     arrivalTime: '10:00 AM',
//     duration: '2h 30m',
//     stops: 0,
//     from: 'JFK',
//     to: 'LAX'
//   },
//   {
//     id: '2',
//     airline: 'Delta',
//     price: 302,
//     departureTime: '09:15 AM',
//     arrivalTime: '12:45 PM',
//     duration: '3h 30m',
//     stops: 1,
//     from: 'JFK',
//     to: 'LAX'
//   },
//   {
//     id: '3',
//     airline: 'United',
//     price: 275,
//     departureTime: '06:00 AM',
//     arrivalTime: '08:15 AM',
//     duration: '2h 15m',
//     stops: 0,
//     from: 'JFK',
//     to: 'LAX'
//   },
//   {
//     id: '4',
//     airline: 'JetBlue',
//     price: 310,
//     departureTime: '11:20 AM',
//     arrivalTime: '02:40 PM',
//     duration: '3h 20m',
//     stops: 0,
//     from: 'JFK',
//     to: 'LAX'
//   },
//   {
//     id: '5',
//     airline: 'Southwest',
//     price: 265,
//     departureTime: '01:15 PM',
//     arrivalTime: '04:45 PM',
//     duration: '3h 30m',
//     stops: 1,
//     from: 'JFK',
//     to: 'LAX'
//   },
// ];

// function SearchScreen({ navigation }) {
//   const [origin, setOrigin] = useState('New York (JFK)');
//   const [destination, setDestination] = useState('Los Angeles (LAX)');
//   const [departureDate, setDepartureDate] = useState(new Date());
//   const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [currentDateField, setCurrentDateField] = useState(null);
//   const [passengers, setPassengers] = useState(1);

//   const showDatePicker = (field) => {
//     setCurrentDateField(field);
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     if (currentDateField === 'departure') {
//       setDepartureDate(date);
//     } else if (currentDateField === 'return') {
//       setReturnDate(date);
//     }
//     hideDatePicker();
//   };

//   const searchFlights = () => {
//     navigation.navigate('Results', {
//       origin,
//       destination,
//       departureDate: departureDate.toISOString().split('T')[0],
//       returnDate: returnDate.toISOString().split('T')[0],
//       passengers
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchForm}>
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>From</Text>
//             <TextInput
//               style={styles.input}
//               value={origin}
//               onChangeText={setOrigin}
//               placeholder="Where from?"
//             />
//           </View>
//           <TouchableOpacity 
//             style={styles.swapButton}
//             onPress={() => {
//               const temp = origin;
//               setOrigin(destination);
//               setDestination(temp);
//             }}
//           >
//             <Text style={styles.swapIcon}>⇄</Text>
//           </TouchableOpacity>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>To</Text>
//             <TextInput
//               style={styles.input}
//               value={destination}
//               onChangeText={setDestination}
//               placeholder="Where to?"
//             />
//           </View>
//         </View>

//         <View style={styles.dateRow}>
//           <TouchableOpacity 
//             style={styles.dateInput}
//             onPress={() => showDatePicker('departure')}
//           >
//             <Text style={styles.label}>Departure</Text>
//             <Text style={styles.dateText}>{moment(departureDate).format('MMM D, YYYY')}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.dateInput}
//             onPress={() => showDatePicker('return')}
//           >
//             <Text style={styles.label}>Return</Text>
//             <Text style={styles.dateText}>{moment(returnDate).format('MMM D, YYYY')}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.passengerRow}>
//           <Text style={styles.label}>Passengers</Text>
//           <View style={styles.passengerSelector}>
//             <TouchableOpacity 
//               onPress={() => setPassengers(Math.max(1, passengers - 1))}
//               style={styles.passengerButton}
//             >
//               <Text style={styles.passengerButtonText}>-</Text>
//             </TouchableOpacity>
//             <Text style={styles.passengerCount}>{passengers}</Text>
//             <TouchableOpacity 
//               onPress={() => setPassengers(passengers + 1)}
//               style={styles.passengerButton}
//             >
//               <Text style={styles.passengerButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.searchButton} onPress={searchFlights}>
//           <Text style={styles.searchButtonText}>Search Flights</Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//       />
//     </View>
//   );
// }

// function ResultsScreen({ route }) {
//   const { origin, destination, departureDate, returnDate, passengers } = route.params;
//   const [sortBy, setSortBy] = useState('price');
  
//   // Sort flights based on selected option
//   const sortedFlights = [...mockFlights].sort((a, b) => {
//     if (sortBy === 'price') return a.price - b.price;
//     if (sortBy === 'duration') {
//       const aDuration = parseInt(a.duration);
//       const bDuration = parseInt(b.duration);
//       return aDuration - bDuration;
//     }
//     return 0;
//   });

//   const renderFlightItem = ({ item }) => (
//     <View style={styles.flightCard}>
//       <View style={styles.flightHeader}>
//         <Text style={styles.airline}>{item.airline}</Text>
//         <Text style={styles.price}>${item.price}</Text>
//       </View>
//       <View style={styles.flightDetails}>
//         <View style={styles.timeSection}>
//           <Text style={styles.time}>{item.departureTime}</Text>
//           <Text style={styles.airport}>{item.from}</Text>
//         </View>
//         <View style={styles.durationSection}>
//           <Text style={styles.duration}>{item.duration}</Text>
//           <View style={styles.flightLine}>
//             <View style={styles.line} />
//             <Text style={styles.stops}>{item.stops === 0 ? 'Nonstop' : `${item.stops} stop${item.stops > 1 ? 's' : ''}`}</Text>
//           </View>
//         </View>
//         <View style={styles.timeSection}>
//           <Text style={styles.time}>{item.arrivalTime}</Text>
//           <Text style={styles.airport}>{item.to}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.resultsContainer}>
//       <View style={styles.resultsHeader}>
//         <Text style={styles.route}>
//           {origin} → {destination}
//         </Text>
//         <Text style={styles.dates}>
//           {departureDate} - {returnDate} • {passengers} {passengers > 1 ? 'passengers' : 'passenger'}
//         </Text>
//       </View>

//       <View style={styles.sortOptions}>
//         <Text style={styles.sortTitle}>Sort by:</Text>
//         <TouchableOpacity 
//           style={[styles.sortButton, sortBy === 'price' && styles.activeSort]}
//           onPress={() => setSortBy('price')}
//         >
//           <Text style={[styles.sortText, sortBy === 'price' && styles.activeSortText]}>Price</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.sortButton, sortBy === 'duration' && styles.activeSort]}
//           onPress={() => setSortBy('duration')}
//         >
//           <Text style={[styles.sortText, sortBy === 'duration' && styles.activeSortText]}>Duration</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={sortedFlights}
//         renderItem={renderFlightItem}
//         keyExtractor={item => item.id}
//         style={styles.resultsList}
//       />
//     </View>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator 
//         initialRouteName="Search"
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#1a73e8',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <Stack.Screen 
//           name="Search" 
//           component={SearchScreen}
//           options={{ title: 'Google Flights' }} 
//         />
//         <Stack.Screen 
//           name="Results" 
//           component={ResultsScreen}
//           options={{ title: 'Flight Results' }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   searchForm: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 14,
//     color: '#5f6368',
//     marginBottom: 4,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#dadce0',
//     paddingVertical: 8,
//     fontSize: 16,
//   },
//   swapButton: {
//     padding: 8,
//     marginHorizontal: 8,
//     backgroundColor: '#f1f3f4',
//     borderRadius: 20,
//   },
//   swapIcon: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   dateRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   dateInput: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#dadce0',
//   },
//   dateText: {
//     fontSize: 16,
//   },
//   passengerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   passengerSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   passengerButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#1a73e8',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   passengerButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   passengerCount: {
//     marginHorizontal: 16,
//     fontSize: 16,
//   },
//   searchButton: {
//     backgroundColor: '#1a73e8',
//     padding: 16,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   searchButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   resultsContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   resultsHeader: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#dadce0',
//   },
//   route: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   dates: {
//     fontSize: 14,
//     color: '#5f6368',
//   },
//   sortOptions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#dadce0',
//   },
//   sortTitle: {
//     marginRight: 12,
//     color: '#5f6368',
//   },
//   sortButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginRight: 8,
//     backgroundColor: '#f1f3f4',
//   },
//   activeSort: {
//     backgroundColor: '#1a73e8',
//   },
//   sortText: {
//     color: '#5f6368',
//   },
//   activeSortText: {
//     color: 'white',
//   },
//   resultsList: {
//     flex: 1,
//   },
//   flightCard: {
//     backgroundColor: 'white',
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   flightHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   airline: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a73e8',
//   },
//   flightDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   timeSection: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   airport: {
//     fontSize: 14,
//     color: '#5f6368',
//   },
//   durationSection: {
//     alignItems: 'center',
//     flex: 2,
//   },
//   duration: {
//     fontSize: 14,
//     color: '#5f6368',
//     marginBottom: 4,
//   },
//   flightLine: {
//     alignItems: 'center',
//   },
//   line: {
//     height: 1,
//     width: '100%',
//     backgroundColor: '#dadce0',
//     marginVertical: 4,
//   },
//   stops: {
//     fontSize: 12,
//     color: '#5f6368',
//   },
// });
// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreens from './src/screens/Signup';

const Stack = createNativeStackNavigator();

function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthScreens"
          component={AuthScreens}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
