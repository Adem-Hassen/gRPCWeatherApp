import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/weather/${location}`);
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("Location not found or server error");
      setWeather(null);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌤️ Weather App 🌤️</h1>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Enter location (e.g., New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input"
        />
        <button onClick={fetchWeather} className="button">
          Get Weather
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weatherContainer">
          <h2 className="weatherTitle">
            🌍 Weather in {location} 🌍
          </h2>
          <div className="weatherInfo">
            <p className="weatherText">
              🌡️ Temperature: {weather.temperature}°C
            </p>
            <p className="weatherText">
              💧 Humidity: {weather.humidity}%
            </p>
            <p className="weatherText">
              ☁️ Condition: {weather.condition}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;