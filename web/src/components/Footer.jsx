export default function Footer() {
  return (
    <footer
      className="relative z-20 w-full text-white py-10 px-6 sm:px-10 lg:px-20 animate-fade-in-up"
      style={{
        background: "linear-gradient(135deg, #3E5F44, #5E936C, #93DA97, #E8FFD7)",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">FreshCart</h3>
          <p className="text-sm leading-relaxed text-white/90">
            Your daily dose of farm-fresh groceries delivered with care and quality.
            Experience organic living at its best.
          </p>
        </div>

        {/* Quick Links */}
        <nav className="transform transition duration-500 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1 text-white/90">
            {[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: "My Orders", href: "/orders" },
              { name: "Account Settings", href: "/account" },
              { name: "Help & Support", href: "/help" }
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-white transition duration-300 ease-in-out"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Info */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <ul className="text-sm space-y-2 text-white/90">
            <li>📍 123 Farm Fresh Lane</li>
            <li>☎️ +1 (555) 123-4567</li>
            <li>✉️ support@freshcart.com</li>
          </ul>
        </div>

        {/* Socials */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-white text-xl">
            {[
              { icon: "instagram", url: "https://instagram.com" },
              { icon: "facebook", url: "https://facebook.com" },
              { icon: "x-twitter", url: "https://twitter.com" },
              { icon: "youtube", url: "https://youtube.com" },
            ].map((social) => (
              <a
                key={social.icon}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-transform duration-300 transform hover:scale-110"
              >
                <i className={`fab fa-${social.icon}`}></i> {/* Requires FontAwesome */}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 text-center text-sm border-t border-white/20 pt-4 animate-fade-in-up delay-200">
        © 2025 FreshCart. Made with ❤️ by Preethi. |{" "}
        <a href="#" className="hover:underline transition-colors duration-300">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
