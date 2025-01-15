import React, { useEffect, useState } from 'react';

const WeatherParticles = ({ weather }) => {
  const [particles, setParticles] = useState([]);
  const particleCount = 100;

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: particleCount }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        animationDelay: -Math.random() * 5,
        animationDuration: 2 + Math.random() * 4,
        rotation: weather === 'rainy' ? 15 + Math.random() * 10 : 0, // Random rotation for raindrops
        initialY: -10 - Math.random() * 100, // Start particles at different heights above viewport
      }));
    };

    setParticles(generateParticles());
  }, [weather]);

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${weather}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.initialY}px`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            transform: weather === 'rainy' ? `rotate(${particle.rotation}deg)` : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default WeatherParticles; 