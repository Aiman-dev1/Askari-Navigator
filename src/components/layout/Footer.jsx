import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              TowerNav & Chat
            </h2>

            <p className="text-gray-400 mt-2">
              Smart Indoor Navigation & Real-Time Communication
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-5 text-2xl">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              <FaInstagram />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              <FaGithub />
            </a>

          </div>

        </div>

        {/* Bottom */}
        <hr className="my-6 border-gray-700" />

        <p className="text-center text-gray-400">
          © 2026 TowerNav & Chat | All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;