// === API URLs ===
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Weather Description Mapping
const weatherMap = {
    0: {
      h1: "Sunny",
      h2: "Clear sky",
      p: "A bright and sunny day with clear skies and great visibility."
    },
    1: {
      h1: "Mainly Clear",
      h2: "A few clouds",
      p: "Mostly sunny with a few scattered clouds drifting across the sky."
    },
    2: {
      h1: "Partly Cloudy",
      h2: "Intermittent clouds",
      p: "A mix of sun and clouds, creating a pleasant and balanced day."
    },
    3: {
      h1: "Overcast",
      h2: "Cloud-covered sky",
      p: "The sky is completely covered by clouds, blocking most sunlight."
    },
    45: {
      h1: "Foggy",
      h2: "Low visibility",
      p: "Thick fog limits visibility; the air feels cool and still."
    },
    48: {
      h1: "Rime Fog",
      h2: "Freezing fog",
      p: "Cold foggy conditions may cause frost buildup on surfaces."
    },
    51: {
      h1: "Light Drizzle",
      h2: "Gentle rainfall",
      p: "A fine drizzle keeps the ground damp and the air moist."
    },
    53: {
      h1: "Moderate Drizzle",
      h2: "Consistent light rain",
      p: "Light but steady drizzle throughout the day."
    },
    55: {
      h1: "Dense Drizzle",
      h2: "Heavy mist",
      p: "Thick drizzle blurs the horizon and leaves a misty feel."
    },
    61: {
      h1: "Light Rain",
      h2: "Occasional showers",
      p: "Gentle rainfall with brief pauses between showers."
    },
    63: {
      h1: "Moderate Rain",
      h2: "Steady rain",
      p: "Consistent rainfall through the day, possibly with wind gusts."
    },
    65: {
      h1: "Heavy Rain",
      h2: "Strong showers",
      p: "Intense rainfall reducing visibility and soaking surroundings."
    },
    71: {
      h1: "Light Snow",
      h2: "Gentle flurries",
      p: "Soft snowflakes drifting slowly to the ground."
    },
    73: {
      h1: "Moderate Snow",
      h2: "Snowy weather",
      p: "Snowfall creating a white layer on roads and rooftops."
    },
    75: {
      h1: "Heavy Snow",
      h2: "Blizzard conditions",
      p: "Thick snow reducing visibility and covering everything in white."
    },
    77: {
      h1: "Snow Grains",
      h2: "Tiny snow particles",
      p: "Fine snow grains falling intermittently in cold air."
    },
    80: {
      h1: "Light Showers",
      h2: "Scattered rain",
      p: "Intermittent light showers, often followed by sunshine."
    },
    81: {
      h1: "Moderate Showers",
      h2: "Passing rain",
      p: "Occasional bursts of moderate rain throughout the day."
    },
    82: {
      h1: "Heavy Showers",
      h2: "Downpour",
      p: "Sudden and strong showers with heavy rain bursts."
    },
    85: {
      h1: "Snow Showers",
      h2: "Snowfall bursts",
      p: "Frequent snow showers making the air crisp and white."
    },
    86: {
      h1: "Heavy Snow Showers",
      h2: "Intense snow",
      p: "Thick snow falling quickly and reducing visibility."
    },
    95: {
      h1: "Thunderstorm",
      h2: "Lightning and thunder",
      p: "Thunderclouds dominate the sky; short but intense rain expected."
    },
    96: {
      h1: "Thunderstorm with Hail",
      h2: "Lightning & hail",
      p: "Severe thunderstorm activity accompanied by small hailstones."
    },
    99: {
      h1: "Severe Thunderstorm",
      h2: "Heavy rain and hail",
      p: "Powerful storm with lightning, thunder, and possible hail."
    }
  };

// select elements from html 
let form = document.querySelector('form')
let input = document.querySelector('input')
let locationBtn = document.querySelector('#locationBtn')
let currentDateTime = document.querySelector('#currentDateTime')
let currentTemperatur = document.querySelector('#current-temperature')
let locationDisplay = document.querySelector('#locationDisplay')
let humidityLevel = document.querySelector('#humidityLevel')
let windSpeed = document.querySelector('#windSpeed')
let forecastCard = document.querySelectorAll('.forecast-card')
let weatherCondition= document.querySelector('#weatherCondition')
let weatherDescription= document.querySelector('#weatherDescription')
let weatherExplanation= document.querySelector('#weatherExplanation')

// time updation
const date = new Date()
const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
currentDateTime.textContent = `${formattedDate} | ${formattedTime}`;
// --------------------------


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

    // Current weather section updation
    currentTemperatur.innerHTML = `${Math.round(data.current.temperature_2m)}<span class="text-4xl md:text-6xl">${data.current_units.temperature_2m}</span>`
    locationDisplay.textContent = locationName
    humidityLevel.textContent = `${data.current.relative_humidity_2m}%`
    windSpeed.textContent = `${data.current.wind_speed_10m}km/h`
    weatherCondition.textContent=`${weatherMap[data.current.weathercode].h1 || 'unknown'}`
    weatherDescription.textContent=`${weatherMap[data.current.weathercode].h2 || "No data available" }`
    weatherExplanation.textContent=`${weatherMap[data.current.weathercode].p || ""}`

    // 5 days forecast updation
    forecastCard.forEach((cards, index) => {
        if (index < 5) {
            const minTemp = Math.round(data.daily.temperature_2m_min[index]);
            const minTempUnit = data.daily_units.temperature_2m_min
            const maxTemp = Math.round(data.daily.temperature_2m_max[index]);
            const maxTempUnit = data.daily_units.temperature_2m_max
            const date = new Date(data.daily.time[index]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            // weather code for cloude icons 
            const weathericon=getCloudIcon(data.daily.weathercode[index])


            cards.innerHTML = `<h3 class="text-xs md:text-sm text-white/60 mb-1">${dayName}</h3>
          <h2 class="text-xs mb-2 md:mb-3 text-white/50">${data.daily.time[index]}</h2>
          <i class="fas fa-${weathericon} text-3xl md:text-4xl lg:text-5xl my-2 md:my-3" style="text-shadow: 0 0 20px rgba(255,255,255,0.5)"></i>
          <h1 class="text-2xl md:text-3xl font-light mt-auto">${minTemp}${minTempUnit}-${maxTemp}${maxTempUnit}</h1>`
        }
    })
}

// get cloud icon using weather code in api
function getCloudIcon(iconCode){
    const c = Number(iconCode);
  if (c === 0) return 'sun';
  if (c >= 1 && c <= 3) return 'cloud-sun';
  if ((c >= 45 && c <= 48)) return 'smog';
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'cloud-showers-heavy';
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return 'snowflake';
  if (c >= 95 && c <= 99) return 'bolt';
  return 'cloud';
}

function getWeatherTextDetails(iconCode){
    
}


function showError(error) {
    let errorEl = document.querySelector('#error')
    errorEl.textContent = error
    errorEl.classList.remove = 'hidden'
    setTimeout(() => {
        errorEl.classList.add('hidden')
    }, 4000);
}