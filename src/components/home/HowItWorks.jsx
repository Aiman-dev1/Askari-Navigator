function HowItWorks() {
  return (
    <section className="bg-slate-100 py-20">

      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-bold">1. Search</h3>
            <p>Search any office or department.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold">2. Navigate</h3>
            <p>Follow indoor directions.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold">3. Chat</h3>
            <p>Connect with people in the building.</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;