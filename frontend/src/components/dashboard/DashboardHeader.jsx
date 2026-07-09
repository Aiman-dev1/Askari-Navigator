function DashboardHeader({ title }) {
  return (
    <div className="mb-10 border-b border-gray-200/80 pb-6 relative">

      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
        {title}
      </h1>

      <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
        Askari Corporate Tower Navigator Portal
      </p>

      {/* Decorative short gold line under title border */}
      <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>

    </div>
  );
}

export default DashboardHeader;