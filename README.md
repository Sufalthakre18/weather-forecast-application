# Weather Forecast Application

A clean, responsive weather forecast web app built with **Vanilla JavaScript**, **HTML5**, **Tailwind CSS**, and the **Open-Meteo** API.
Shows current weather, a 5-day forecast, location search & geolocation, recent searches, a °C/°F toggle (today only), animated background, wind/humidity graphs, and friendly UI error handling.

---

#### live Project : [live Project]()
#### Source code : [Github link](https://github.com/Sufalthakre18/weather-forecast-application)

## ⚙️ Technologies Used

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (ES6+)
* **API:** Open-Meteo (Geocoding API and Forecast API)
* ## API used

* **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search`
* **Weather / Forecast:** `https://api.open-meteo.com/v1/forecast`


## Features (implemented)

* Search weather by **city name** (geocoding via Open-Meteo).
* **Use my location** (browser geolocation).
* Current weather: temperature, humidity, wind speed, descriptive headline and explanation.
* **Temperature unit toggle** (°C / °F) — toggles *today’s* displayed temperature only.
* **5-day forecast** with date, min/max temp, wind and humidity, and condition icon.
* **Recent searches dropdown** (stored in `localStorage`) with up to 5 recent cities.
* Dynamic animated background (sunny, cloudy, rainy, stormy, snowy) and rain animation.
* Small animated graphs for wind & humidity (SVG path).
* Input validation (empty, short, invalid characters).
* UI error messages via a non-blocking popup (no `alert()` calls).
* Defensive API error handling (try/catch + user-friendly error message).

---

## Usage

* Type a city (e.g., `Delhi`) and press Enter or click the search icon.
* Or click **Use My Location** to retrieve weather for your current coordinates (allow the browser to use location).
* Select a city from **Recent Searches** to reload that city.
* Click the `°C` toggle to switch to `°F` (today only).
* If temperature is extreme, an alert banner appears (Heat > 40°C, Cold < 5°C).
* Error messages show as a small popup at bottom-right.

---



## Author / Contact

**Sufal Thakre** — author of this project.
- email: `sufalthakre4@gmail.com`

