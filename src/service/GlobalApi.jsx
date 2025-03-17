import axios from "axios"

const BASE_URL = 'https://maps.gomaps.pro/maps/api/place/textsearch/json'

export const getPlaceDetails = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        query: query,
        key: import.meta.env.VITE_GOOGLE_PLACE_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
}

export const PHOTO_REF_URL = `https://maps.gomaps.pro/maps/api/place/photo?photo_reference={name}&maxwidth=400&key=`+import.meta.env.VITE_GOOGLE_PLACE_API_KEY;