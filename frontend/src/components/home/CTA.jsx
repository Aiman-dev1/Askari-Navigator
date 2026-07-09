import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
      
      {/* Background elegant lighting accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center px-6 relative z-10">

        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide text-white">
          READY TO EXPERIENCE TOWER NAVIGATOR?
        </h2>

        <div className="w-20 h-[2px] bg-gold-400 mx-auto mb-6"></div>

        <p className="text-gray-300 font-light text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Log in now to access interactive floor plans, search our verified business directory, or reach our virtual assistant.
        </p>

        <Link
          to="/login"
          className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-8 py-3.5 rounded font-semibold tracking-wider transition-all duration-300 shadow-lg hover:shadow-gold-400/20 inline-block uppercase text-sm"
        >
          Access Portal
        </Link>

      </div>

    </section>
  );
}

export default CTA;