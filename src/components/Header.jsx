import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const Header = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.replace("SplashScreen");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.googleIcon}>
          <Image
            source={require('../assets/images/g.png')}
            style={{ width: 22, height: 25 }}
            resizeMethod="resize"
            resizeMode="contain"
          />
        </View>
        <Text style={styles.headerTitle}>Google Flights</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <View style={styles.notificationContainer}>
            <LogOut style={styles.headerIcon} />
            <View style={styles.notificationBadge} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'fixed',
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
});