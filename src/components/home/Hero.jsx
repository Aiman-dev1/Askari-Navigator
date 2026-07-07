function Hero() {
  return (
    <section className="bg-slate-900 text-white min-h-[90vh] flex items-center justify-center">
      <div className="text-center px-6">

        {/* Main Heading */}
        <h1 className="text-5xl font-bold">
          TowerNav & Chat
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-gray-300 text-lg">
          Smart Indoor Navigation & Real-Time Chat
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">

          <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg">
            Get Started
          </button>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black">
            Learn More
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;