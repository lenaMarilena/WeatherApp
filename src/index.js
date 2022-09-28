function whatCurrentDate() {
  let nowDate = new Date();

  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayIndex = nowDate.getDay();
  let dayOfWeek = week[dayIndex];
  let hours = nowDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = nowDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dateToday = document.querySelector("#last-update");
  dateToday.innerHTML = `Last update: ${dayOfWeek}, ${hours}:${minutes}`;
}

function toFahrenheit() {
  let celsius = 28;
  let fahrenheit = Math.round(celsius * (9 / 5) + 32);
  let valueMax = document.querySelector(".value-max");
  valueMax.innerHTML = `${fahrenheit}`;
}
function toCelsius() {
  let valueMax = document.querySelector(".value-max");
  valueMax.innerHTML = "28";
}

whatCurrentDate();

let fahrenheitValue = document.querySelector(".fahrenheit");
fahrenheitValue.addEventListener("click", toFahrenheit);

let celsiusValue = document.querySelector(".celsius");
celsiusValue.addEventListener("click", toCelsius);

function showCurrentCityTemp(response) {
  let currentMaxTemp = Math.round(response.data.main.temp_max);
  let currentMinTemp = Math.round(response.data.main.temp_min);
  let currentCity = response.data.name;
  let maxTemp = document.querySelector("#value-max");
  let minTemp = document.querySelector("#value-min");
  let h1 = document.querySelector("h1");
  h1.innerHTML = currentCity;
  maxTemp.innerHTML = currentMaxTemp;
  minTemp.innerHTML = currentMinTemp;
}

function showLocationByPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "62231151ce343c4d68652e1617efc22f";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let apiUrl = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentCityTemp);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showLocationByPosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentLocation);

function showLocationByCity(cityName) {
  let apiKey = "34ae1065362d42545661451bda2b8a1f";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let apiUrlCity = `${apiEndpoint}?q=${cityName}&appid=${apiKey}&units=${units}`;
  console.log(apiUrlCity);
  axios.get(apiUrlCity).then(showCurrentCityTemp);
}

function showCheckedCityTemp(event) {
  event.preventDefault();

  let input = document.querySelector("#your-city");
  showLocationByCity(input.value);
}

showLocationByCity("Madrid");

let form = document.querySelector("#search-form");
form.addEventListener("submit", showCheckedCityTemp);

function CloudsStatus(response) {
  let descriptionElement = document.querySelector("description");
  let humidityElement = document.querySelector("humidity");
  descriptionElement.innerHTML = response.data.weather[0].description;
humidityElement.innerHTML = response.data.main.humidity;
}
