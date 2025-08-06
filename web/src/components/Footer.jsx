export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative z-20 w-full text-gray-800 py-6 px-6 sm:px-10 lg:px-20 animate-fade-in-up"
      style={{
        background: "linear-gradient(135deg, #E8FFD7, #ffffff, #93DA97)",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-lg font-semibold mb-1.5">FreshCart</h3>
          <p className="text-xs leading-relaxed text-gray-700">
            Your daily dose of farm-fresh groceries delivered with care and quality.
            Experience organic living at its best.
          </p>
        </div>

        {/* Quick Links */}
        <nav className="transform transition duration-500 hover:scale-105">
          <h3 className="text-lg font-semibold mb-1.5">Quick Links</h3>
          <ul className="text-xs space-y-1 text-gray-700">
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
                  className="hover:text-black transition duration-300 ease-in-out"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Info */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-lg font-semibold mb-1.5">Contact</h3>
          <ul className="text-xs space-y-1.5 text-gray-700">
            <li>📍 123 Farm Fresh Lane</li>
            <li>☎️ +1 (555) 123-4567</li>
            <li>✉️ support@freshcart.com</li>
          </ul>
        </div>

        {/* Socials */}
        <div className="transform transition duration-500 hover:scale-105">
          <h3 className="text-lg font-semibold mb-1.5">Follow Us</h3>
          <div className="flex gap-4 text-gray-700 text-lg">
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
                className="hover:text-black transition-transform duration-300 transform hover:scale-110"
              >
                <i className={`fab fa-${social.icon}`}></i> {/* Requires FontAwesome */}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-xs border-t border-gray-300 pt-3 animate-fade-in-up delay-200 text-gray-600">
        © 2025 FreshCart. Made with ❤️ by Preethi. |{" "}
        <a href="/help" className="hover:underline transition-colors duration-300">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
