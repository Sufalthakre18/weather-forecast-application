// === API URLs ===
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';


let form = document.querySelector('form')
let input = document.querySelector('input')

let locationBtn = document.querySelector('#locationBtn')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value.trim() == '') return
    else getWeatherByCity(input.value.trim())
})

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locationBtn.innerHTML = `<i class="fas fa-location-arrow mr-2"></i> Getting Location...`
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(`your city lat :${position.coords.latitude} long:${position.coords.longitude}`);
            await getWeatherByCords(position.coords.latitude, position.coords.longitude)
        },
            (error) => {
                document.getElementById('locationBtn').innerHTML = '<i class="fas fa-location-arrow mr-2"></i>Use your Location';
                showError('Unable to get your location. Please enable location services.');
            })

    } else {
        showError("Unable to get your location")
    }
})



async function getWeatherByCity(city) {
    try {
        const geo = await fetch(`${GEOCODING_URL}?name=${city}&count=1&language=en&format=json`)
        const data = await geo.json()
        console.log(data);
        if (!data.results?.[0]) showError("City not found")

        const { latitude, longitude, name, country } = data.results[0];
        return await fetchWeatherData(latitude, longitude, `${name} ${country}`)

    } catch (error) {
        console.log("error :", error);
    }

}

async function getWeatherByCords(lat, lon) {
    return await fetchWeatherData(lat, lon, 'Your location...')
}

async function fetchWeatherData(lat, lon, locationName) {
    let params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        temperature_unit: 'celsius',
        timezone: 'auto',
        forecast_days: 5
    })

    const weather = await fetch(`${WEATHER_URL}?${params}`)
    const data = await weather.json()
    console.log(data);



}

function showError(error) {
    let errorEl = document.querySelector('#error')
    errorEl.textContent = error
    errorEl.classList.remove = 'hidden'
    setTimeout(() => {
        errorEl.classList.add('hidden')
    }, 4000);
}