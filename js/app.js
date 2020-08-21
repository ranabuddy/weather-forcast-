//fetch api data over http or https
if (location.protocol === "http:") {
  url =
    "http://api.openweathermap.org/data/2.5/weather?lat=21.1682895&lon=-101.6723306&units=imperial&APPID=ec50a6072ac189dee111acdd3a38ab9f";
} else {
  url =
    "https://api.openweathermap.org/data/2.5/weather?lat=21.1682895&lon=-101.6723306&units=imperial&APPID=ec50a6072ac189dee111acdd3a38ab9f";
}

const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const windSpeed = document.querySelector(".wind-speed p");
const Rainfall = document.querySelector(".rainfall p");
const sunRise = document.querySelector(".sun-rise p");

//App data
const weather = {};

weather.temperature = {
  unit: "celsius"
};

//App consts and vars
const kelvin = 273;
//api key
const key = "a9d07629c18a1fbf2c76a9f77e5af621";

//CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

//SET USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

//show error when geolocation blocked
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      weather.temperature.value = Math.floor(data.main.temp - kelvin);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.speed = data.wind.speed;
      weather.rain = data.rain;
      weather.sunrise = data.sys.sunrise;
      weather.sunset = data.sys.sunset;
    })
    .then(function() {
      displayWeather();
    });
}
//conversion of utc time to local time
function sunRisetime() {
  unixTimestamp = `${weather.sunrise}`;

  // convert to milliseconds and
  // then create a new Date object
  dateObj = new Date(unixTimestamp * 1000);
  utcString = dateObj.toUTCString();

  time = utcString.slice(-11, -4);

  return time;
}
function sunsetime() {
  unixTimestamp = `${weather.sunset}`;

  // convert to milliseconds and
  // then create a new Date object
  dateObj = new Date(unixTimestamp * 1000);
  utcString = dateObj.toUTCString();

  time = utcString.slice(-11, -4);

  return time;
}

// DISPLAY WEATHER
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
  windSpeed.innerHTML = `Wind: ${weather.speed} meter/sec`;
  Rainfall.innerHTML = `Rain: ${weather.rain} mm`;
  Rainfall.innerHTML =
    `Sunrise: ` + sunRisetime() + ` GMT <br> Sunset: ` + sunsetime() + " GMT";
}
