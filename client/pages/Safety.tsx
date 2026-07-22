import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Shield, Phone, MapPin, AlertTriangle, Ambulance, Flame, Share2,
    CheckCircle, Lock, Navigation, Radio, Copy, Check
} from "lucide-react";

export default function Safety() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "shared" | "error">("idle");
    const [sosActive, setSosActive] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);

        // Auto request location when page loads if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.log("Geolocation permission pending")
            );
        }
    }, []);

    const requireLogin = (action: () => void) => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        action();
    };

    // Core Emergency Helper: Enables GPS Location + Triggers Emergency Dialing
    const triggerEmergencyWithLocation = (serviceName: string, number: string = "911") => {
        requireLogin(() => {
            setLocationStatus("loading");

            const executeCallAndShare = (lat?: number, lng?: number) => {
                setLocationStatus("shared");
                if (lat && lng) {
                    setCoords({ lat, lng });
                }

                // Execute call to emergency center
                window.location.href = `tel:${number}`;
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        executeCallAndShare(latitude, longitude);
                    },
                    (err) => {
                        console.warn("Geolocation error, triggering direct call:", err);
                        setLocationStatus("error");
                        executeCallAndShare();
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            } else {
                executeCallAndShare();
            }
        });
    };

    const handleSOS = () => {
        requireLogin(() => {
            setSosActive(true);
            setCountdown(3);
            let c = 3;

            // Fetch location immediately when SOS is tapped
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLocationStatus("shared");
                });
            }

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

    const handleCopyLocation = () => {
        if (!coords) return;
        const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        navigator.clipboard.writeText(mapsUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-geo-red rounded-2xl mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black mb-3 uppercase tracking-tighter italic">
                        YOUR SAFETY, OUR PRIORITY
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        One-tap emergency response. Tapping SOS or any helpline below will <strong>enable your real-time GPS location</strong> and immediately dial emergency services (911).
                    </p>
                    {!isLoggedIn && (
                        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-3 rounded-full text-sm font-bold shadow-sm">
                            <Lock className="w-4 h-4 text-amber-600" />
                            Please log in to use emergency SOS calling & GPS tracking features.
                            <button
                                onClick={() => navigate("/login")}
                                className="underline font-extrabold text-geo-red hover:text-red-700 transition ml-1"
                            >
                                Login now →
                            </button>
                        </div>
                    )}
                </div>

                {/* Live GPS Location Bar */}
                <div className="max-w-2xl mx-auto mb-10 bg-gray-900 text-white rounded-3xl p-6 shadow-xl border border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-geo-red/20 text-geo-red rounded-xl flex items-center justify-center">
                                <Radio className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Device GPS Location Status</p>
                                <p className="font-bold text-sm text-white">
                                    {coords
                                        ? `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`
                                        : "Locating device coordinates..."}
                                </p>
                            </div>
                        </div>

                        {coords && (
                            <button
                                onClick={handleCopyLocation}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl transition text-white"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied Maps URL!" : "Copy GPS Link"}
                            </button>
                        )}
                    </div>
                </div>

                {/* 🆘 SOS MEGA BUTTON */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {sosActive && (
                            <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-50 scale-150" />
                        )}
                        <button
                            onClick={handleSOS}
                            disabled={sosActive}
                            className={`relative w-48 h-48 rounded-full text-white font-black shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2
                            ${sosActive
                                    ? "bg-red-800 scale-95 cursor-wait"
                                    : "bg-geo-red hover:scale-105 active:scale-95 hover:shadow-red-500/60"
                                }`}
                            style={{ boxShadow: sosActive ? "0 0 50px rgba(220,38,38,0.8)" : "0 0 35px rgba(220,38,38,0.4)" }}
                        >
                            <AlertTriangle className="w-14 h-14" />
                            {sosActive && countdown !== null ? (
                                <span className="text-4xl font-black animate-pulse">{countdown}</span>
                            ) : (
                                <span className="text-3xl font-black tracking-wider">SOS</span>
                            )}
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                                {sosActive ? "Calling 911 in progress..." : "Express Call 911 + GPS"}
                            </span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-gray-500 text-sm font-semibold mb-16">
                    {sosActive ? `⚠️ Dialing 911 in ${countdown}s... Location transmitted.` : "Pressing SOS will enable GPS location & call Canadian Emergency Services (911)"}
                </p>

                {/* Emergency Call Services */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

                    {/* Police */}
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition">
                        <div className="w-16 h-16 bg-geo-red text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-red-200">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Police Emergency</h3>
                        <p className="text-gray-500 text-sm mb-6">Emergency Police Helpline (911) — 24/7 Response with GPS</p>
                        <button
                            onClick={() => triggerEmergencyWithLocation("Police", "911")}
                            className="w-full bg-geo-red text-white font-bold py-3.5 rounded-2xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call Police" />}
                    </div>

                    {/* Ambulance */}
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-blue-200">
                            <Ambulance className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Ambulance Medical</h3>
                        <p className="text-gray-500 text-sm mb-6">Medical Emergency Helpline (911) — Immediate Paramedic Response</p>
                        <button
                            onClick={() => triggerEmergencyWithLocation("Ambulance", "911")}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call Ambulance" />}
                    </div>

                    {/* Fire Brigade */}
                    <div className="bg-orange-50 border border-orange-100 p-8 rounded-3xl flex flex-col items-center text-center hover:shadow-lg transition">
                        <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-orange-200">
                            <Flame className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1">Fire Brigade</h3>
                        <p className="text-gray-500 text-sm mb-6">Fire & Disaster Helpline (911) — Emergency Rescue Ops</p>
                        <button
                            onClick={() => triggerEmergencyWithLocation("Fire Brigade", "911")}
                            className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-lg"
                        >
                            <Phone className="w-5 h-5" /> Call 911
                        </button>
                        {!isLoggedIn && <AuthGuard label="call Fire Brigade" />}
                    </div>
                </div>

                {/* Additional Safety Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-black">Share Live GPS Location</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Broadcast your live location coordinates to family or emergency contacts via Google Maps or WhatsApp.
                        </p>
                        <button
                            onClick={() => triggerEmergencyWithLocation("Share Location")}
                            className="w-full py-3 px-6 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" /> Share My Live Location
                        </button>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-black">Verified Driver Security</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Every GeoRides driver undergoes background verification checks (Canadian SIN, Driver License audit to tanishkamukhi12@gmail.com).
                        </p>
                        <button
                            onClick={() => navigate("/data-security")}
                            className="w-full py-3 px-6 rounded-2xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition flex items-center justify-center gap-2"
                        >
                            View Data Security & Vault Standards
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
