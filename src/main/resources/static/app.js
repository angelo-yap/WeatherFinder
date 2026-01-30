const button = document.getElementById('submit-button');
const topTenCities = document.getElementById('top10-cities');
const spinner = document.getElementById("spinner");

// Shows Vancouver weather when when website is first loaded
window.onload = setWeather('Vancouver', '');

// EventListener for Top 10 Cities list allowing you to click
// a city to display the weather & additional information for that city.
topTenCities.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('city')){
        console.log('You clicked on: ', event.target.textContent);
        // Empty string is passed as geocode to allow global cities to be entered a global city
        setWeather(event.target.textContent, '');
    }
})

// EventListener for 'View City' Button allowing you to type a city into
// the search box and click enter to display the weather & additional information for that city.
button.addEventListener('click', function (event){
    event.preventDefault();
    var city = document.getElementById('location-input').value;
    console.log(city);
    setWeather(city, '&countryCode=CA')
})

// getLocation function to call Open-Meteo geocoding API and returns 
// the name of the city, the governing body,
// the latitude, and the longitude. Throws and alert if there are no results.
// @Param city as city to be grabbed.
// @Param countryCode as the country the search is limited to.
async function getLocation(city, countryCode){
    const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + city 
                                 + '&count=10&language=enformat=json' + countryCode);
    const data = await response.json();
    try{
        const result = data.results[0];
        return{
            name: result.name || "",
            loc: result.admin1,
            lat: result.latitude,
            lon: result.longitude
        }
    }catch (err) {
        alert("No Results." )
        return;
    }
}

// getWeather function to call Open-Meteo forecast API and returns 
// the temperature, humidity, and wind speed
// of the given latitude and longitude
// @Param lat as latitude of target location
// @Param lon as longitude of target location
async function getWeather(lat, lon){
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' 
                                     + lon + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m');
        const data = await response.json();
        try{    
            return{
                temp: data.current.temperature_2m,
                hum:  data.current.relative_humidity_2m,
                wind: data.current.wind_speed_10m
            }
        }catch (err){
            alert("API Request failed: " + err)
            return;
        }
}

// setWeather function to calls getLocation and getWeather to display
// the city name, governing body, temperature, wind speed, and humidity. 
// If there is no data pulled from the response,
// "Forecast API request failed" is displayed as an alert.
// @Param city as city to be grabbed.
// @Param countryCode as the country the search is limited to.
async function setWeather(city, countryCode){
    displaySpinner();
    let name, loc, lat, lon;
    try{
        const location = await getLocation(city, countryCode);
        name = location.name;
        loc = location.loc;
        lat = location.lat;
        lon = location.lon;
        console.log(name)
        console.log(loc)
        console.log(lat)
        console.log(lon)
    }catch (err){  
        hideSpinner();
        return;
    }
    let temp, hum, wind;
    try{
        const forecast = await getWeather(lat, lon);
        temp = forecast.temp;
        hum = forecast.hum;
        wind = forecast.wind;
    }catch (err){
        alert("getWeather failed: " + err);
        return;
    }
    try{
        console.log(temp);
        console.log(hum);
        console.log(wind);
        
        // Display Information
        document.getElementById('location-text').textContent = name; 
        document.getElementById('location-description').textContent = loc;
        document.getElementById('temperature-text').textContent = temp + '˚C'; 
        document.getElementById('wind-text').innerHTML = "<b>Wind:</b>\t" + wind + 'km/h';
        document.getElementById('humidity-text').innerHTML = "<b>Humidity:</b>\t" + hum + '%'; 
       
    }catch (err){
        alert("setWeather failed: " + err);
    }
    hideSpinner();
}

// Displays spinner
function displaySpinner(){
    spinner.classList.remove("spinner-hidden");
}
// Hides spinner
function hideSpinner(){
    spinner.classList.add("spinner-hidden");
}
