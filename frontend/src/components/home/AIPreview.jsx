function AIPreview() {
  return (
    <section className="py-24 bg-[#fcfbfa]">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-5 tracking-wide uppercase">
              AI CONCIERGE ASSISTANT
            </h2>

            <div className="w-16 h-[2px] bg-gold-400 mb-6"></div>

            <p className="text-gray-500 font-light leading-relaxed mb-6">
              Ask building-related questions regarding room numbers, amenities, operating hours, policies, or floor plans, and receive instant, precise answers.
            </p>

          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-8 shadow-xl relative overflow-hidden">
            {/* Fine decorative line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-500 via-gold-400 to-transparent"></div>

            <div className="mb-6 border-b border-white/5 pb-4">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Askari Virtual Assistant</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-2">
                <span className="text-gold-400 font-semibold">User:</span>
                <p className="text-gray-300">Where is the Executive Suite of Askari Bank?</p>
              </div>

              <div className="flex gap-2 bg-white/5 p-4 rounded border-l-2 border-gold-400">
                <span className="text-gold-400 font-semibold">Concierge:</span>
                <p className="text-gray-300">The Askari Bank Executive Offices are located on the <strong className="text-white font-medium">8th Floor, West Wing Suite 803</strong>. Access requires security check-in at the ground floor lobby speed gates.</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AIPreview;