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
        style={{ width: '100%', height: 300 }}
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