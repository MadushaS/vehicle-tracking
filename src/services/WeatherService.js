// weatherModule.js

// Function to fetch weather data from OpenWeatherMap API
const getWeatherInfo = async (latitude, longitude) => {
  const apiKey = import.meta.env.VITE_REACT_OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null;
  }
}

export default getWeatherInfo;
