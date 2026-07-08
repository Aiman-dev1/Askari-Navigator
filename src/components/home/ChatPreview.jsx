import { Link } from "react-router-dom";

function ChatPreview() {
  return (
    <section className="py-20 bg-slate-100">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="bg-white shadow-xl rounded-xl p-6">

            <div className="mb-4">
              <p className="font-bold">Ali</p>
              <div className="bg-slate-200 inline-block px-4 py-2 rounded-lg">
                Welcome everyone 👋
              </div>
            </div>

            <div className="text-right mb-4">
              <p className="font-bold">You</p>
              <div className="bg-cyan-500 text-white inline-block px-4 py-2 rounded-lg">
                I'll be there in 5 minutes.
              </div>
            </div>

            <div>
              <p className="font-bold">Sara</p>
              <div className="bg-slate-200 inline-block px-4 py-2 rounded-lg">
                Meeting starts at 3 PM.
              </div>
            </div>

          </div>

          <div>

            <h2 className="text-4xl font-bold mb-5">
              Real-Time Chat
            </h2>

            <p className="text-gray-600 mb-6">
              Communicate with employees and visitors instantly inside the building.
            </p>

            <Link
              to="/chat"
              className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600"
            >
              Open Chat
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ChatPreview;