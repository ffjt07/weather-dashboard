// Global Variables
var cityInputEl = $(".textinput");
var searchEl = $("#search");
var recentCities = $("#recentCities");
var currentWeatherList = $("#currentWeather");
var currentWeatherEl = $("#current-container");
var currentTitleList = $("#title-date");
var forecastEl = $(".forecast");
var forecastTitle = $("#foreTitle");
var forecastListEl = $(".forecastList");
var cityListEl = $(".city-list");
var modalEl = $("#addModal");
var closeModal = $(".close");
var oneCallAPI =
  "https://api.openweathermap.org/data/2.5/onecall?appid=9b35244b1b7b8578e6c231fd7654c186";
var geocodeAPI =
  "https://api.openweathermap.org/geo/1.0/direct?appid=38f3fd5cbf0a51883a0c1bfa964630af";
var currentDate = moment();

var citiesArray = [];
var currentConditions = [];
var forecastArray = [];

// Geocode API for lat and long and modal if no city input is provided
function geoLatLon(event) {
  event.stopPropagation();
  recentCities.empty();
  var cityInput = cityInputEl.val();
  if (cityInput !== "") {
    fetch(geocodeAPI + "&q=" + cityInput).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          localStorage.setItem(
            JSON.stringify(data[0].name),
            JSON.stringify(data[0].name)
          );
          cityListRender();
          weatherRetrieve(data);
        });
      }
    });
  } else {
    modalEl.css("display", "block");
  }
}

// Hide Modal
function hideModal(event) {
  event.stopPropagation();
  modalEl.css("display", "none");
}

// Function render recent city weather
function recentCity(event) {
  event.stopPropagation();

  var cityIndex = event.target.getAttribute("data-index");
  fetch(geocodeAPI + "&q=" + cityIndex).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        localStorage.setItem(
          JSON.stringify(data[0].name),
          JSON.stringify(data[0].name)
        );
        weatherRetrieve(data);
      });
    }
  });
}

// retrieve weather based on lat and lon
function weatherRetrieve(data) {
  var lat = `&lat=${data[0].lat}`;
  var lon = `&lon=${data[0].lon}`;
  currentWeatherList.empty();
  currentTitleList.empty();
  currentDate = moment();
  fetch(
    oneCallAPI + lat + lon + "&exclude=hourly,minutely,alerts&units=imperial"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (weather) {
        forecastWeather(weather);
        currentWeather(data, weather);
      });
    }
  });
}

// Display Current Weather Function
function currentWeather(data, weather) {
  currentConditions = [];
  currentWeatherEl.css("display", "block");
  forecastEl.css("display", "block");
  var date = moment().format("MM/DD/YYYY");
  var city = data[0].name;
  var icon = weather.current.weather[0].icon;
  var temp = `Temperature is: ${weather.current.temp}??F`;
  var humid = `Humidity is: ${weather.current.humidity}%`;
  var wind = `Wind Speed is: ${weather.current.wind_speed} MPH`;
  var uv = `UV Index is: ${weather.current.uvi}`;

  currentConditions.push(temp, humid, wind, uv);

  var heading = $("<li>").addClass(
    "current-heading list-inline-item list-unstyled"
  );
  var dateLi = $("<li>").addClass(
    "current-heading list-inline-item list-unstyled"
  );
  var iconLi = $("<li>").addClass(
    "current-heading list-inline-item list-unstyled"
  );
  var iconImg = $("<img>")
    .addClass("current-icon")
    .attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
  heading.text(`${city} `);
  dateLi.text(date);
  iconLi.append(iconImg);
  currentTitleList.append(heading, dateLi, iconLi);

  currentConditions.forEach(function (condition) {
    var condLi = $("<li>")
      .addClass("current-condition list-unstyled p-2")
      .attr("data-index", condition);
    condLi.text(condition);
    currentWeatherList.append(condLi);
  });
  if (0 <= weather.current.uvi && weather.current.uvi < 3) {
    currentWeatherList[0].childNodes[3].style.backgroundColor = "green";
    currentWeatherList[0].childNodes[3].style.color = "white";
  }

  if (2 < weather.current.uvi && weather.current.uvi < 6) {
    currentWeatherList[0].childNodes[3].style.backgroundColor = "yellow";
    currentWeatherList[0].childNodes[3].style.color = "black";
  }

  if (5 < weather.current.uvi && weather.current.uvi < 8) {
    currentWeatherList[0].childNodes[3].style.backgroundColor = "orange";
    currentWeatherList[0].childNodes[3].style.color = "black";
  }

  if (7 < weather.current.uvi && weather.current.uvi < 10) {
    currentWeatherList[0].childNodes[3].style.backgroundColor = "red";
    currentWeatherList[0].childNodes[3].style.color = "white";
  }

  if (9 < weather.current.uvi) {
    currentWeatherList[0].childNodes[3].style.backgroundColor = "purple";
    currentWeatherList[0].childNodes[3].style.color = "white";
  }
}

// Diplay 5-day Forecast
function forecastWeather(weather) {
  forecastArray = [];
  cityInputEl.val("");
  $("ul").remove(".forecast-day");
  forecastTitle.css("display", "block");
  for (i = 0; i < 5; i++) {
    var forecastIcon = weather.daily[i].weather[0].icon;
    var forecastTemp = `Temperature: ${weather.daily[i].temp.max}??F`;
    var forecastWind = `Wind Speed: ${weather.daily[i].wind_speed} MPH`;
    var forecastHumid = `Humidity: ${weather.daily[i].humidity}%`;
    var forecastDate = currentDate.add(i + 1 - i, "days").format("MM/DD/YYYY");
    var forecastObj = {
      date: forecastDate,
      icon: forecastIcon,
      temp: forecastTemp,
      wind: forecastWind,
      humid: forecastHumid,
    };
    forecastArray.push(forecastObj);
  }
  forecastArray.forEach(function (day) {
    var dayUl = $("<ul>").addClass(
      "forecast-day text-white p-2 col-12 col-md-8 col-lg-2"
    );
    var dateLi = $("<li>").addClass("list-unstyled forecast-date");
    var iconLi = $("<li>").addClass("list-unstyled forecast-icon");
    var iconImg = $("<img>")
      .addClass("list-unstyled")
      .attr("src", "https://openweathermap.org/img/wn/" + day.icon + "@2x.png");
    var tempLi = $("<li>").addClass("list-unstyled");
    var windLi = $("<li>").addClass("list-unstyled");
    var humidLi = $("<li>").addClass("list-unstyled");

    dateLi.text(day.date);
    tempLi.text(day.temp);
    windLi.text(day.wind);
    humidLi.text(day.humid);

    iconLi.append(iconImg);
    dayUl.append(dateLi, iconLi, tempLi, windLi, humidLi);
    forecastListEl.append(dayUl);
  });
}

// Add City to recent cities list
function cityListRender() {
  citiesArray = [];
  var cities = Object.keys(localStorage);
  if (cities.length !== 0) {
    for (i = 0; i < cities.length; i++) {
      var citiesList = JSON.parse(localStorage.getItem(cities[i]));
      citiesArray.push(citiesList);
    }

    citiesArray.forEach(function (city) {
      var cityLi = $("<li>")
        .attr("data-index", city)
        .addClass("city-select list-unstyled m-1 p-1 text-white");
      var removeCity = $("<button>")
        .attr("type", "button")
        .addClass("remove m-2 rounded text-white");

      cityLi.text(city);
      removeCity.text("X");

      recentCities.append(cityLi);
      cityLi.append(removeCity);
    });
  }
}

// Remove city function
function removeCity(event) {
  event.stopPropagation();

  var index = event.target.parentElement.getAttribute("data-index");
  citiesArray.splice(index, 1);
  localStorage.removeItem(JSON.stringify(index));
  event.target.parentElement.remove(index);
}

// Event listeners
searchEl.on("click", ".btn", geoLatLon);
cityListEl.on("click", ".remove", removeCity);
cityListEl.on("click", ".city-select", recentCity);
modalEl.on("click", ".close", hideModal);

// Render Recent Cities on page load
cityListRender();
