function HowItWorks() {
  return (
    <section className="py-20 bg-slate-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-3">
          How It Works
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Find your destination in just a few simple steps.
        </p>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl font-bold text-cyan-600 mb-3">
              1
            </div>

            <h3 className="text-xl font-bold mb-2">
              Search
            </h3>

            <p className="text-gray-600">
              Search for any office, department or meeting room.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl font-bold text-cyan-600 mb-3">
              2
            </div>

            <h3 className="text-xl font-bold mb-2">
              Navigate
            </h3>

            <p className="text-gray-600">
              Follow indoor directions to reach your destination.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl font-bold text-cyan-600 mb-3">
              3
            </div>

            <h3 className="text-xl font-bold mb-2">
              Chat
            </h3>

            <p className="text-gray-600">
              Connect instantly with employees and visitors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl font-bold text-cyan-600 mb-3">
              4
            </div>

            <h3 className="text-xl font-bold mb-2">
              AI Assistant
            </h3>

            <p className="text-gray-600">
              Get instant answers to building-related questions.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;