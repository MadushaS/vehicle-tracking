// src/services/GeolocationService.js

/**
 * Get the current location of the user with high accuracy.
 * @returns {Promise<Position>} A promise that resolves to the user's current position.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude, name: 'Current Location' });
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject("Geolocation is not supported by your browser");
    }
  });
}

export async function getLocationName(lat, lng) {
  const REACT_GEOKEY = import.meta.env.VITE_REACT_GEOKEY;
  const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${REACT_GEOKEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.display_name;
}

export function haversineDistance(lat1,lat2, lng1,lng2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lng2 - lng1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

