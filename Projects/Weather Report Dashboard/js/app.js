/**
 * Weather Report Dashboard - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentCity: INDIAN_CITIES[0], // Default: Mumbai
    weatherData: null,
    isFahrenheit: false,
    favorites: JSON.parse(localStorage.getItem('weather_favs') || '["Mumbai", "Delhi", "Bengaluru"]'),
    activeFilter: 'ALL', // ALL, TIER1, TIER2, NORTH, SOUTH, WEST, EAST, CENTRAL, NORTHEAST
    activeDirectoryTab: 'ALL',
    compareCities: []
  };

  // DOM Element References
  const searchInput = document.getElementById('searchInput');
  const autocompleteDropdown = document.getElementById('autocompleteDropdown');
  const geoBtn = document.getElementById('geoBtn');
  const unitCelsiusBtn = document.getElementById('unitCelsius');
  const unitFahrenheitBtn = document.getElementById('unitFahrenheit');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const favBtn = document.getElementById('heroFavBtn');
  const compareBtn = document.getElementById('compareBtn');

  // Hero Display Elements
  const heroCity = document.getElementById('heroCity');
  const heroState = document.getElementById('heroState');
  const heroTierBadge = document.getElementById('heroTierBadge');
  const currentTemp = document.getElementById('currentTemp');
  const tempUnitSymbol = document.getElementById('tempUnitSymbol');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherCondition = document.getElementById('weatherCondition');
  const feelsLike = document.getElementById('feelsLike');
  const highLowTemp = document.getElementById('highLowTemp');
  const alertBanner = document.getElementById('alertBanner');
  const alertText = document.getElementById('alertText');

  // Metric Cards
  const valHumidity = document.getElementById('valHumidity');
  const valWind = document.getElementById('valWind');
  const valPressure = document.getElementById('valPressure');
  const valUv = document.getElementById('valUv');

  // AQI Elements
  const aqiBadge = document.getElementById('aqiBadge');
  const aqiVal = document.getElementById('aqiVal');
  const aqiMeterFill = document.getElementById('aqiMeterFill');
  const aqiAdvice = document.getElementById('aqiAdvice');
  const valPm25 = document.getElementById('valPm25');
  const valPm10 = document.getElementById('valPm10');
  const valNo2 = document.getElementById('valNo2');
  const valO3 = document.getElementById('valO3');

  // Solar Arc Elements
  const sunriseTime = document.getElementById('sunriseTime');
  const sunsetTime = document.getElementById('sunsetTime');
  const solarSunDot = document.getElementById('solarSunDot');

  // Forecast Containers
  const hourlyScrollContainer = document.getElementById('hourlyScrollContainer');
  const dailyForecastList = document.getElementById('dailyForecastList');
  const citiesCardGrid = document.getElementById('citiesCardGrid');

  // Canvas
  const tempChartCanvas = document.getElementById('tempChart');

  // Initialize App
  init();

  async function init() {
    setupEventListeners();
    renderFilterPills();
    await loadCityWeather(state.currentCity);
    renderCitiesDirectory();
  }

  /**
   * Fetch & Render Weather for a given city object
   */
  async function loadCityWeather(cityObj) {
    state.currentCity = cityObj;
    showLoadingSkeletons();

    try {
      const data = await fetchWeatherData(cityObj.lat, cityObj.lon, cityObj.name);
      state.weatherData = data;
      renderHeroSection(data, cityObj);
      renderMetrics(data);
      renderAQI(data.aqi);
      renderSolarArc(data);
      renderHourlyForecast(data.hourly);
      renderDailyForecast(data.daily);
      
      // Render Chart
      if (tempChartCanvas) {
        renderTempChart(tempChartCanvas, data.hourly, state.isFahrenheit);
      }

      // Dynamic Weather Theme Background
      document.body.className = `${data.themeClass} ${document.body.classList.contains('light-mode') ? 'light-mode' : ''}`;

      // Alert Check
      if (data.currentTemp > 38) {
        showAlert(`Extreme Heatwave Warning! High temperatures recorded in ${cityObj.name}. Stay hydrated!`);
      } else if (data.aqi && data.aqi.value > 180) {
        showAlert(`Severe Air Pollution Alert in ${cityObj.name} (AQI: ${data.aqi.value}). Wear protective masks!`);
      } else {
        hideAlert();
      }

    } catch (e) {
      console.error("Failed to load weather:", e);
    }
  }

  /**
   * Render Main Hero Card
   */
  function renderHeroSection(data, cityObj) {
    heroCity.textContent = cityObj.name;
    heroState.textContent = `${cityObj.state}, India`;
    heroTierBadge.textContent = cityObj.tier;
    heroTierBadge.className = `tier-badge ${cityObj.tier.toLowerCase().replace(' ', '-')}`;

    const tempVal = state.isFahrenheit ? Math.round((data.currentTemp * 9/5) + 32) : data.currentTemp;
    const feelsVal = state.isFahrenheit ? Math.round((data.feelsLike * 9/5) + 32) : data.feelsLike;
    const highVal = state.isFahrenheit ? Math.round((data.highTemp * 9/5) + 32) : data.highTemp;
    const lowVal = state.isFahrenheit ? Math.round((data.lowTemp * 9/5) + 32) : data.lowTemp;
    const unitSymbol = state.isFahrenheit ? '°F' : '°C';

    currentTemp.textContent = tempVal;
    tempUnitSymbol.textContent = unitSymbol;
    weatherIcon.textContent = data.icon;
    weatherCondition.textContent = data.condition;
    feelsLike.textContent = `Feels like ${feelsVal}${unitSymbol}`;
    highLowTemp.textContent = `H: ${highVal}${unitSymbol}  L: ${lowVal}${unitSymbol}`;

    // Update Favorite Icon State
    updateFavButtonState();
  }

  /**
   * Render Weather Metrics Cards
   */
  function renderMetrics(data) {
    valHumidity.textContent = `${data.humidity}%`;
    valWind.textContent = `${data.windSpeed} km/h`;
    valPressure.textContent = `${data.pressure} hPa`;
    valUv.textContent = `${data.uvIndex} / 11`;
  }

  /**
   * Render Air Quality Meter
   */
  function renderAQI(aqi) {
    if (!aqi) return;
    aqiVal.textContent = aqi.value;
    aqiBadge.textContent = aqi.status;
    aqiBadge.style.backgroundColor = aqi.color;
    aqiAdvice.textContent = aqi.advice;

    // Meter Fill Percentage (Max 300 scale)
    const pct = Math.min(100, Math.max(5, (aqi.value / 300) * 100));
    aqiMeterFill.style.width = `${pct}%`;
    aqiMeterFill.style.backgroundColor = aqi.color;

    valPm25.textContent = `${aqi.pm25} µg/m³`;
    valPm10.textContent = `${aqi.pm10} µg/m³`;
    valNo2.textContent = `${aqi.no2} µg/m³`;
    valO3.textContent = `${aqi.o3} µg/m³`;
  }

  /**
   * Render Solar Arc Sun Progress
   */
  function renderSolarArc(data) {
    sunriseTime.textContent = data.sunrise;
    sunsetTime.textContent = data.sunset;

    // Calculate percentage through day
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let srMinutes = 6 * 60; // default 6am
    let ssMinutes = 18 * 60 + 45; // default 6:45pm

    if (data.sunriseRaw && data.sunsetRaw) {
      const sr = new Date(data.sunriseRaw);
      const ss = new Date(data.sunsetRaw);
      srMinutes = sr.getHours() * 60 + sr.getMinutes();
      ssMinutes = ss.getHours() * 60 + ss.getMinutes();
    }

    let progress = 0;
    if (currentMinutes >= srMinutes && currentMinutes <= ssMinutes) {
      progress = (currentMinutes - srMinutes) / (ssMinutes - srMinutes);
    } else if (currentMinutes > ssMinutes) {
      progress = 1;
    }

    // Arc Positioning (Semi-circle radius 100px)
    const angle = progress * Math.PI; // 0 to PI
    const x = 100 - Math.cos(angle) * 100;
    const y = 100 - Math.sin(angle) * 100;

    solarSunDot.style.left = `${x}px`;
    solarSunDot.style.top = `${y}px`;
  }

  /**
   * Render Hourly Forecast Slider
   */
  function renderHourlyForecast(hourlyList) {
    hourlyScrollContainer.innerHTML = '';
    const unitSymbol = state.isFahrenheit ? '°F' : '°C';

    hourlyList.forEach(item => {
      const tempVal = state.isFahrenheit ? Math.round((item.temp * 9/5) + 32) : item.temp;
      const card = document.createElement('div');
      card.className = 'hourly-card';
      card.innerHTML = `
        <span class="hourly-time">${item.time}</span>
        <span class="hourly-icon">${item.icon}</span>
        <span class="hourly-temp">${tempVal}${unitSymbol}</span>
        ${item.pop > 0 ? `<span class="hourly-pop">💧 ${item.pop}%</span>` : ''}
      `;
      hourlyScrollContainer.appendChild(card);
    });
  }

  /**
   * Render 7-Day Forecast
   */
  function renderDailyForecast(dailyList) {
    dailyForecastList.innerHTML = '';
    const unitSymbol = state.isFahrenheit ? '°F' : '°C';

    dailyList.forEach(item => {
      const maxVal = state.isFahrenheit ? Math.round((item.maxTemp * 9/5) + 32) : item.maxTemp;
      const minVal = state.isFahrenheit ? Math.round((item.minTemp * 9/5) + 32) : item.minTemp;

      const row = document.createElement('div');
      row.className = 'daily-row';
      row.innerHTML = `
        <span class="daily-day-name">${item.day}</span>
        <div class="daily-weather-info">
          <span class="daily-icon">${item.icon}</span>
          <span class="daily-desc">${item.description}</span>
        </div>
        <div class="daily-temp-range">
          <span class="temp-max">${maxVal}${unitSymbol}</span>
          <span class="temp-min">${minVal}${unitSymbol}</span>
        </div>
      `;
      dailyForecastList.appendChild(row);
    });
  }

  /**
   * Render Quick Filter Pills for Regional & Tier Filters
   */
  function renderFilterPills() {
    const pillsContainer = document.getElementById('filterPills');
    if (!pillsContainer) return;

    const filters = [
      { id: 'ALL', label: '🇮🇳 All India' },
      { id: 'TIER1', label: '⭐ Tier 1 Metros' },
      { id: 'TIER2', label: '🏙️ Tier 2 Cities' },
      { id: 'North', label: '🏔️ North' },
      { id: 'South', label: '🌴 South' },
      { id: 'West', label: '🌊 West' },
      { id: 'East', label: '🍵 East' },
      { id: 'Central', label: '🏛️ Central' },
      { id: 'North-East', label: '🌿 North-East' }
    ];

    pillsContainer.innerHTML = '';
    filters.forEach(f => {
      const btn = document.createElement('button');
      btn.className = `pill-btn ${state.activeFilter === f.id ? 'active' : ''}`;
      btn.textContent = f.label;
      btn.onclick = () => {
        state.activeFilter = f.id;
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCitiesDirectory();
      };
      pillsContainer.appendChild(btn);
    });
  }

  /**
   * Render Tier 1 & Tier 2 Cities Grid Directory
   */
  async function renderCitiesDirectory() {
    if (!citiesCardGrid) return;
    citiesCardGrid.innerHTML = '';

    let filtered = INDIAN_CITIES;
    if (state.activeFilter === 'TIER1') {
      filtered = INDIAN_CITIES.filter(c => c.tier === 'Tier 1');
    } else if (state.activeFilter === 'TIER2') {
      filtered = INDIAN_CITIES.filter(c => c.tier === 'Tier 2');
    } else if (['North', 'South', 'West', 'East', 'Central', 'North-East'].includes(state.activeFilter)) {
      filtered = INDIAN_CITIES.filter(c => c.region === state.activeFilter);
    }

    filtered.forEach(city => {
      const card = document.createElement('div');
      card.className = 'city-mini-card';

      // Weather preview (estimate/placeholder until hovered or preloaded)
      const approxTemp = Math.round(26 + (Math.sin(city.lat) * 6));
      const displayTemp = state.isFahrenheit ? Math.round((approxTemp * 9/5) + 32) : approxTemp;
      const unitSymbol = state.isFahrenheit ? '°F' : '°C';

      card.innerHTML = `
        <div class="mini-card-top">
          <div>
            <div class="mini-city-name">${city.name}</div>
            <div class="mini-city-state">${city.state}</div>
          </div>
          <span class="tier-badge ${city.tier.toLowerCase().replace(' ', '-')}">${city.tier}</span>
        </div>
        <div class="mini-card-bottom">
          <span class="mini-city-temp">${displayTemp}${unitSymbol}</span>
          <span class="mini-city-icon">🌤️</span>
        </div>
      `;

      card.onclick = () => {
        loadCityWeather(city);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      citiesCardGrid.appendChild(card);
    });
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Autocomplete Input Listener
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 1) {
        autocompleteDropdown.classList.remove('active');
        return;
      }

      const matches = INDIAN_CITIES.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.state.toLowerCase().includes(query) ||
        c.tier.toLowerCase().includes(query)
      ).slice(0, 10);

      renderAutocomplete(matches);
    });

    // Hide Autocomplete on Outside Click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
        autocompleteDropdown.classList.remove('active');
      }
    });

    // Geolocation HTML5 API Binding
    geoBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        geoBtn.textContent = '📍 Locating...';
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const nearestCity = findNearestIndianCity(lat, lon);
            await loadCityWeather(nearestCity);
            geoBtn.innerHTML = '📍 Auto-Detected';
          },
          (err) => {
            alert("Could not detect location. Defaulting to city selection.");
            geoBtn.innerHTML = '📍 My Location';
          }
        );
      }
    });

    // Unit Switcher
    unitCelsiusBtn.onclick = () => switchUnit(false);
    unitFahrenheitBtn.onclick = () => switchUnit(true);

    // Theme Toggle (Dark / Light)
    themeToggleBtn.onclick = () => {
      document.body.classList.toggle('light-mode');
      themeToggleBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    };

    // Favorite Button
    favBtn.onclick = () => {
      toggleFavorite(state.currentCity.name);
    };

    // Comparison Drawer Button
    if (compareBtn) {
      compareBtn.onclick = () => openComparisonModal();
    }
  }

  /**
   * Render Autocomplete List
   */
  function renderAutocomplete(matches) {
    autocompleteDropdown.innerHTML = '';
    if (matches.length === 0) {
      autocompleteDropdown.innerHTML = '<div style="padding:12px 16px; color:var(--text-muted)">No matching Indian city found</div>';
      autocompleteDropdown.classList.add('active');
      return;
    }

    matches.forEach(city => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `
        <div class="city-info-primary">
          <span class="city-name">${city.name}</span>
          <span class="city-state">(${city.state})</span>
        </div>
        <span class="tier-badge ${city.tier.toLowerCase().replace(' ', '-')}">${city.tier}</span>
      `;
      item.onclick = () => {
        searchInput.value = city.name;
        autocompleteDropdown.classList.remove('active');
        loadCityWeather(city);
      };
      autocompleteDropdown.appendChild(item);
    });

    autocompleteDropdown.classList.add('active');
  }

  /**
   * Temperature Unit Switcher
   */
  function switchUnit(toFahrenheit) {
    if (state.isFahrenheit === toFahrenheit) return;
    state.isFahrenheit = toFahrenheit;

    unitCelsiusBtn.classList.toggle('active', !toFahrenheit);
    unitFahrenheitBtn.classList.toggle('active', toFahrenheit);

    if (state.weatherData) {
      renderHeroSection(state.weatherData, state.currentCity);
      renderHourlyForecast(state.weatherData.hourly);
      renderDailyForecast(state.weatherData.daily);
      if (tempChartCanvas) {
        renderTempChart(tempChartCanvas, state.weatherData.hourly, state.isFahrenheit);
      }
    }
    renderCitiesDirectory();
  }

  /**
   * Favorite Toggle Controller
   */
  function toggleFavorite(cityName) {
    const idx = state.favorites.indexOf(cityName);
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.push(cityName);
    }
    localStorage.setItem('weather_favs', JSON.stringify(state.favorites));
    updateFavButtonState();
  }

  function updateFavButtonState() {
    const isFav = state.favorites.includes(state.currentCity.name);
    favBtn.classList.toggle('is-fav', isFav);
    favBtn.textContent = isFav ? '★' : '☆';
  }

  /**
   * Helper to find nearest Indian city from coordinates
   */
  function findNearestIndianCity(lat, lon) {
    let minDistance = Infinity;
    let closest = INDIAN_CITIES[0];

    INDIAN_CITIES.forEach(c => {
      const d = Math.hypot(c.lat - lat, c.lon - lon);
      if (d < minDistance) {
        minDistance = d;
        closest = c;
      }
    });

    return closest;
  }

  /**
   * Alert Helpers
   */
  function showAlert(msg) {
    if (alertBanner && alertText) {
      alertText.textContent = msg;
      alertBanner.style.display = 'flex';
    }
  }

  function hideAlert() {
    if (alertBanner) {
      alertBanner.style.display = 'none';
    }
  }

  /**
   * Multi-City Comparison Modal
   */
  async function openComparisonModal() {
    const modalOverlay = document.getElementById('compareModal');
    const compareGrid = document.getElementById('comparisonGrid');
    if (!modalOverlay || !compareGrid) return;

    modalOverlay.classList.add('active');
    compareGrid.innerHTML = '<div style="color:var(--text-secondary); text-align:center; padding:2rem;">Loading weather comparison data...</div>';

    const selectedCities = [
      state.currentCity,
      INDIAN_CITIES.find(c => c.name === 'Delhi') || INDIAN_CITIES[1],
      INDIAN_CITIES.find(c => c.name === 'Bengaluru') || INDIAN_CITIES[2]
    ];

    const weatherPromises = selectedCities.map(c => fetchWeatherData(c.lat, c.lon, c.name));
    const results = await Promise.all(weatherPromises);

    compareGrid.innerHTML = '';
    const unitSymbol = state.isFahrenheit ? '°F' : '°C';

    results.forEach((res, i) => {
      const cityObj = selectedCities[i];
      const tempVal = state.isFahrenheit ? Math.round((res.currentTemp * 9/5) + 32) : res.currentTemp;

      const col = document.createElement('div');
      col.className = 'compare-city-col';
      col.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-weight:800; font-size:1.25rem;">${res.city}</h3>
          <span class="tier-badge ${cityObj.tier.toLowerCase().replace(' ', '-')}">${cityObj.tier}</span>
        </div>
        <div style="font-size:2.5rem; font-weight:800; color:var(--accent-cyan);">${tempVal}${unitSymbol} ${res.icon}</div>
        <div style="font-size:0.9rem; color:var(--text-secondary);">${res.condition}</div>
        <hr style="border-color:var(--card-border); margin:0.5rem 0;">
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:6px;">
          <div>💧 Humidity: <b>${res.humidity}%</b></div>
          <div>💨 Wind: <b>${res.windSpeed} km/h</b></div>
          <div>🍃 AQI: <b style="color:${res.aqi.color}">${res.aqi.value} (${res.aqi.status})</b></div>
          <div>☀️ UV Index: <b>${res.uvIndex}</b></div>
        </div>
      `;
      compareGrid.appendChild(col);
    });
  }

  // Bind Close Modal Event
  const modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.onclick = () => {
      document.getElementById('compareModal').classList.remove('active');
    };
  }

  function showLoadingSkeletons() {
    currentTemp.textContent = '--';
    weatherCondition.textContent = 'Updating...';
  }
});
