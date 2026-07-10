import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authToken");

  const navLinks = [
    { label: "🚗 Cab Service", href: "/service/cab" },
    { label: "🏨 Travel & Stay", href: "/service/travel" },
    { label: "📦 Parcel Service", href: "/service/parcel" },
    { label: "🛡️ Safety", href: "/safety" },
    { label: "🤝 Partner", href: "/partner" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow border border-gray-100">
                <img src="/logo.png" alt="Geo Rides Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black tracking-tight text-geo-red">GEO</span>
                <span className="text-xl font-black tracking-tight text-gray-900">RIDES</span>
              </div>
              <p className="text-[9px] font-semibold tracking-widest text-gray-400 uppercase">
                Go Places, Go Geo
              </p>
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive(link.href)
                    ? "bg-geo-red text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/history"
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive("/history")
                    ? "bg-geo-red text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                My Rides
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-all hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-geo-red hover:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="w-9 h-9 rounded-xl bg-geo-red flex items-center justify-center text-white"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 pb-4">
            <div className="px-2 pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                      ? "bg-geo-red text-white"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/history"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  My Rides
                </Link>
              )}
            </div>
            <div className="px-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <LanguageSwitcher />
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 bg-geo-red text-white text-sm font-bold px-5 py-2.5 rounded-xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
