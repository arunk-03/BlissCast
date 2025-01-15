const WeatherCard = ({ icon: Icon, label, value, unit }) => (
  <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl shadow-lg group">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Icon className="w-8 h-8 text-white/80 hover:text-white transition-colors duration-300" />
    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">{label}</span>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-semibold text-white">{value}</span>
      <span className="text-white/80 text-sm mb-1">{unit}</span>
    </div>
  </div>
);

export default WeatherCard;