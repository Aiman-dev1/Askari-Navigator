import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

function Hero() {
  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.85), rgba(6, 9, 17, 0.95)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative text-center px-6 max-w-4xl z-10">

        <p className="text-gold-400 font-semibold uppercase tracking-widest text-sm mb-4">
          LEED "Gold" Certified Premium Corporate Office Tower
        </p>

        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-white tracking-wide">
          WHERE CUTTING-EDGE DESIGN MEETS PEACE OF MIND
        </h1>

        <p className="mt-8 text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Experience smart indoor navigation, real-time tenant chat rooms, and executive virtual assistance inside Lahore's most prestigious commercial address.
        </p>

        <div className="mt-12 flex justify-center gap-6">

          <Link
            to="/login"
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-8 py-3.5 rounded font-semibold tracking-wider transition-all duration-300 shadow-lg hover:shadow-gold-400/20"
          >
            Get Started
          </Link>

          <button
            onClick={scrollToFeatures}
            className="border border-white/50 text-white hover:bg-white hover:text-slate-950 px-8 py-3.5 rounded font-semibold tracking-wider transition-all duration-300"
          >
            Learn More
          </button>

        </div>

      </div>

      {/* Decorative fine-line border divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"></div>
    </section>
  );
}

export default Hero;