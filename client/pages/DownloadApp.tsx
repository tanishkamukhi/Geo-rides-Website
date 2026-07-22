import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Apple, PlayCircle, Smartphone, Download, QrCode, Shield, CheckCircle2,
  Zap, Star, ArrowRight, MapPin, Radio, Lock
} from "lucide-react";

export default function DownloadApp() {
  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);

  const handleDownload = (platform: string) => {
    setDownloadStarted(platform);
    
    // Simulate APK download or App Store redirection
    if (platform === "android") {
      const element = document.createElement("a");
      const file = new Blob([
        "GeoRides Mobile App Installation Package (Simulated APK v2.4.0)\n\nThank you for downloading GeoRides! Install this package on your Android device to experience instant cab booking, live GPS tracking, and digital car unlock features."
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "GeoRides-Mobile-v2.4.0.apk";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    setTimeout(() => {
      setDownloadStarted(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-br from-geo-dark via-gray-900 to-black text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-geo-red/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-geo-red/20 border border-geo-red/30 text-geo-red px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" /> Official Mobile App
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Download <span className="text-geo-red">GeoRides</span> App
                </h1>

                <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
                  Book rides, share live GPS locations, control vehicle digital keys, and trigger 24/7 Emergency SOS — available on iOS & Android.
                </p>

                {/* Download CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => handleDownload("ios")}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all transform active:scale-95 shadow-lg group"
                  >
                    <Apple className="w-7 h-7 text-black group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Download on the</p>
                      <p className="text-lg font-black leading-none">App Store</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDownload("android")}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-geo-red text-white font-bold rounded-2xl hover:bg-red-600 transition-all transform active:scale-95 shadow-lg shadow-red-900/40 group"
                  >
                    <PlayCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-red-200 tracking-wider">Get it on</p>
                      <p className="text-lg font-black leading-none">Google Play (APK)</p>
                    </div>
                  </button>
                </div>

                {downloadStarted && (
                  <div className="p-4 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400" />
                    <span>
                      {downloadStarted === "android"
                        ? "GeoRides Android APK download started automatically!"
                        : "Redirecting to Apple App Store..."}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center sm:text-left">
                  <div>
                    <p className="text-2xl font-black text-white">4.9 ★</p>
                    <p className="text-xs text-gray-400 font-medium">Over 200k Reviews</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">10M+</p>
                    <p className="text-xs text-gray-400 font-medium">Downloads</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-xs text-gray-400 font-medium">Verified Safe</p>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup */}
              <div className="flex justify-center items-center">
                <div className="relative w-72 sm:w-80 h-[520px] bg-black rounded-[48px] p-4 border-8 border-gray-800 shadow-2xl shadow-geo-red/20 transform hover:rotate-1 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-b from-gray-900 to-geo-dark rounded-[36px] overflow-hidden p-5 flex flex-col justify-between text-white relative">
                    {/* Speaker Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full" />

                    <div className="pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-black text-geo-red text-xl tracking-wider">GEORIDES</span>
                        <Radio className="w-5 h-5 text-green-400 animate-pulse" />
                      </div>

                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4">
                        <p className="text-xs text-gray-400 font-bold uppercase">Current Ride</p>
                        <p className="font-bold text-sm text-white">Union Station → Pearson Airport</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-green-400 font-semibold">
                          <span>Driver En Route</span>
                          <span>3 mins away</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-geo-red text-white p-3 rounded-xl flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Emergency SOS Active
                          </div>
                          <span>TAP</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between text-xs text-gray-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-geo-red" /> Live GPS Location
                          </div>
                          <span>ON</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center space-y-2">
                      <QrCode className="w-16 h-16 mx-auto text-white" />
                      <p className="text-xs font-bold text-gray-300">Scan QR Code on Mobile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-geo-dark mb-4">Why Download GeoRides App?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need for seamless transportation, car rentals, and parcel delivery right on your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-geo-red/10 text-geo-red rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant 1-Tap Booking</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Get paired with verified nearby drivers in under 15 seconds with upfront fares and zero hidden charges.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Emergency SOS & Live Location</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Share your trip GPS coordinates with loved ones and connect directly to 911 emergency services instantly.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Digital Car Key Access</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Unlock GeoRides rental cars directly from your phone bluetooth with full contactless digital key authentication.
              </p>
            </div>
          </div>
        </section>

        {/* Installation Steps */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-gray-900 text-white rounded-3xl p-10">
          <h2 className="text-2xl font-black text-center mb-8">How to Install in 3 Easy Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-geo-red rounded-full flex items-center justify-center font-black mx-auto">1</div>
              <h4 className="font-bold text-lg">Click Download</h4>
              <p className="text-gray-400 text-sm">Select iOS App Store or Android APK download link above.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-geo-red rounded-full flex items-center justify-center font-black mx-auto">2</div>
              <h4 className="font-bold text-lg">Install Application</h4>
              <p className="text-gray-400 text-sm">Open the downloaded installer package and accept permissions.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-geo-red rounded-full flex items-center justify-center font-black mx-auto">3</div>
              <h4 className="font-bold text-lg">Sign In & Ride</h4>
              <p className="text-gray-400 text-sm">Log into your GeoRides account and start booking rides immediately!</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
