function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-10">Features</h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="shadow-lg p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Navigation</h3>
            <p>Find offices, meeting rooms and departments easily.</p>
          </div>

          <div className="shadow-lg p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">Live Chat</h3>
            <p>Talk with employees and visitors instantly.</p>
          </div>

          <div className="shadow-lg p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-3">AI Assistant</h3>
            <p>Get answers to common building questions.</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;