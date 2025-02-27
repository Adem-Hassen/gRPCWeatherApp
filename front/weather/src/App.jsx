import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Initial map center
  const intervalRef = useRef(null);

  // Function to fetch weather data
  const fetchWeather = async () => {
    if (!location) return;

    try {
      const response = await axios.get(`http://localhost:8000/weather/${location}`);
      const newWeather = {
        ...response.data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setWeatherHistory((prevHistory) => [newWeather, ...prevHistory]);
      setError("");
    } catch (err) {
      setError("Location not found or server error");
    }
  };

  // Function to clear weather history
  const clearWeatherHistory = () => {
    stopWeatherUpdates();
    setWeatherHistory([]);
  };

  // Function to start weather updates
  const startWeatherUpdates = () => {
    if (intervalRef.current) return;

    fetchWeather();
    intervalRef.current = setInterval(fetchWeather, 3000);
  };

  // Function to stop weather updates
  const stopWeatherUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function to animate the map
  useEffect(() => {
    const mapAnimationInterval = setInterval(() => {
      setMapCenter((prevCenter) => [
        prevCenter[0] + 0.01, // Adjust latitude for movement
        prevCenter[1] + 0.01, // Adjust longitude for movement
      ]);
    }, 100); // Adjust the interval for smoother or faster movement

    return () => clearInterval(mapAnimationInterval);
  }, []);

  return (
    <div className="container">
      {/* Map Background */}
      <MapContainer
        center={mapCenter}
        zoom={3}
        style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>

      {/* Weather App Content */}
      <div style={{ position: "relative", zIndex: 1, backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "20px", borderRadius: "10px", margin: "20px" }}>
        <h1 className="title">🌤️ Weather App 🌤️</h1>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Enter location (e.g., New York)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
          />
          <br />
          <br />
          <button onClick={startWeatherUpdates} className="button">
            Get Weather
          </button>
          <button onClick={stopWeatherUpdates} className="button stopButton">
            Stop Updates
          </button>
          <button onClick={clearWeatherHistory} className="button clearButton">
            Clear
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {weatherHistory.length > 0 && (
          <div className="weatherHistoryContainer">
            <h2 className="weatherTitle">🌍 Weather History for {location} 🌍</h2>
            <div className="horizontalScroll">
              {weatherHistory.map((weather, index) => (
                <div key={index} className="weatherCard">
                  <p className="weatherText">🕒 {weather.timestamp}</p>
                  <p className="weatherText">🌡️ Temperature: {weather.temperature.toFixed(2)}°C</p>
                  <p className="weatherText">💧 Humidity: {weather.humidity}%</p>
                  <p className="weatherText">☁️ Condition: {weather.condition}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;