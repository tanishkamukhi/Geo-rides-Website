import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Shield, Phone, MapPin, Users, Bell, AlertTriangle,
    Ambulance, Flame, Share2, CheckCircle, Lock, Navigation
} from "lucide-react";

export default function Safety() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "shared" | "error">("idle");
    const [sosActive, setSosActive] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    }, []);

    const requireLogin = (action: () => void) => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        action();
    };

    const handleSOS = () => {
        requireLogin(() => {
            setSosActive(true);
            setCountdown(3);
            let c = 3;
            const interval = setInterval(() => {
                c -= 1;
                setCountdown(c);
                if (c === 0) {
                    clearInterval(interval);
                    setSosActive(false);
                    setCountdown(null);
                    window.location.href = "tel:911";
                }
            }, 1000);
        });
    };

    const handleCallAmbulance = () => {
        requireLogin(() => {
            window.location.href = "tel:911";
        });
    };

    const handleCallFire = () => {
        requireLogin(() => {
            window.location.href = "tel:911";
        });
    };

    const handleCallPolice = () => {
        requireLogin(() => {
            window.location.href = "tel:911";
        });
    };

    const handleShareLocation = () => {
        requireLogin(() => {
            setLocationStatus("loading");
            if (!navigator.geolocation) {
                setLocationStatus("error");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    if (navigator.share) {
                        navigator.share({
                            title: "My Live Location – Geo Rides",
                            text: `I'm at: https://www.google.com/maps?q=${latitude},${longitude}`,
                            url: mapsUrl,
                        }).catch(() => window.open(mapsUrl, "_blank"));
                    } else {
                        window.open(mapsUrl, "_blank");
                    }
                    setLocationStatus("shared");
                    setTimeout(() => setLocationStatus("idle"), 4000);
                },
                () => setLocationStatus("error")
            );
        });
    };

    const handleManageContacts = () => {
        requireLogin(() => navigate("/profile"));
    };

    const AuthGuard = ({ label }: { label: string }) => (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-2">
            <Lock className="w-3 h-3" />
            <span>Login required to {label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-6">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tighter italic">
                        Your Safety, Our Priority
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        One-tap emergency response. Every button below is live and functional — dial police, ambulance, fire brigade or share your GPS instantly.
                    </p>
                    {!isLoggedIn && (
                        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-3 rounded-full text-sm font-semibold">
                            <Lock className="w-4 h-4" />
                            You must be logged in to use emergency features.
                            <button
                                onClick={() => navigate("/login")}
                                className="underline font-bold hover:text-amber-900 transition"
                            >
                                Login now →
                            </button>
                        </div>
                    )}
                </div>

                {/* 🆘 SOS MEGA BUTTON */}
                <div className="mb-12 flex justify-center">
                    <div className="relative">
                        {sosActive && (
                            <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40 scale-150" />
                        )}
                        <button
                            onClick={handleSOS}
                            disabled={sosActive}
                            className={`relative w-48 h-48 rounded-full text-white font-black text-xl shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-2
                            ${sosActive
                                    ? "bg-red-700 scale-95 cursor-wait"
                                    : "bg-geo-red hover:scale-105 active:scale-95 hover:shadow-red-400/60"
                                }`}
                            style={{ boxShadow: sosActive ? "0 0 40px rgba(220,38,38,0.7)" : "0 0 30px rgba(220,38,38,0.4)" }}
                        >
                            <AlertTriangle className="w-14 h-14" />
                            {sosActive && countdown !== null ? (
                                <span className="text-4xl font-black animate-pulse">{countdown}</span>
                            ) : (
                                <span className="text-2xl">SOS</span>
                            )}
                            <span className="text-xs font-semibold opacity-80">
                                {sosActive ? "Calling Emergency…" : "Tap to Call 911"}
                            </span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-gray-400 text-sm mb-16">
                    {sosActive ? "⚠️ Dialing 911 in {countdown}s…" : "Pressing SOS will call Canadian Emergency Services (911) from your mobile"}
                </p>

                {/* Emergency Call Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

                    {/* Police */}
                    <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-geo-red text-white rounded-2xl flex items-center justify-center mb-4">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Police</h3>
                        <p className="text-gray-500 text-sm mb-5">Emergency Police Helpline (911) — Available 24/7</p>
                        <button
                            onClick={handleCallPolice}
                            className="w-full bg-geo-red text-white font-bold py-3 rounded-2xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call" />}
                    </div>

                    {/* Ambulance */}
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[32px] flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4">
                            <Ambulance className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Ambulance</h3>
                        <p className="text-gray-500 text-sm mb-5">Medical Emergency (911) — Reach in minutes</p>
                        <button
                            onClick={handleCallAmbulance}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call" />}
                    </div>

                    {/* Fire Brigade */}
                    <div className="bg-orange-50 border border-orange-100 p-8 rounded-[32px] flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-4">
                            <Flame className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Fire Brigade</h3>
                        <p className="text-gray-500 text-sm mb-5">Fire & Disaster Emergency (911) Helpline</p>
                        <button
                            onClick={handleCallFire}
                            className="w-full bg-orange-500 text-white font-bold py-3 rounded-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call" />}
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

                    {/* Live Location Share */}
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Share Live Location</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Share your real-time GPS location with family or friends via Google Maps. Uses your device's location — works on mobile & desktop.
                        </p>
                        <button
                            onClick={handleShareLocation}
                            disabled={locationStatus === "loading"}
                            className={`w-full py-3 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-base
                            ${locationStatus === "shared"
                                    ? "bg-green-500 text-white"
                                    : locationStatus === "error"
                                        ? "bg-red-100 text-red-600 border border-red-200"
                                        : "bg-black text-white hover:bg-gray-800 active:scale-95"
                                }`}
                        >
                            {locationStatus === "loading" && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {locationStatus === "shared" && <CheckCircle className="w-5 h-5" />}
                            {locationStatus === "error" && <AlertTriangle className="w-5 h-5" />}
                            {locationStatus === "idle" && <Share2 className="w-5 h-5" />}
                            {locationStatus === "idle" && "Share My Location"}
                            {locationStatus === "loading" && "Getting GPS…"}
                            {locationStatus === "shared" && "Location Shared!"}
                            {locationStatus === "error" && "Location Access Denied"}
                        </button>
                        {!isLoggedIn && <AuthGuard label="share location" />}
                    </div>

                    {/* Verified Drivers */}
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Verified Driver Partners</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Every Geo Rides driver undergoes strict background checks, document verification, and safety training to ensure you're in good hands.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Background Verified", "ID Checked", "Safety Trained", "GPS Tracked"].map(tag => (
                                <span key={tag} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    ✓ {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Ride Monitoring */}
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Ride Monitoring</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our smart systems monitor every trip for unusual delays or route deviations. If we detect anything unexpected, our team proactively reaches out.
                        </p>
                        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-semibold text-gray-700">AI Monitoring Active — 24/7</span>
                        </div>
                    </div>

                    {/* Live Trip Sharing */}
                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Live Trip Sharing</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Share your live location and trip status with your loved ones. They can track your ride in real-time and know exactly when you've arrived safely.
                        </p>
                        <button
                            onClick={() => requireLogin(() => navigate("/service/cab"))}
                            className="w-full bg-black text-white py-3 rounded-2xl font-bold hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-5 h-5" /> Book & Track a Ride
                        </button>
                        {!isLoggedIn && <AuthGuard label="track rides" />}
                    </div>
                </div>

                {/* Emergency Contacts CTA */}
                <div className="bg-red-50 border border-red-100 p-12 rounded-[50px] flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 bg-geo-red text-white rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-geo-red mb-2 uppercase italic tracking-tighter">Emergency Contacts</h3>
                        <p className="text-red-900/70 mb-6">
                            Add your emergency contacts in your profile. We'll automatically notify them if you press SOS during a ride — with your real-time GPS location.
                        </p>
                        <button
                            onClick={handleManageContacts}
                            className="bg-geo-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center gap-2"
                        >
                            <Users className="w-5 h-5" />
                            {isLoggedIn ? "Manage Emergency Contacts" : "Login to Manage Contacts"}
                        </button>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="mt-14 bg-gray-900 text-white rounded-[40px] p-10">
                    <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-center">📞 Canadian Emergency & Support Numbers — Quick Reference</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Emergency Services", number: "911", color: "bg-red-650" },
                            { label: "Telehealth Advice", number: "811", color: "bg-blue-600" },
                            { label: "Community Services", number: "211", color: "bg-emerald-600" },
                            { label: "Municipal Services", number: "311", color: "bg-orange-500" },
                            { label: "Suicide Crisis", number: "988", color: "bg-purple-600" },
                            { label: "Travel & Road Link", number: "511", color: "bg-yellow-500" },
                            { label: "Kids Help Phone", number: "1-800-668-6868", color: "bg-pink-700" },
                            { label: "Directory Assistance", number: "411", color: "bg-teal-500" },
                        ].map(({ label, number, color }) => (
                            <a
                                key={number}
                                href={`tel:${number}`}
                                className={`${color} rounded-2xl p-4 text-center hover:opacity-90 active:scale-95 transition-all flex flex-col justify-center items-center`}
                            >
                                <div className="text-xl font-black">{number}</div>
                                <div className="text-[11px] font-semibold opacity-90 mt-1">{label}</div>
                            </a>
                        ))}
                    </div>
                    <p className="text-center text-gray-400 text-xs mt-6">Tap any number to call directly from your device</p>
                </div>

            </main>
            <Footer />
        </div>
    );
}
