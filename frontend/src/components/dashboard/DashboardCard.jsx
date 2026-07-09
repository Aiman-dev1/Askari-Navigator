function DashboardCard({ title, description }) {
  return (
    <div className="bg-white border border-gray-200/60 shadow-md hover:border-gold-400/50 rounded p-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group">
      
      {/* Decorative Top Accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-gold-400 transition-colors duration-300"></div>

      <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 tracking-wide group-hover:text-gold-600 transition-colors">
        {title}
      </h2>

      <p className="text-gray-500 text-sm leading-relaxed font-light">
        {description}
      </p>

    </div>
  );
}

export default DashboardCard;