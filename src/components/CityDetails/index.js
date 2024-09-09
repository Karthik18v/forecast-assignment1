import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./index.css"

const CityDetails = () => {
  const { cityName } = useParams();

  console.log(cityName);

  const [weather, setWeather] = useState([]);
  const [lanLat, setLanLats] = useState(false);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchCityDetails();
  });

  const fetchCityDetails = async () => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=8b626265e5e0b699761f5941a698b27c`
    );
    console.log(response);

    const dateTime = response.data.list[0].dt_txt;
    console.log(response.data.city.coord.lon);
    setWeather({
      time: dateTime.slice(0, 10),
      temp: response.data.list[0].main.temp,
      description: response.data.list[0].weather[0].description,
      humidity: response.data.list[0].main.humidity,
      wind_speed: response.data.list[0].wind.speed,
      pressure: response.data.list[0].main.pressure,
      lat: response.data.city.coord.lat,
      lon: response.data.city.coord.lon,
    });
    setLanLats(true);
    const foreCastData = response.data.list.map((each) => ({
      date: each.dt_txt.slice(0, 10),
      time: each.dt_txt.slice(12, 16),
      temp: each.main.temp,
      description: each.weather[0].description,
      humidity: each.main.humidity,
      wind_speed: each.wind.speed,
    }));
    console.log(foreCastData);
    setForecast(foreCastData);
  };

  return (
    <div className="main-container">
      <div className="weather-details-container">
        <div>
          <h1>Weather in {cityName}</h1>
          <p>Temperature: {weather.temp}°K</p>
          <p>Description: {weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.wind_speed} m/s</p>
          <p>Pressure: {weather.pressure} hPa</p>
        </div>
        <div>
          {lanLat && (
            <MapContainer
              center={[weather.lat, weather.lon]}
              zoom={10}
              style={{ height: "200px", width: "50%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[weather.lat, weather.lon]}>
                <Popup>
                  {cityName} - {weather.description} <br /> Temp: {weather.temp}
                  °K
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
      <div>
        <h2>5-Day Forecast</h2>
        <div className="table-body">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Temperature</th>
                <th>Description</th>
                <th>Humidity</th>
                <th>Wind Speed</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((day, index) => (
                <tr key={index}>
                  <td>{day.date}</td>
                  <td>{day.time}</td>
                  <td>{day.temp}°K</td>
                  <td>{day.description}</td>
                  <td>{day.humidity}%</td>
                  <td>{day.wind_speed} m/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
