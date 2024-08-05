import getWeatherIcon from './weatherIcons';
import { updateTime, formatDate } from './dateUtils';
import getCurrentWeather from './currentWeather';

const locationName = document.querySelector(".location-name");
const locationCountry = document.querySelector(".location-country");
const locationTime = document.querySelector(".location-time");
const temperatureIcon = document.querySelector(".temperature-icon img");
const iconDescription = document.querySelector(".icon-description");
const temperatureDegrees = document.querySelector(".temperature-degrees");
const feelsLike = document.querySelector(".feels-like-temperature");
const weatherForecast = document.querySelectorAll(".forecast-weather");

function makeCurrentWeatherUI(weatherData){
  locationName.innerText = weatherData.location.name;
  locationCountry.innerText = weatherData.location.country;
  updateTime(weatherData.location.tz_id, locationTime);
  const weatherCode = weatherData.current.condition.code;
  const isDay = weatherData.current.is_day;
  const weatherIcon = getWeatherIcon(weatherCode, isDay);
  temperatureIcon.src = weatherIcon;
  iconDescription.innerText = weatherData.current.condition.text;
  temperatureDegrees.innerText = weatherData.current.temp_c;
  feelsLike.innerText = weatherData.current.feelslike_c;
};

function makeForecastWeatherUI(weatherData) {
  const forecastDays = weatherData.forecast.forecastday;
  forecastDays.forEach((day, index) => {
    if (index < weatherForecast.length) {
      const forecastContainer = weatherForecast[index];
      const date = forecastContainer.querySelector(".forecast-date");
      const icon = forecastContainer.querySelector(".forecast-icon img");
      const minTemp = forecastContainer.querySelector(".min-degrees");
      const maxTemp = forecastContainer.querySelector(".max-degrees");
      formatDate(day.date, date);
      const forecastCode = day.day.condition.code;
      const forecastIcon = getWeatherIcon(forecastCode, true)
      icon.src = forecastIcon;
      minTemp.innerText = day.day.mintemp_c;
      maxTemp.innerText = day.day.maxtemp_c;
    }
  })
};

function makeWeatherUI(weatherData) {
  makeCurrentWeatherUI(weatherData);
  makeForecastWeatherUI(weatherData);
}

function makeSuggestionsUI(location, searchInput, autocompleteContainer) {
  const locationSuggestion = document.createElement("div");
  locationSuggestion.classList.add("location-suggestion");
  const fullLocation = `${location.name}, ${location.country}`
  locationSuggestion.innerText = fullLocation;

  locationSuggestion.addEventListener("click", () => {
    searchInput.value = locationSuggestion.innerText
    autocompleteContainer.replaceChildren();
    getCurrentWeather(searchInput.value);
  })

  autocompleteContainer.appendChild(locationSuggestion);
}

export { makeWeatherUI, makeSuggestionsUI };