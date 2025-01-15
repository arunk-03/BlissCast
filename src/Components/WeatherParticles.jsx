import React, { useState, useEffect } from 'react';

const WeatherParticles = ({ weather, darkMode, showParticles }) => {
  const [particles, setParticles] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(showParticles);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const mobileParticleCounts = {
    sunny: 6,
    rainy: 100,
    snowy: 80,
    cloudy: 8,
    default: 50
  };

  const desktopParticleCounts = {
    sunny: 12,
    rainy: 300,
    snowy: 200,
    cloudy: 15,
    default: 100
  };

  useEffect(() => {
    if (showParticles) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showParticles]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (weather === 'sunny') {
      const targetOpacity = darkMode ? 0 : 1;
      setOpacity(targetOpacity);
    }
  }, [darkMode, weather]);

  useEffect(() => {
    const generateParticles = () => {
      const particleCount = isMobile ? mobileParticleCounts : desktopParticleCounts;
      const count = particleCount[weather] || particleCount.default;
      
      return Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        animationDelay: `-${Math.random() * 12}s`,
        animationDuration: (() => {
          switch(weather) {
            case 'sunny': return `${6 + Math.random() * 6}s`;
            case 'rainy': return `${1.8 + Math.random() * 0.6}s`;
            case 'snowy': return `${8 + Math.random() * 4}s`;
            case 'cloudy': return `${25 + Math.random() * 15}s`;
            default: return '2s';
          }
        })(),
        ...(weather === 'sunny' && {
          opacity: (0.15 + Math.random() * 0.3) * opacity,
        }),
        ...(weather === 'snowy' && {
          width: 10,
          height: 10,
          opacity: 0.9,
          driftX: -30 + Math.random() * 60,
        }),
        ...(weather === 'rainy' && {
          opacity: 0.8 + Math.random() * 0.2,
        }),
        ...(weather === 'cloudy' && {
          scale: 0.7 + Math.random() * 0.6,
          opacity: 0.8,
        }),
      }));
    };

    setParticles(generateParticles());
  }, [weather, opacity, isMobile]);

  if (!weather || (!isVisible && !showParticles)) return null;

  const shouldShowParticle = (particleWeather) => {
    if (particleWeather === 'sunny') {
      return !darkMode && showParticles;
    }
    return showParticles;
  };

  return (
    <div 
      className={`particles-container ${!showParticles ? 'hiding' : ''}`}
      style={{
        transition: 'all 0.5s ease-in-out',
      }}
    >
      {particles.map((particle) => (
        shouldShowParticle(weather) && (
          <div
            key={particle.id}
            className={`particle ${weather}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              transition: 'all 0.5s ease-in-out',
              ...(weather === 'snowy' && {
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                opacity: particle.opacity,
                '--drift-x': `${particle.driftX}px`,
              }),
              ...(weather === 'rainy' && {
                opacity: particle.opacity,
              }),
              ...(weather === 'sunny' && {
                opacity: particle.opacity,
              }),
              ...(weather === 'cloudy' && {
                transform: `scale(${particle.scale})`,
                opacity: particle.opacity,
              }),
            }}
          />
        )
      ))}
    </div>
  );
};

export default WeatherParticles; 