import './style.css';
import clearDayIcon from './icons/clear-day.svg';
import getCurrentWeather from './js/currentWeather';
import { handleSearchInput, handleSearchSubmit } from './js/searchInput';

const errorContainer = document.querySelector(".error-container");
const searchInput = document.querySelector("#location-search");
const autocompleteContainer = document.querySelector("#autocomplete-container");
const searchForm = document.querySelector(".search-form");
let blurTimeout;

const headerIcon = document.querySelector(".icon-container img");
headerIcon.src = clearDayIcon;

getCurrentWeather(null, errorContainer);

searchInput.addEventListener("input", () => handleSearchInput(searchInput, autocompleteContainer, errorContainer));

searchInput.addEventListener("focus", () => {
  clearTimeout(blurTimeout);
  errorContainer.innerText = "";
  handleSearchInput(searchInput, autocompleteContainer, errorContainer);
})

searchInput.addEventListener("blur", () => {
  blurTimeout = setTimeout(() => {
    autocompleteContainer.replaceChildren();
  }, 500);
});

searchForm.addEventListener("submit", (event) => {
  handleSearchSubmit(event, searchInput, autocompleteContainer, errorContainer);
  searchInput.blur();
});