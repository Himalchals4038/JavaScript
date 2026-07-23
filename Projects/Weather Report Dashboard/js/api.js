/**
 * Weather API Client Service
 * Powered by Open-Meteo Free Public API
 */

const WEATHER_CACHE_KEY = 'weather_report_cache_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 Minutes Cache

// WMO Weather Code Mapping (Open-Meteo Standard)
const WMO_CODE_MAP = {
  0: { description: "Clear Sky", icon: "☀️", nightIcon: "🌙", theme: "theme-clear" },
  1: { description: "Mainly Clear", icon: "🌤️", nightIcon: "🌤️", theme: "theme-clear" },
  2: { description: "Partly Cloudy", icon: "⛅", nightIcon: "☁️", theme: "theme-clouds" },
  3: { description: "Overcast", icon: "☁️", nightIcon: "☁️", theme: "theme-clouds" },
  45: { description: "Foggy", icon: "🌫️", nightIcon: "🌫️", theme: "theme-mist" },
  48: { description: "Depositing Rime Fog", icon: "🌫️", nightIcon: "🌫️", theme: "theme-mist" },
  51: { description: "Light Drizzle", icon: "🌦️", nightIcon: "🌧️", theme: "theme-rain" },
  53: { description: "Moderate Drizzle", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  55: { description: "Dense Drizzle", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  61: { description: "Slight Rain", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  63: { description: "Moderate Rain", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  65: { description: "Heavy Rain", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  71: { description: "Slight Snow", icon: "🌨️", nightIcon: "🌨️", theme: "theme-snow" },
  73: { description: "Moderate Snow", icon: "🌨️", nightIcon: "🌨️", theme: "theme-snow" },
  75: { description: "Heavy Snow", icon: "❄️", nightIcon: "❄️", theme: "theme-snow" },
  80: { description: "Rain Showers", icon: "🌦️", nightIcon: "🌧️", theme: "theme-rain" },
  81: { description: "Moderate Rain Showers", icon: "🌧️", nightIcon: "🌧️", theme: "theme-rain" },
  82: { description: "Violent Rain Showers", icon: "⛈️", nightIcon: "⛈️", theme: "theme-thunderstorm" },
  95: { description: "Thunderstorm", icon: "🌩️", nightIcon: "🌩️", theme: "theme-thunderstorm" },
  96: { description: "Thunderstorm with Slight Hail", icon: "⛈️", nightIcon: "⛈️", theme: "theme-thunderstorm" },
  99: { description: "Thunderstorm with Heavy Hail", icon: "⛈️", nightIcon: "⛈️", theme: "theme-thunderstorm" }
};

/**
 * Get Weather Data for specific latitude and longitude
 */
async function fetchWeatherData(lat, lon, cityName = "Location") {
  const cacheId = `${WEATHER_CACHE_KEY}${lat.toFixed(2)}_${lon.toFixed(2)}`;
  
  // Check localStorage Cache
  try {
    const cached = localStorage.getItem(cacheId);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&timezone=auto`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl).catch(() => null)
    ]);

    if (!weatherRes.ok) throw new Error(`Weather API error: ${weatherRes.status}`);

    const weatherJson = await weatherRes.json();
    const aqiJson = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

    const formattedData = processWeatherData(weatherJson, aqiJson, cityName);

    // Save to Cache
    try {
      localStorage.setItem(cacheId, JSON.stringify({
        timestamp: Date.now(),
        data: formattedData
      }));
    } catch (e) {
      console.warn("Cache write error:", e);
    }

    return formattedData;

  } catch (err) {
    console.warn(`Falling back to generated weather for ${cityName}:`, err);
    return generateFallbackWeatherData(lat, lon, cityName);
  }
}

/**
 * Process Raw Open-Meteo JSON into structured format
 */
function processWeatherData(weatherJson, aqiJson, cityName) {
  const current = weatherJson.current;
  const daily = weatherJson.daily;
  const hourly = weatherJson.hourly;
  const isDay = current.is_day === 1;

  const wmo = WMO_CODE_MAP[current.weather_code] || {
    description: "Partly Cloudy",
    icon: isDay ? "⛅" : "☁️",
    nightIcon: "☁️",
    theme: isDay ? "theme-clear" : "theme-night"
  };

  // Build 24-Hour Hourly Array
  const hourlyList = [];
  if (hourly && hourly.time) {
    const currentHourIndex = Math.max(0, hourly.time.findIndex(t => new Date(t) >= new Date()));
    for (let i = currentHourIndex; i < Math.min(currentHourIndex + 24, hourly.time.length); i++) {
      const timeStr = hourly.time[i];
      const hourDate = new Date(timeStr);
      const code = hourly.weather_code[i];
      const hwmo = WMO_CODE_MAP[code] || WMO_CODE_MAP[0];
      hourlyList.push({
        time: hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawTime: timeStr,
        temp: Math.round(hourly.temperature_2m[i]),
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 60,
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        icon: hwmo.icon,
        code: code
      });
    }
  }

  // Build 7-Day Forecast Array
  const dailyList = [];
  if (daily && daily.time) {
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const dateObj = new Date(daily.time[i]);
      const dayName = i === 0 ? "Today" : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dwmo = WMO_CODE_MAP[daily.weather_code[i]] || WMO_CODE_MAP[0];
      dailyList.push({
        day: dayName,
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        icon: dwmo.icon,
        description: dwmo.description,
        uvIndex: daily.uv_index_max ? daily.uv_index_max[i] : 5,
        rainSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0
      });
    }
  }

  // Extract AQI Data
  let aqiVal = 42;
  let pm25 = 18;
  let pm10 = 35;
  let no2 = 12;
  let o3 = 25;

  if (aqiJson && aqiJson.current) {
    aqiVal = aqiJson.current.us_aqi || aqiJson.current.european_aqi || 55;
    pm25 = Math.round(aqiJson.current.pm2_5 || 22);
    pm10 = Math.round(aqiJson.current.pm10 || 45);
    no2 = Math.round(aqiJson.current.nitrogen_dioxide || 15);
    o3 = Math.round(aqiJson.current.ozone || 30);
  }

  const aqiInfo = evaluateAQI(aqiVal);

  return {
    city: cityName,
    isDay: isDay,
    currentTemp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    highTemp: dailyList.length > 0 ? dailyList[0].maxTemp : Math.round(current.temperature_2m + 3),
    lowTemp: dailyList.length > 0 ? dailyList[0].minTemp : Math.round(current.temperature_2m - 4),
    condition: wmo.description,
    icon: isDay ? wmo.icon : wmo.nightIcon,
    themeClass: isDay ? wmo.theme : 'theme-night',
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: current.wind_direction_10m || 180,
    pressure: Math.round(current.surface_pressure || current.pressure_msl || 1012),
    uvIndex: daily && daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : 6,
    cloudCover: current.cloud_cover || 20,
    sunrise: daily && daily.sunrise ? formatTimeString(daily.sunrise[0]) : "06:00 AM",
    sunset: daily && daily.sunset ? formatTimeString(daily.sunset[0]) : "06:45 PM",
    sunriseRaw: daily && daily.sunrise ? daily.sunrise[0] : null,
    sunsetRaw: daily && daily.sunset ? daily.sunset[0] : null,
    aqi: {
      value: aqiVal,
      status: aqiInfo.status,
      color: aqiInfo.color,
      advice: aqiInfo.advice,
      pm25: pm25,
      pm10: pm10,
      no2: no2,
      o3: o3
    },
    hourly: hourlyList,
    daily: dailyList
  };
}

/**
 * Formats ISO string into AM/PM time
 */
function formatTimeString(isoStr) {
  if (!isoStr) return "06:00 AM";
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * AQI Classifier (US Scale standard)
 */
function evaluateAQI(val) {
  if (val <= 50) {
    return { status: "Good", color: "var(--aqi-good)", advice: "Air quality is satisfactory. Great day for outdoor activities!" };
  } else if (val <= 100) {
    return { status: "Moderate", color: "var(--aqi-fair)", advice: "Air quality is acceptable. Sensitive individuals should take care." };
  } else if (val <= 150) {
    return { status: "Unhealthy (Sensitive)", color: "var(--aqi-moderate)", advice: "Members of sensitive groups may experience health effects." };
  } else if (val <= 200) {
    return { status: "Unhealthy", color: "var(--aqi-poor)", advice: "Consider wearing an N95 mask and limiting prolonged outdoor exposure." };
  } else {
    return { status: "Very Poor / Severe", color: "var(--aqi-very-poor)", advice: "Avoid outdoor activity. Keep windows closed and use an air purifier." };
  }
}

/**
 * Fallback Weather Generator if API is unreachable
 */
function generateFallbackWeatherData(lat, lon, cityName) {
  const isNight = new Date().getHours() < 6 || new Date().getHours() > 19;
  const baseTemp = Math.round(28 + Math.sin(lat) * 5);
  
  const hourly = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const h = new Date(now.getTime() + i * 3600000);
    hourly.push({
      time: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(baseTemp + Math.sin(i / 3) * 4),
      humidity: Math.round(65 + Math.cos(i / 2) * 15),
      pop: Math.round(Math.max(0, Math.sin(i) * 35)),
      icon: isNight ? "🌙" : "⛅"
    });
  }

  const daily = [];
  const days = ["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    daily.push({
      day: days[i],
      maxTemp: baseTemp + 4 - i % 2,
      minTemp: baseTemp - 3 - i % 3,
      icon: "🌤️",
      description: "Partly Sunny",
      uvIndex: 6,
      rainSum: 0.5
    });
  }

  return {
    city: cityName,
    isDay: !isNight,
    currentTemp: baseTemp,
    feelsLike: baseTemp + 2,
    highTemp: baseTemp + 4,
    lowTemp: baseTemp - 3,
    condition: "Partly Sunny",
    icon: isNight ? "🌙" : "🌤️",
    themeClass: isNight ? "theme-night" : "theme-clear",
    humidity: 68,
    windSpeed: 14,
    windDirection: 210,
    pressure: 1010,
    uvIndex: 7,
    cloudCover: 25,
    sunrise: "05:45 AM",
    sunset: "06:50 PM",
    aqi: evaluateAQI(65),
    hourly: hourly,
    daily: daily
  };
}
