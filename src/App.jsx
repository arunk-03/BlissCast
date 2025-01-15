import React, { useState, useEffect } from 'react';
import { Search, Cloud, Droplets, Wind, MapPin, Loader2, Sun, CloudRain, CloudSnow, Moon, Thermometer, Eye, EyeOff } from 'lucide-react';
import WeatherCard from './Components/WeatherCard';
import WeatherParticles from './Components/WeatherParticles';


const ToggleButton = ({darkMode, setDarkMode}) => { 
  return (
  <button
    onClick={() => setDarkMode(!darkMode)}
      className="fixed top-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 group overflow-hidden">
    <div className="relative w-4 h-4 md:w-7 md:h-7">
      <Sun 
        className={`absolute text-yellow-300 transition-all duration-500 ease-in-out transform ${
          !darkMode 
            ? 'translate-y-0 rotate-0 opacity-100' 
            : '-translate-x-8 translate-y-8 rotate-180 opacity-0'
        } w-4 h-4 md:w-7 md:h-7`}
      />
      <Moon 
        className={`absolute text-white transition-all duration-500 ease-in-out transform ${
          darkMode 
            ? 'translate-y-0 rotate-0 opacity-100' 
            : 'translate-x-8 -translate-y-8 -rotate-180 opacity-0'
        } w-4 h-4 md:w-7 md:h-7`}
      />
    </div>
  </button> 
);

};

const ParticleToggleButton = ({showParticles, setShowParticles}) => {
  return (
    <button
      onClick={() => setShowParticles(!showParticles)}
      className="fixed top-6 left-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 group overflow-hidden">
      <div className="relative w-4 h-4 md:w-7 md:h-7">
        <Eye 
          className={`absolute text-white transition-all duration-500 ease-in-out transform ${
            showParticles 
              ? 'translate-y-0 rotate-0 opacity-100' 
              : 'translate-y-8 -translate-x-8 -rotate-180 opacity-0'
          } w-4 h-4 md:w-7 md:h-7`}
        />
        <EyeOff 
          className={`absolute text-white/70 transition-all duration-500 ease-in-out transform ${
            !showParticles 
              ? 'translate-y-0 rotate-0 opacity-100' 
              : '-translate-y-8 translate-x-8 rotate-180 opacity-0'
          } w-4 h-4 md:w-7 md:h-7`}
        />
      </div>
    </button> 
  );
};

const App = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showParticles, setShowParticles] = useState(true);

  

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

      const getWeatherType = (code) => {
        
        if ([0, 1].includes(code)) {
          return "sunny";
        }
        
        else if ([2, 3, 45, 48].includes(code)) {
          return "cloudy";
        }
    
        else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) {
          return "rainy";
        }
      
        else if ([71, 73, 75, 77, 85, 86].includes(code)) {
          return "snowy";
        }
    
        return "cloudy";
      };

      const weatherCode = data.current_weather?.weathercode;
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

      setWeather(getWeatherType(weatherCode));

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen w-screen overflow-hidden relative flex justify-center items-center ${darkMode ? 'dark' : ''}`}>
  
    <div className="gradient-container gradient-background" />
    <div className="gradient-container gradient-background-dark" />
    
    <WeatherParticles 
      weather={weather}
      darkMode={darkMode}
      showParticles={showParticles}
    />
    
    <ToggleButton darkMode={darkMode} setDarkMode={setDarkMode} />
    <ParticleToggleButton showParticles={showParticles} setShowParticles={setShowParticles} />

      <div className="flex flex-col bg-white/10 backdrop-blur-2xl p-8 h-[70vh] w-[80vw] md:w-[30vw] md:h-[80vh] text-white z-10 relative rounded-3xl shadow-xl border border-white/30 hover:border-white/60 transition-all duration-300 hover:shadow-2xl weather-container">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full h-12 rounded-2xl pl-12 pr-4 bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/40 text-white placeholder-white/50 outline-none shadow-lg transition-all duration-300 search-input ${isFocused ? 'bg-white/20 border-white/30' : ''}`}
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
              <h2 className="text-2xl font-semibold mb-1">{selectedCity.name}</h2>
              <p className="text-white/70 capitalize">{weather}</p>
              <div className="mt-4">
                {weather === 'sunny' && <Sun className="w-16 h-16 text-yellow-400 mx-auto animate-bounceSlow" />}
                {weather === 'rainy' && <CloudRain className="w-16 h-16 text-blue-300 mx-auto animate-bounceSlow" />}
                {weather === 'snowy' && <CloudSnow className="w-16 h-16 text-blue-200 mx-auto animate-bounceSlow" />}
                {weather === 'cloudy' && <Cloud className="w-16 h-16 text-gray-300 mx-auto animate-bounceSlow" />}
              </div>
            </div>

            {weatherData && (
              <div className="grid grid-cols-2 gap-4 pt-5">
                 <WeatherCard
      icon={Thermometer}
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
            <Cloud className="w-16 h-16 mb-4 animate-bounceSlow hover:text-white/70 transition-colors duration-300" />
            <p className="text-lg hover:text-white/70 transition-colors duration-300">Search for a city</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
