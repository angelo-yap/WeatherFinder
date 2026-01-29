const topTenCities = document.getElementById('top10-cities');


topTenCities.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('city')){
        console.log('You clicked on: ', event.target.textContent);
        setWeatherLoation(event.target.textContent, '');
    }
})

async function getLocation(city, geocode){
    const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + city + geocode + '&count=1&language=enformat=json');
    const data = await response.json();
    const result = data.results[0];
    return{
        name: result.name || "",
        lat: result.latitude,
        lon: result.longitude
    }
}

async function setWeatherLoation(city, geocode){
    const {name, lat, lon} = await getLocation(city, geocode);
    console.log(name)
    console.log(lat)
    console.log(lon)
    
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m');
    const data = await response.json();
 
    const temp = data.current.temperature_2m;
    const hum = data.current.relative_humidity_2m;
    const wind = data.current.wind_speed_10m;

    console.log(temp)
    
    document.getElementById('location-text').textContent = name; 
    document.getElementById('temperature-text').textContent = temp + '˚C'; 
    document.getElementById('humidity-text').textContent = 'Humidity:\t' + hum + '%'; 
    document.getElementById('wind-text').textContent = 'Wind:\t' + wind + 'km/h';
}