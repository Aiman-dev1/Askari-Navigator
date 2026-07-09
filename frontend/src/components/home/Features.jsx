import { FaSearchLocation, FaMapMarkedAlt, FaComments, FaRobot } from "react-icons/fa";

function Features() {
  const featuresList = [
    {
      icon: <FaSearchLocation className="text-3xl text-gold-500" />,
      title: "Office Directory",
      desc: "Instantly search departments, executive office suites, conference facilities, and retail zones."
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl text-gold-500" />,
      title: "Indoor Navigation",
      desc: "Get elegant, step-by-step directions to guide visitors directly to their destination floor and room."
    },
    {
      icon: <FaComments className="text-3xl text-gold-500" />,
      title: "Real-Time Chat",
      desc: "Connect seamlessly with verified tenants and building personnel using instant chat rooms."
    },
    {
      icon: <FaRobot className="text-3xl text-gold-500" />,
      title: "AI Assistant",
      desc: "Ask inquiries about building operating hours, emergency guidelines, and general FAQs."
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-slate-900 tracking-wide">
          BUILDING FEATURES & SERVICES
        </h2>

        <div className="w-20 h-[2px] bg-gold-400 mx-auto mt-4 mb-6"></div>

        <p className="text-center text-gray-600 max-w-xl mx-auto mb-16 font-light">
          Designed for maximum productivity and premium business presence, incorporating cutting-edge services.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((f, i) => (
            <div 
              key={i} 
              className="bg-white border border-gray-200/60 shadow-md hover:border-gold-400/50 rounded p-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group"
            >
              {/* Gold Accent Top Bar */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-gold-400 transition-colors duration-300"></div>
              
              <div className="mb-5">
                {f.icon}
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900 mb-3 tracking-wide">
                {f.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;