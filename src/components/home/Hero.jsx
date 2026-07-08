import { Link } from "react-router-dom";

function Hero() {
  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-slate-900 text-white min-h-[90vh] flex items-center justify-center">
      <div className="text-center px-6 max-w-4xl">

        <p className="text-cyan-400 font-semibold mb-3">
          Smart Building Management Platform
        </p>

        <h1 className="text-6xl font-bold leading-tight">
          TowerNav & Chat
        </h1>

        <p className="mt-6 text-gray-300 text-xl">
          Navigate your building, discover offices, chat with people,
          and get instant answers from the AI Assistant.
        </p>

        <div className="mt-10 flex justify-center gap-5">

          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-600 px-7 py-3 rounded-lg font-semibold transition"
          >
            Get Started
          </Link>

          <button
            onClick={scrollToFeatures}
            className="border border-white hover:bg-white hover:text-slate-900 px-7 py-3 rounded-lg font-semibold transition"
          >
            Learn More
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;