module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'l10-1': 'l10-1 1.5s infinite linear',
        'l10-2': 'l10-2 1.5s infinite linear',
        bounceSlow: 'bounce 3s infinite', // Slower bounce
        bounceFast: 'bounce 0.8s infinite', // Faster bounce
        float: 'float 3s ease-in-out infinite',
        gradient: 'gradient 15s ease infinite',
        rain: 'rain 0.8s linear infinite',
        snow: 'snow 3s linear infinite',
        fadeIn: 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        'l10-1': {
          '50%': { transform: 'translateX(26px)' },
        },
        'l10-2': {
          '100%': { transform: 'rotate(-360deg) translateX(26px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        rain: {
          '0%': { transform: 'translateY(-120vh)' },
          '100%': { transform: 'translateY(0)' },
        },
        snow: {
          '0%': { transform: 'translateY(-120vh) rotate(0deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-15%)' },
        },
      },
      width: {
        loader: '15px',
      },
      aspectRatio: {
        loader: '1',
      },
      
    },
  },
  plugins: [],
};
