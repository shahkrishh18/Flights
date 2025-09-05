import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export const FlightDetailsModal = ({
  modalVisible,
  setModalVisible,
  selectedFlight,
  flightDetails,
  detailsLoading,
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {detailsLoading ? (
            <Text style={styles.loadingText}>Loading details...</Text>
          ) : flightDetails && flightDetails.itinerary ? (
            <View style={styles.flightDetails}>
              <Text style={styles.flightPrice}>
                $ {flightDetails.itinerary.pricingOptions?.[0]?.totalPrice || "N/A"}
              </Text>
              <Text style={styles.flightRoute}>
                {flightDetails.itinerary.legs?.[0]?.origin?.name || "Unknown"} →{" "}
                {flightDetails.itinerary.legs?.[0]?.destination?.name || "Unknown"}
              </Text>
              <Text style={styles.flightAirline}>
                Airline:{" "}
                {flightDetails.itinerary.legs?.[0]?.segments?.[0]?.marketingCarrier?.name ||
                  "Unknown Airline"}
              </Text>
              <Text style={styles.flightDuration}>
                Duration: {flightDetails.itinerary.legs?.[0]?.duration || "N/A"} min
              </Text>
              <Text style={styles.flightTime}>
                Departure: {flightDetails.itinerary.legs?.[0]?.departure || "N/A"}
              </Text>
              <Text style={styles.flightTime}>
                Arrival: {flightDetails.itinerary.legs?.[0]?.arrival || "N/A"}
              </Text>
            </View>
          ) : (
            <Text style={styles.noData}>No flight details found.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
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