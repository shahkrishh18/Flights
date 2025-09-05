import axios from 'axios';

const RAPID_API_KEY='900777d54bmsh69cedc9df3fb4d9p1422dajsnca1483a640f6' // Ensure you have this in your .env file


const getFlightDetailsAPI = async (itineraryId, legs) => {
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails',
    params: {
      // itineraryId,
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
export { getFlightDetailsAPI, getAirportEntity, searchFlightsAPI };