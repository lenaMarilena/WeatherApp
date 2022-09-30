const mask = document.querySelector(".mask");

window.addEventListener("load", () => {
  mask.classList.add("hide");
  setTimeout(() => {
    mask.remove();
  }, 600);
});

//Элементы
const dateHeading = document.querySelector("#current-date");

const searchForm = document.querySelector("#search-forecast");
const searchedCity = document.querySelector("#searched-city");

const weatherTemp = document.querySelector("#current-display-temp");
const weatherDesc = document.querySelector("#current-display-desc");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const feelsLike = document.querySelector("#feels-like");
const visibility = document.querySelector("#visibility");
const minTemp = document.querySelector("#temp-low");
const maxTemp = document.querySelector("#temp-high");

let mainIcon = document.querySelector("#main-icon");

const celsius = document.querySelector("#celsius");
const fahrenheit = document.querySelector("#fahrenheit");

const locationBtn = document.querySelector(".form-icon");

//API key
const apiKey = "62231151ce343c4d68652e1617efc22f";

let celsiusTemp = null;
let maxCelsTemp = null;
let minCelsTemp = null;
let feelsLikeTemp = null;

//устанавливаем текущую дату
const setDate = () => {
  let date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  dateHeading.innerHTML = `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  }`;
};

setDate();

//конвертируем формат даты
const formatDate = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let day = date.getDay(); //we are getting value from 0 to 6
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
};

//погода на неделю
const displayWeekWeather = (response) => {
  let dailyForecast = response.data.daily;
  const forecast = document.querySelector("#week-forecast");
  let forecastHTML = "";
  for (let i = 1; i < 7; i++) {
    forecastHTML += `
        <div class="col-2">
             <div class="weather-card">
                 <div class="card-date" id="card-date">${formatDate(
                   dailyForecast[i].dt
                 )}</div>
                 <div class="card-image">
                    <img src="images/icons/${
                      dailyForecast[i].weather[0].icon
                    }.png" alt="Sun, clouds and rain" width="50px" height="50px" />
                 </div>
                 <div class="card-temp">
                     <span id="card-temp-high">${Math.round(
                       dailyForecast[i].temp.max
                     )}</span>°/ <span id="card-temp-low">${Math.round(
      dailyForecast[i].temp.min
    )}</span>°
                 </div>
             </div>
         </div>
        `;
  }

  forecast.innerHTML = forecastHTML;
};

const showWeekWeather = (coords) => {
  console.log(coords);
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    )
    .then(displayWeekWeather);
};

//weather API интегрируем
const displayWeather = (response) => {
  celsiusTemp = Math.round(response.data.main.temp);
  searchedCity.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  weatherTemp.innerHTML = `${celsiusTemp}°`;
  weatherDesc.innerHTML = `${response.data.weather[0].main}`;

  maxCelsTemp = Math.round(response.data.main.temp_max);
  minCelsTemp = Math.round(response.data.main.temp_min);
  maxTemp.innerHTML = `${maxCelsTemp}`;
  minTemp.innerHTML = `${minCelsTemp}`;

  //меняем иконку погоды!
  let apiIcon = response.data.weather[0].icon;
  mainIcon.setAttribute("src", `images/icons/${apiIcon}.png`);

  feelsLikeTemp = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `${feelsLikeTemp}`;
  humidity.innerHTML = `${response.data.main.humidity}`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  visibility.innerHTML = `${response.data.visibility / 1000}`;

  showWeekWeather(response.data.coord);
};

const searchData = (city) => {
  //получаем ключ API
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
    .then(displayWeather);
};

searchData("Madrid");

//геолокация
const showLocation = () => {
  let latitude;
  let longitude;
  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
      .then(displayWeather);
  });
};

locationBtn.addEventListener("click", showLocation);

const toFahrenheit = (value) => {
  let res = Math.round((value * 9) / 5 + 32);
  return res;
};

const toCelsius = (value) => {
  let res = Math.round(((value - 32) * 5) / 9);
  return res;
};

const convertToFahr = () => {
  let fahrenheitValue = toFahrenheit(celsiusTemp);
  weatherTemp.innerHTML = `${fahrenheitValue}°`;
  maxTemp.innerHTML = `${toFahrenheit(maxCelsTemp)}`;
  minTemp.innerHTML = `${toFahrenheit(minCelsTemp)}`;
  feelsLike.innerHTML = `${toFahrenheit(feelsLikeTemp)}`;

  //калькуляция прогноза на неделю
  let weeklyMin = document.querySelectorAll("#card-temp-low");
  weeklyMin.forEach((item) => {
    //grabbing a value to convert
    let minValue = item.innerHTML;
    item.innerHTML = `${toFahrenheit(minValue)}`;
  });

  let weeklyMax = document.querySelectorAll("#card-temp-high");
  weeklyMax.forEach((item) => {
    let minValue = item.innerHTML;
    item.innerHTML = `${toFahrenheit(minValue)}`;
  });

  //классы для кнопок добавить и удалить
  fahrenheit.classList.add("active");
  celsius.classList.remove("active");

  //добавляем цельсий
  celsius.addEventListener("click", convertToCelsius);
  fahrenheit.removeEventListener("click", convertToFahr);
};

const convertToCelsius = () => {
  weatherTemp.innerHTML = `${celsiusTemp}°`;
  maxTemp.innerHTML = `${maxCelsTemp}`;
  minTemp.innerHTML = `${minCelsTemp}`;
  feelsLike.innerHTML = `${feelsLikeTemp}`;

  let weeklyMin = document.querySelectorAll("#card-temp-low");
  weeklyMin.forEach((item) => {
    //grabbing a value to convert
    let minValue = item.innerHTML;
    item.innerHTML = `${toCelsius(minValue)}`;
  });

  let weeklyMax = document.querySelectorAll("#card-temp-high");
  weeklyMax.forEach((item) => {
    //grabbing a value to convert
    let minValue = item.innerHTML;
    item.innerHTML = `${toCelsius(minValue)}`;
  });

  fahrenheit.classList.remove("active");
  celsius.classList.add("active");

  fahrenheit.addEventListener("click", convertToFahr);
  celsius.removeEventListener("click", convertToCelsius);
};

fahrenheit.addEventListener("click", convertToFahr);
celsius.addEventListener("click", convertToCelsius);

//работаем над поиском
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = document.querySelector(".form-input");
  searchData(searchInput.value);
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
  fahrenheit.addEventListener("click", convertToFahr);
});
