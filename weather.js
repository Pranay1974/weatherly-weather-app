const form = document.querySelector('form');
const input = document.querySelector('input');
const card = document.querySelector('#weather-card');
const errorMsg = document.querySelector('.error-msg');
const bgVideo = document.getElementById('bg-video');

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const iconElement = document.querySelector('.weather-icon');
const conditionElement = document.querySelector('.condition');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind_kph');

const fetchWeather = async (e) => {
    e.preventDefault();

    const city = input.value.trim();
    if (!city) return;

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=6e91172024624538917115430241101&q=${city}&aqi=yes`);
        const data = await response.json();

        if (data.error) {
            errorMsg.style.display = 'block';
            card.classList.remove('active');
            return;
        }

        errorMsg.style.display = 'none';

        // Update text UI Elements
        cityElement.innerText = data.location.name;
        tempElement.innerText = Math.round(data.current.temp_c) + '°C';

        const weatherConditionText = data.current.condition.text;
        conditionElement.innerText = weatherConditionText;
        iconElement.setAttribute('src', data.current.condition.icon);
        humidityElement.innerText = data.current.humidity + "%";
        windElement.innerText = data.current.wind_kph + " km/h";

        // --- Background Video Logic ---
        // Convert text to lowercase to easily search for keywords
        const conditionLower = weatherConditionText.toLowerCase();
        let videoSrc = 'sunny.mp4'; // Fallback default

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            videoSrc = 'rainy.mp4';
        } else if (conditionLower.includes('snow') || conditionLower.includes('ice') || conditionLower.includes('blizzard') || conditionLower.includes('pellets')) {
            videoSrc = 'snow.mp4';
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            videoSrc = 'stormy.mp4';
        } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
            videoSrc = 'foggy.mp4';
        } else if (conditionLower.includes('wind')) {
            videoSrc = 'windy.mp4';
        } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            videoSrc = 'cloudy.mp4';
        } else {
            videoSrc = 'sunny.mp4'; // Matches "clear", "sunny", etc.
        }

        // Change the video source ONLY if it's different from the current one
        if (!bgVideo.src.endsWith(videoSrc)) {
            bgVideo.src = videoSrc;
        }
        // -------------------------------

        // Show the weather card
        card.classList.add('active');

    } catch (error) {
        console.error(`Error: ${error.message}`);
        errorMsg.style.display = 'block';
        card.classList.remove('active');
    }

    form.reset();
};

form.addEventListener('submit', fetchWeather);