// import { StyleSheet, Text, View } from 'react-native'
// import React, {useEffect} from 'react'
// import LottieView from 'lottie-react-native';

// const AnimationScreen = () => {
//   return (
//     <View style={styles.animationContainer}>
//       <LottieView
//         source={require('../assets/animations/AtSjaCYGkx.json')}
//         autoPlay
//         loop
//       />
//     </View>
//   );
// };
// const SplashScreen = () => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Navigate to the next screen after 3 seconds
//     }, 3000)

//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>SplashScreen</Text>
//     </View>
//   )
// }

// export default SplashScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333333',
//     },
//     animationContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// })

import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
  const animationRef = useRef(null);

  const handleAnimationFinish = () => {
    // Navigate to the 'AuthScreens' after the animation is done
    navigation.replace('AuthScreens');
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/AtSjaCYGkx.json')}
        autoPlay={true}
        loop={false}
        style={{ width: 300, height: 300 }}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default SplashScreen;