import React, { useState, useEffect } from 'react';
import { Search, Cloud, Droplets, Wind, MapPin, Loader2, Sun, CloudRain, CloudSnow } from 'lucide-react';

const WeatherCard = ({ icon: Icon, label, value, unit }) => (
  <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl shadow-lg group">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-300" />
    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">{label}</span>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-semibold text-white">{value}</span>
      <span className="text-white/80 text-sm mb-1">{unit}</span>
    </div>
  </div>
);


const App = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setGeoData([]);
      return;
    }

    const searchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}`
          
        );
        const data = await response.json();
        setGeoData(data.results || []);
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setGeoData([]);
      } finally {
        setLoading(false);
      }
      
    };

    const debounceTimer = setTimeout(searchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setSearchTerm(`${city.name}, ${city.country}`);
    setGeoData([]);
  
    try {
      setLoading(true);
  
    
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`
      );
      const data = await response.json();
  
   
      console.log("API Response:", data);
  
    
      const temp = data.current_weather?.temperature || "N/A";
      const windspeed = data.current_weather?.windspeed || "N/A";
      const cloudcover = data.current_weather?.cloudcover || "N/A";
      const humidity = data.current_weather?.humidity || "N/A";
  
      
      setWeatherData({
        temperature: temp,
        windspeed: windspeed,
        cloudcover: cloudcover,
        humidity: humidity,
      });
  
    
      if (temp > 30) {
        setWeather("sunny");
      } else if (temp > 20) {
        setWeather("cloudy");
      } else if (temp > 10) {
        setWeather("rainy");
      } else {
        setWeather("snowy");
      }
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-screen overflow-hidden relative flex justify-center items-center gradient-background">
      

      <div className="flex flex-col bg-[a06262]/30 backdrop-blur-2xl p-8 h-[80vh] w-[90vw] md:w-[30vw] text-white z-10 relative rounded-3xl shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full h-12 rounded-2xl pl-12 pr-4 bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none shadow-lg transition-all  duration-300 ${isFocused ? 'bg-white/20 border-white/30 shadow-lg' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 animate-spin" />
            )}
          </div>

          {geoData.length > 0 && (
            <ul className="absolute w-full bg-black/50 mt-2 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 shadow-xl z-50">
              {geoData.map((city, index) => (
                <li
                  key={`${city.name}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  className="flex items-center gap-6 p-3 hover:bg-white/10 cursor-pointer transition-all duration-300 border-b border-white/10 last:border-none"
                >
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span className="text-white">{city.name}, {city.admin1}, {city.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedCity ? (
          <div className="flex-1 flex flex-col mt-3">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-1">{selectedCity.name}</h2>
              <p className="text-white/70">{selectedCity.country}</p>
              <div className="mt-4">
                {weather === 'sunny' && <Sun className="w-16 h-16 text-yellow-400 mx-auto animate-bounceSlow" />}
                {weather === 'rainy' && <CloudRain className="w-16 h-16 text-blue-300 mx-auto animate-bounceSlow" />}
                {weather === 'snowy' && <CloudSnow className="w-16 h-16 text-blue-200 mx-auto animate-bounceSlow" />}
                {weather === 'cloudy' && <Cloud className="w-16 h-16 text-gray-300 mx-auto animate-bounceSlow" />}
              </div>
            </div>

            {weatherData && (
              <div className="grid grid-cols-2 gap-4 ">
                 <WeatherCard
      icon={Droplets}
      label="Temperature"
      value={weatherData.temperature}
      unit="°C"
    />
    <WeatherCard
      icon={Droplets}
      label="Humidity"
      value={weatherData.humidity}
      unit="%"
    />
    <WeatherCard
      icon={Wind}
      label="Wind Speed"
      value={weatherData.windspeed}
      unit="km/h"
    />
    <WeatherCard
      icon={Cloud}
      label="Cloud Cover"
      value={weatherData.cloudcover}
      unit="%"
    />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/50">
            <Cloud className="w-16 h-16 mb-4 animate-bounceSlow" />
            <p className="text-lg">Search for a city to see weather details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
