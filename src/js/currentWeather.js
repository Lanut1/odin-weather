import getUserLocation from "./userLocation";
import { makeWeatherUI } from "./weatherUI";

async function getCurrentWeather(location = null, errorContainer) {
  try {
    let query;
    if (!location) {
      const ipData = await getUserLocation();
      if (!ipData) query = "London";
      else query = `${ipData.city}, ${ipData.country_name}`;
    } else query = location;

    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a163bf31947f4c38b92111525240108&q=${query}&days=3&aqi=no&alerts=no`, {mode: "cors"});
    if (!response.ok) throw new Error("Sorry, something went wrong!");

    const weatherData = await response.json();
    if (weatherData.error) throw new Error(weatherData.error.message);

    makeWeatherUI(weatherData);
    
  } catch(error) {
    errorContainer.innerText = error;
  }
}

export default getCurrentWeather;