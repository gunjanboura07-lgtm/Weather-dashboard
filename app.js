// =========================
// FETCH WEATHER FUNCTION
// =========================

async function getWeather(city) {

  try {

    // Fetch weather data
    const response = await fetch(
      `https://wttr.in/${city}?format=j1`
    );

    // Check if request failed
    if (!response.ok) {
      throw new Error("Weather data not found");
    }

    // Convert response to JSON
    const data = await response.json();

    // Return cleaned weather object
    return {
      city: city,
      temperature: data.current_condition[0].temp_C,
      description: data.current_condition[0]
        .weatherDesc[0].value.toLowerCase(),
      humidity: data.current_condition[0].humidity,
      windSpeed: data.current_condition[0].windspeedKmph
    };

  } catch (error) {

    console.log("Error:", error);

    throw error;
  }
}


// =========================
// DISPLAY WEATHER FUNCTION
// =========================

function displayWeather(data) {

  let emoji = "☀️";

  // Change emoji based on weather
  if (data.description.includes("cloud")) {
    emoji = "☁️";
  }

  if (data.description.includes("rain")) {
    emoji = "🌧️";
  }

  if (data.description.includes("storm")) {
    emoji = "⛈️";
  }

  // Display data on screen
  document.getElementById("city").textContent =
    `${emoji} ${data.city}`;

  document.getElementById("temp").textContent =
    data.temperature;

  document.getElementById("desc").textContent =
    data.description;

  document.getElementById("humidity").textContent =
    data.humidity + "%";

  document.getElementById("wind").textContent =
    data.windSpeed + " km/h";
}


// =========================
// LOCAL STORAGE FUNCTIONS
// =========================

// Save last searched city
function saveCity(city) {

  localStorage.setItem("lastCity", city);
}

// Load saved city
function loadCity() {

  return localStorage.getItem("lastCity");
}


// =========================
// SEARCH BUTTON EVENT
// =========================

document.getElementById("searchBtn")
.addEventListener("click", async () => {

  // Get city input
  const city =
    document.getElementById("cityInput")
    .value.trim();

  // Validate input
  if (!city) {

    alert("Please enter a city name");

    return;
  }

  // Show loading text
  document.getElementById("status")
    .textContent = "Loading...";

  try {

    // Fetch weather
    const data = await getWeather(city);

    // Display weather
    displayWeather(data);

    // Save city
    saveCity(city);

    // Clear status
    document.getElementById("status")
      .textContent = "";

  } catch (error) {

    // Show error message
    document.getElementById("status")
      .textContent = "Error fetching weather ❌";
  }
});


// =========================
// ENTER KEY SEARCH
// =========================

document.getElementById("cityInput")
.addEventListener("keypress", function(event) {

  if (event.key === "Enter") {

    document.getElementById("searchBtn")
      .click();
  }
});


// =========================
// AUTO LOAD SAVED CITY
// =========================

window.addEventListener("load", async () => {

  // Get saved city
  const savedCity = loadCity();

  // If city exists
  if (savedCity) {

    try {

      // Fetch weather automatically
      const data = await getWeather(savedCity);

      // Display weather
      displayWeather(data);

    } catch (error) {

      console.log("Auto-load failed");
    }
  }
});