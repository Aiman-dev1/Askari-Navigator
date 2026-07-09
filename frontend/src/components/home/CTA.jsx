import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-cyan-600 text-white py-20">

      <div className="max-w-5xl mx-auto text-center px-6">

        <h2 className="text-5xl font-bold mb-5">
          Ready to Explore Your Building?
        </h2>

        <p className="text-lg mb-10">
          Start using TowerNav to navigate offices, chat with people,
          and get instant help from the AI Assistant.
        </p>

        {/* <Link
          to="/login"
          className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
        >
          Login Now
        </Link> */}

      </div>

    </section>
  );
}

export default CTA;