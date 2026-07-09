import { Link } from "react-router-dom";

function ChatPreview() {
  return (
    <section className="py-24 bg-[#f5f3ef]">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="bg-white border border-gray-200/50 shadow-xl rounded p-8 space-y-4">

            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs text-gold-600 font-bold uppercase tracking-wider">Ernst & Young (8th Flr)</span>
              <div className="bg-slate-50 border border-gray-100 px-4 py-3 rounded text-sm text-gray-700 max-w-[85%]">
                Welcome everyone. The audit files have been uploaded to the dashboard. 👋
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">You (Apex Tower Admin)</span>
              <div className="bg-slate-900 text-white px-4 py-3 rounded text-sm max-w-[85%] border-r-2 border-gold-400">
                Acknowledged. We will review it in 5 minutes.
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs text-gold-600 font-bold uppercase tracking-wider">Zahoor & Co Legal (3rd Flr)</span>
              <div className="bg-slate-50 border border-gray-100 px-4 py-3 rounded text-sm text-gray-700 max-w-[85%]">
                The boardroom has been reserved for the 3 PM briefing.
              </div>
            </div>

          </div>

          <div>

            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-5 tracking-wide uppercase">
              REAL-TIME TENANT NETWORK
            </h2>

            <div className="w-16 h-[2px] bg-gold-400 mb-6"></div>

            <p className="text-gray-500 font-light leading-relaxed mb-8">
              Connect and collaborate instantaneously with building administrators, other tenant firms, executive consultants, and on-site support teams through private, secure channels.
            </p>

            <Link
              to="/chat"
              className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-8 py-3.5 rounded font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-400/10 inline-block uppercase text-sm"
            >
              Open Tenant Network
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ChatPreview;