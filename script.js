var apiKey = "88f678c81c120fa2b39614d3bd96dc90";
var searchButton = $(".searchButton");
var searchInput = $(".searchInput");
var theCityName = $(".cityName");
var theCurrentDate = $(".currentDate");
var theWeatherIcon = $(".weatherIcon");
var theSearchHistory = $(".historyItems");
var theTemperature = $(".temp");
var theHumidity = $(".humidity");
var theWindSpeed = $(".windSpeed");
var TheUvIndex = $(".uvIndex");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;

if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
   
}else{
    
    SearchHistory();
}

searchButton.on("click", function(e) {
    e.preventDefault();
    console.log("clicked button")
    pullWeather(searchInput.val());
});

$(document).on("click", ".historyEntry", function() {
    let thisElement = $(this);
    Weather(thisElement.text());
})

function SearchHistory(cityName) {
    theSearchHistory.empty();
    let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (let i = 0; i < searchHistoryArr.length; i++) {
        let newListItem = $("<li>").attr("class", "historyEntry");
        newListItem.text(searchHistoryArr[i]);
        theSearchHistory.prepend(newListItem);
    }
}

function WeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    theCityName.text(cityName)
    theCurrentDate.text(`(${today})`)
    theTemperature.text(`Temperature: ${cityTemp} °F`);
    theHumidity.text(`Humidity: ${cityHumidity}%`);
    theWindSpeed.text(`Wind Speed: ${cityWindSpeed} MPH`);
    TheUvIndex.text(`UV Index: ${uvVal}`);
    theWeatherIcon.attr("src", cityWeatherIcon);
}

function pullWeather(desiredCity) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        let cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherData.wind.speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvData) {
        if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
            let searchHistoryArr = [];
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                WeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                SearchHistory(cityObj.cityName);
            }else{
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                WeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }else{
            let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                WeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                SearchHistory(cityObj.cityName);
            }else{
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                WeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }
    }) 
    });

}

