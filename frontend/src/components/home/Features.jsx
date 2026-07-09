function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-3">
          Powerful Features
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Everything you need inside one smart building platform.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-3">
              Office Directory
            </h3>

            <p className="text-gray-600">
              Search departments, offices, meeting rooms and facilities instantly.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-3">
              Indoor Navigation
            </h3>

            <p className="text-gray-600">
              Get simple floor-by-floor directions to your destination.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-3">
              Real-Time Chat
            </h3>

            <p className="text-gray-600">
              Connect with visitors and employees inside the building.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-xl font-bold mb-3">
              AI Assistant
            </h3>

            <p className="text-gray-600">
              Ask building-related questions and get instant answers.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;