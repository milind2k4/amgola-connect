// Weather Widget
export function initWeather() {
    // Elements
    const elements = {
        temp: document.getElementById('current-temp'),
        icon: document.getElementById('weather-icon'),
        desc: document.getElementById('weather-desc'),
        wind: document.getElementById('wind-speed'),
        humidity: document.getElementById('humidity'),
        sunrise: document.getElementById('sunrise'),
        sunset: document.getElementById('sunset'),
        location: document.getElementById('location')
    };

    // Replace with your location and API key
    const config = {
        lat: '26.113574',
        lon: '85.388862',
        apiKey: '7fe63de519354c98bb610ebada9fcc0f',
        units: 'metric'
    };

    // Format time from timestamp
    const formatTime = (timestamp, timezone) => {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    };

    // Update UI with weather data
    const updateUI = (data) => {
        const { main, weather, wind, sys, name, timezone } = data;

        elements.temp.textContent = `${Math.round(main.temp)}°C`;
        elements.icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        elements.icon.alt = weather[0].description;
        elements.desc.textContent = weather[0].description;
        elements.wind.textContent = `${Math.round(wind.speed * 3.6)} km/h`;
        elements.humidity.textContent = `${main.humidity}%`;
        elements.sunrise.textContent = formatTime(sys.sunrise, timezone);
        elements.sunset.textContent = formatTime(sys.sunset, timezone);
        elements.location.textContent = name;
    };

    // Fetch weather data
    const fetchWeather = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${config.lat}&lon=${config.lon}&appid=${config.apiKey}&units=${config.units}`
            );

            if (!response.ok) throw new Error('Weather data not available');

            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    // Initialize weather widget if elements exist
    if (elements.temp && config.apiKey !== 'YOUR_OPENWEATHER_API_KEY') {
        fetchWeather();
        // Update weather every 30 minutes
        setInterval(fetchWeather, 30 * 60 * 1000);
    }
};