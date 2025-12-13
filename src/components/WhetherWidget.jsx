import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const city="Yeghegnadzor";
  const [error, setError] = useState("");

  // Fetch coordinates from Open-Meteo’s geocoding API
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityName
        )}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0)
        throw new Error("City not found");

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`
      );
      const weatherData = await weatherRes.json();

      setData({
        name,
        country,
        temp: weatherData.current.temperature_2m,
        wind: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
        code: weatherData.current.weather_code,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) fetchWeather(city);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Weather description by code
  const weatherDescriptions = {
    0: "☀️Clear sky",
    1: "🌤️Mainly clear",
    2: "⛅Partly cloudy",
    3: "☁️Overcast",
    45: "🌫️Fog",
    48: "🌫️Rime fog",
    51: "🌦️Light drizzle",
    61: "🌧️Light rain",
    71: "🌨️Light snow",
    80: "🌧️Rain showers",
    95: "⛈️Thunderstorm",
  };

  const desc =
    data && weatherDescriptions[data.code]
      ? weatherDescriptions[data.code]
      : "—";

  return (
    <div className="flex-auto w-25 md:w-30 lg:w-40 h-25 md:h-41 lg:h-60 bg-gradient-to-b from-sky-50 to-sky-200 rounded-2xl p-1 shadow-lg text-gray-800">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : data ? (
        <div className="text-center">
          <div className="text-xs md:text-base lg:text-xl font-semibold">
            {data.name}, {data.country}
          </div>
          <div className="text-base md:text-2xl lg:text-3xl font-bold my-2">{Math.round(data.temp)}°C</div>
          <div className="text-[8px] md:text-base lg:text-xl capitalize text-gray-600">{desc}</div>
        </div>
      ) : null}
    </div>
  );
};
