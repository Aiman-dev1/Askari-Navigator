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
      className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 17, 0.80) 0%, rgba(6, 9, 17, 0.92) 60%, rgba(6, 9, 17, 1) 100%), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Decorative ambient glow orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(204,163,83,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(204,163,83,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse-glow 6s ease-in-out infinite 2s",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(204,163,83,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(204,163,83,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative text-center px-6 max-w-5xl z-10 pt-24 pb-12">

        {/* Badge */}
        <div className="animate-fade-in-down animate-delay-100 inline-flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-2 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
            LEED Gold Certified · Premium Corporate Tower · Lahore
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up animate-delay-200 text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] text-white tracking-wide mb-6">
          WHERE CUTTING-EDGE<br />
          <span
            className="relative inline-block"
            style={{
              backgroundImage: "linear-gradient(135deg, #e7dbab 0%, #cca353 40%, #a1762e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DESIGN MEETS
          </span>{" "}
          <span className="text-white">PEACE</span>
        </h1>

        {/* Decorative divider */}
        <div className="animate-fade-in animate-delay-300 flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold-400/60" />
        </div>

        {/* Subtitle */}
        <p className="animate-fade-in-up animate-delay-300 text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-14">
          Experience smart indoor navigation, real-time tenant chat rooms, and executive virtual assistance inside Lahore's most prestigious commercial address.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up animate-delay-400 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            to="/login"
            className="group relative min-w-[180px] bg-gold-400 hover:bg-gold-500 text-slate-950 px-10 py-4 rounded font-bold tracking-[0.12em] uppercase text-sm transition-all duration-300 shadow-[0_8px_32px_rgba(204,163,83,0.35)] hover:shadow-[0_12px_40px_rgba(204,163,83,0.50)] overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            {/* shimmer sweep */}
            <span
              className="absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] bg-white/20 transition-transform duration-700 pointer-events-none"
            />
          </Link>

          <button
            onClick={scrollToFeatures}
            className="min-w-[180px] border border-white/40 text-white hover:border-gold-400 hover:text-gold-400 px-10 py-4 rounded font-semibold tracking-[0.12em] uppercase text-sm transition-all duration-300 backdrop-blur-sm hover:bg-gold-400/5"
          >
            Learn More
          </button>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-in animate-delay-600 mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 border-t border-white/10 pt-10">
          {[
            { value: "36+", label: "Floors" },
            { value: "200+", label: "Office Suites" },
            { value: "24/7", label: "Smart Navigation" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-serif font-bold text-gold-400">{s.value}</p>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#060911] to-transparent pointer-events-none" />

      {/* Fine-line border divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </section>
  );
}

export default Hero;