import { Link } from "react-router-dom";
import {
  MapPin, Phone, Mail, Twitter, Instagram, Facebook, Youtube,
  Linkedin, ArrowRight, Shield, Zap, Star, Globe
} from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Investors", href: "/investors" },
  ],
  services: [
    { label: "Cab Service", href: "/service/cab" },
    { label: "Travel & Stay", href: "/service/travel" },
    { label: "Parcel Service", href: "/service/parcel" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Report Issue", href: "/report" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

const stats = [
  { value: "10M+", label: "Rides Completed" },
  { value: "500+", label: "Cities" },
  { value: "200K+", label: "Driver Partners" },
  { value: "4.9★", label: "App Rating" },
];

export default function Footer() {
  return (
    <footer className="bg-geo-dark dark:bg-black text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-geo-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-geo-red/3 rounded-full blur-3xl pointer-events-none" />

      {/* Stats bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-geo-red mb-1">{stat.value}</div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-geo-gradient flex items-center justify-center shadow-geo-red">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M85 20C77 8 62 2 48 4C28 7 12 24 10 44C8 66 24 86 46 90C66 94 84 80 88 62C90 54 88 47 84 42H54V56H72C70 66 62 72 52 72C38 72 26 60 26 46C26 32 38 20 52 20C60 20 67 24 72 30L85 20Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-geo-red">GEO</span>
                  <span className="text-xl font-black text-white">RIDES</span>
                </div>
                <p className="text-[9px] font-semibold tracking-widest text-white/50 uppercase">Go Places, Go Geo</p>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              India's most trusted premium cab booking platform. Ride in comfort, safety, and style — 24/7, across 500+ cities.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, text: "Verified Safe" },
                { icon: Zap, text: "Instant Booking" },
                { icon: Star, text: "4.9★ Rated" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/70"
                >
                  <Icon className="w-3 h-3 text-geo-red" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-geo-red hover:border-geo-red transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/55 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/55 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/55 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Stay Updated</h4>
            <p className="text-white/55 text-sm mb-4 leading-relaxed">
              Get exclusive deals and ride updates.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-geo-red focus:bg-white/8 transition-all"
              />
              <button
                type="submit"
                className="w-full btn-primary py-3 text-sm rounded-xl justify-center"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-white/55 text-xs">
                <Phone className="w-3.5 h-3.5 text-geo-red flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-white/55 text-xs">
                <Mail className="w-3.5 h-3.5 text-geo-red flex-shrink-0" />
                <span>support@georides.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/55 text-xs">
                <Globe className="w-3.5 h-3.5 text-geo-red flex-shrink-0" />
                <span>Available in 500+ cities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Geo Rides Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/40 hover:text-white/70 text-xs transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-geo-red" />
              <span className="text-white/40 text-xs">Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
