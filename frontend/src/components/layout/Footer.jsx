import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-12 border-t border-gold-400/10">

      <div className="max-w-7xl mx-auto px-6">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-widest text-gold-400">
              ASKARI TOWER
            </h2>

            <p className="text-gray-400 mt-2 max-w-md text-sm font-light">
              Where cutting-edge design meets peace of mind. Pakistan's premier LEED "Gold" certified commercial building project.
            </p>
          </div>

          {/* Contact Details & Links */}
          <div className="text-sm text-gray-400 space-y-1">
            <p className="font-semibold text-gold-400">MARKETING OFFICE</p>
            <p>Main Boulevard, Gulberg III, Lahore, Pakistan</p>
            <p>Phone: (+92)-333-5374535 | Email: info@askaritower.com</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-gold-400/20 text-gray-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-gold-400/20 text-gray-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-gold-400/20 text-gray-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
            >
              <FaLinkedinIn size={16} />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-gold-400/20 text-gray-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
            >
              <FaGithub size={16} />
            </a>

          </div>

        </div>

        {/* Bottom */}
        <hr className="my-8 border-gold-400/10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>
            © 2026 ASKARI CORPORATE TOWER | Maintained by Group MIS Dept AWT.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>

    </footer>
  );
}

export default Footer;