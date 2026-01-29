const button = document.getElementById('submit-button');

button.addEventListener('click', function (event){
    event.preventDefault();
    var city = document.getElementById('location-input').value;
    console.log(city);
    setWeatherLocation(city, '&countryCode=CA')
})


async function getLocation(city, geocode){
    const response = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + city + '&count=10&language=enformat=json' + geocode);
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
        alert("Invalid City.")
        return;
    }
}

async function setWeatherLocation(city, geocode){
    const {name, loc, lat, lon} = await getLocation(city, geocode);
    if (!name || !lat || !lon){
        return;
    }
    console.log(name)
    console.log(loc)
    console.log(lat)
    console.log(lon)
    
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m');
    const data = await response.json();
 
    const temp = data.current.temperature_2m;
    const hum = data.current.relative_humidity_2m;
    const wind = data.current.wind_speed_10m;

    console.log(temp)
    
    document.getElementById('location-text').textContent = name; 
    document.getElementById('location-description').textContent = loc;
    document.getElementById('temperature-text').textContent = temp + '˚C'; 
    document.getElementById('humidity-text').textContent = 'Humidity:\t' + hum + '%'; 
    document.getElementById('wind-text').textContent = 'Wind:\t' + wind + 'km/h';
}