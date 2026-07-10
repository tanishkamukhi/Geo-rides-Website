import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, CreditCard, LogOut, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.id) {
                    setUser(data);
                } else {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                }
            })
            .catch(err => {
                console.error("Profile load failed", err);
                setError("Could not load profile. The database may not be configured yet.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                    <img src="/logo.png" alt="Geo Rides" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-1 mb-4">
                    <div className="w-2 h-2 bg-geo-red rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-geo-red rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-geo-red rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase">Loading Profile…</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4 pt-24">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Profile Unavailable</h2>
                        <p className="text-gray-400 text-sm mb-6">{error || "Your session may have expired."}</p>
                        <p className="text-xs text-gray-500 bg-gray-800 rounded-xl p-4 font-mono mb-6">
                            To enable user profiles, set DATABASE_URL in your .env file pointing to a Neon PostgreSQL database.
                        </p>
                        <button
                            onClick={() => { localStorage.removeItem("authToken"); navigate("/login"); }}
                            className="inline-flex items-center gap-2 bg-geo-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const initials = user.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-geo-red via-red-700 to-orange-600" />

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-8">
                            <div className="w-24 h-24 bg-gray-900 border-4 border-white rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                {initials}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-geo-red px-6 py-2 rounded-full font-bold flex items-center space-x-2 hover:bg-geo-red hover:text-white transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>

                        <div className="mb-10">
                            <h1 className="text-3xl font-black text-black mb-1 italic uppercase tracking-tighter">{user.fullName}</h1>
                            <p className="text-gray-400">Member since {user.joined}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-black">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="font-bold text-black">{user.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[32px] flex justify-around items-center">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-black">{user.trips}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trips</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="text-center">
                                    <p className="text-2xl font-black text-black">{user.rating}★</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] hover:border-geo-red hover:shadow-md transition">
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="w-6 h-6 text-gray-400" />
                                    <span className="font-bold text-black">Payment Methods</span>
                                </div>
                                <span className="text-gray-300">→</span>
                            </button>
                            <button className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] hover:border-geo-red hover:shadow-md transition">
                                <div className="flex items-center space-x-4">
                                    <MapPin className="w-6 h-6 text-gray-400" />
                                    <span className="font-bold text-black">Saved Places</span>
                                </div>
                                <span className="text-gray-300">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
