import { makeSuggestionsUI } from "./weatherUI";
import getCurrentWeather from "./currentWeather";

async function handleSearchInput(searchInput, autocompleteContainer, errorContainer) {
  try {
    const userQuery = searchInput.value.trim();
    autocompleteContainer.replaceChildren();
    if (userQuery.length === 0) return;

    const queryResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=a163bf31947f4c38b92111525240108&q=${userQuery}`, {mode: "cors"});
    if (!queryResponse.ok) throw new Error("Sorry, something went wrong!");

    const queryData = await queryResponse.json();
    queryData.forEach(location => makeSuggestionsUI(location, searchInput, autocompleteContainer));
  } catch (error) {
    errorContainer.innerText = error;
  }
}

function handleSearchSubmit(event, searchInput, autocompleteContainer, errorContainer) {
  try {
    event.preventDefault();
    errorContainer.innerText = "";
    const userInput = searchInput.value.trim();
    if (userInput.length === 0) return;
    
    const firstSuggestion = autocompleteContainer.querySelector(".location-suggestion");
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

export { handleSearchInput, handleSearchSubmit };