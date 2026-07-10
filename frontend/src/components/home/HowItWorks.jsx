function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Search Directory",
      desc: "Locate any registered company, floor, office suite, or business lounge instantaneously."
    },
    {
      num: "02",
      title: "Get Directions",
      desc: "Follow refined, step-by-step room and floor paths straight to your destination."
    },
    {
      num: "03",
      title: "Connect via Chat",
      desc: "Interact with verified tenant employees and building management in active chat spaces."
    },
    {
      num: "04",
      title: "Inquire AI concierge",
      desc: "Receive instant guidance regarding building protocols, directory entries, or service policies."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-gray-150">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-slate-900 tracking-wide">
          HOW IT WORKS
        </h2>

        <div className="w-20 h-[2px] bg-gold-400 mx-auto mt-4 mb-6"></div>

        <p className="text-center text-gray-500 max-w-xl mx-auto mb-16 font-light">
          Navigate and interact inside our corporate environment with four seamless digital steps.
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="bg-[#fcfbfa] border border-gray-100 p-8 rounded shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
              <div className="absolute top-4 right-6 text-4xl font-serif font-bold text-gold-400/20 group-hover:text-gold-400/30 transition-colors duration-300">
                {s.num}
              </div>

              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold-50 border border-gold-400/20 text-gold-600 font-serif font-bold text-lg mb-6">
                {i + 1}
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3 tracking-wide uppercase">
                {s.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;