import './style.css';
import { format, parse } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';
import clearDayIcon from './icons/clear-day.svg';
import getWeatherIcon from './weatherIcons';

const locationName = document.querySelector(".location-name");
const locationCountry = document.querySelector(".location-country");
const locationTime = document.querySelector(".location-time");
const temperatureIcon = document.querySelector(".temperature-icon img");
const iconDescription = document.querySelector(".icon-description");
const temperatureDegrees = document.querySelector(".temperature-degrees");
const feelsLike = document.querySelector(".feels-like-temperature");
const weatherForecast = document.querySelectorAll(".forecast-weather");

const errorContainer = document.querySelector(".error-container");
let blurTimeout;

async function getUserLocation() {
  try {
    const response = await fetch('https://api.weatherapi.com/v1/ip.json?key=a163bf31947f4c38b92111525240108&q=auto:ip', {mode: "cors"});
    if (!response.ok) throw new Error('Failed to fetch IP information');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}

function updateTime(locationTimezone, container) {
  const date = new Date();
  const formattedDateAndTime = formatInTimeZone(date, locationTimezone, "PPpp")
  container.innerText = formattedDateAndTime;
}

function formatDate(dateString, container) {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const formattedDate = format(date, "PP");
  container.innerText = formattedDate;
}

async function getCurrentWeather(location = null) {
  try {
    let query;
    if (!location) {
      const ipData = await getUserLocation();
      if (!ipData) query = "London";
      else query = `${ipData.city}, ${ipData.country_name}`;
    } else query = location;

    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a163bf31947f4c38b92111525240108&q=${query}&days=3&aqi=no&alerts=no`, {mode: "cors"});
    if (!response.ok) throw new Error("Sorry, something went wrong!");

    const weatherData = await response.json();
    if (weatherData.error) throw new Error(weatherData.error.message);

    locationName.innerText = weatherData.location.name;
    locationCountry.innerText = weatherData.location.country;
    setInterval(() => updateTime(weatherData.location.tz_id, locationTime), 1000);
    const weatherCode = weatherData.current.condition.code;
    const isDay = weatherData.current.is_day;
    const weatherIcon = getWeatherIcon(weatherCode, isDay);
    temperatureIcon.src = weatherIcon;
    iconDescription.innerText = weatherData.current.condition.text;
    temperatureDegrees.innerText = weatherData.current.temp_c;
    feelsLike.innerText = weatherData.current.feelslike_c;

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
  } catch(error) {
    errorContainer.innerText = error;
  }
}
const searchInput = document.querySelector("#location-search");
const autocompleteContainer = document.querySelector("#autocomplete-container");


async function handleSearchInput() {
  try {
    const userQuery = searchInput.value.trim();
    autocompleteContainer.replaceChildren();
    if (userQuery.length === 0) return;

    const queryResponse = await fetch(`http://api.weatherapi.com/v1/search.json?key=a163bf31947f4c38b92111525240108&q=${userQuery}`, {mode: "cors"});
    if (!queryResponse.ok) throw new Error("Sorry, something went wrong!");

    const queryData = await queryResponse.json();

    queryData.forEach(location => {
      const locationSuggestion = document.createElement("div");
      locationSuggestion.classList.add("location-suggestion");

      const flagIconContainer = document.createElement("div");
      flagIconContainer.classList.add("flag-icon-container");
      locationSuggestion.appendChild(flagIconContainer);

      const cityCountryContainer = document.createElement("div");
      cityCountryContainer.classList.add("city-country-container");
      const fullLocation = `${location.name}, ${location.country}`
      cityCountryContainer.innerText = fullLocation;
      locationSuggestion.appendChild(cityCountryContainer);

      locationSuggestion.addEventListener("click", () => {
        clearTimeout(blurTimeout);
        searchInput.value = cityCountryContainer.innerText
        autocompleteContainer.replaceChildren();
        getCurrentWeather(searchInput.value);
      })
      autocompleteContainer.appendChild(locationSuggestion);
    })
  } catch (error) {
    errorContainer.innerText = error;
  }
}

function handleSearchSubmit(event) {
  try {
    event.preventDefault();
    errorContainer.innerText = "";
    const userInput = searchInput.value.trim();
    if (userInput.length === 0) return;
    const firstSuggestion = autocompleteContainer.querySelector(".city-country-container");
    if (firstSuggestion) {
      searchInput.value = firstSuggestion.innerText;
      autocompleteContainer.replaceChildren();
      getCurrentWeather(searchInput.value);
      return;
    }

    throw new Error("Location is not found! Please enter valid location");
  } catch (error) {
    errorContainer.innerText = error.message;
  }
}

const searchForm = document.querySelector(".search-form");
searchInput.addEventListener("input", () => handleSearchInput());

searchInput.addEventListener("focus", () => {
  clearTimeout(blurTimeout);
  errorContainer.innerText = "";
  handleSearchInput();
})


searchInput.addEventListener("blur", () => {
  blurTimeout = setTimeout(() => {
    autocompleteContainer.replaceChildren();
  }, 150);  // 150ms delay
});

searchForm.addEventListener("submit", (event) => {
  handleSearchSubmit(event);
  searchInput.blur();
});

getCurrentWeather();

const headerIcon = document.querySelector(".icon-container img");
headerIcon.src = clearDayIcon;