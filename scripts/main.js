// === API URLs ===
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// === DOM Elements ===
const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const locationBtn = document.getElementById('locationBtn');
const resultDiv = document.getElementById('result');

// === Main Function ===
async function getWeatherByCity(city) {
  try {
    // Step 1: Get Lat/Long
    const geoRes = await fetch(`${GEOCODING_URL}?name=${city}&count=1&language=en&format=json`);
    const geo = await geoRes.json();
    if (!geo.results?.[0]) throw new Error('City not found');

    const { latitude, longitude, name, country } = geo.results[0];

    // Step 2: Get Weather
    const params = new URLSearchParams({
      latitude, longitude,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode',
      daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      temperature_unit: 'celsius',
      timezone: 'auto',
      forecast_days: 5
    });

    const weatherRes = await fetch(`${WEATHER_URL}?${params}`);
    const data = await weatherRes.json();

    // === Display Result ===
    resultDiv.innerHTML = `
      <h2 class="text-xl font-bold">${name}, ${country}</h2>
      <p><strong>Now:</strong> ${data.current.temperature_2m}°C | 
         Humidity: ${data.current.relative_humidity_2m}% | 
         Wind: ${data.current.wind_speed_10m} km/h</p>
      <p><strong>Today:</strong> ${data.daily.temperature_2m_min[0]}°C - ${data.daily.temperature_2m_max[0]}°C</p>
      <pre class="text-xs mt-2 bg-gray-700 p-2 rounded overflow-auto">${JSON.stringify(data,null,4)}</pre>
    `;

  } catch (err) {
    resultDiv.innerHTML = `<p class="text-red-400">Error: ${err.message}</p>`;
  }
}

// === Form Submit ===
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) await getWeatherByCity(city);
});


