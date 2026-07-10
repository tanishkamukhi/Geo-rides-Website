import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Check, X, ShieldAlert, Award, DollarSign, MapPin, Navigation, Clock, User, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RideRequest {
    id: string;
    userId: string;
    source: string;
    destination: string;
    fare: number;
    status: string;
    createdAt: string;
    userPhone?: string;
    userName?: string;
}

export default function DriverDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [online, setOnline] = useState(false);
    const [driverProfile, setDriverProfile] = useState<any>(null);
    const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
    const [earnings, setEarnings] = useState({ daily: 120, weekly: 640, monthly: 2450 });
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchDriverStatus();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDriverStatus = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/driver/status", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDriverProfile(data.profile);
                setOnline(data.profile?.status === "online");
                fetchRequests();
            } else {
                // Fallback fallback
                setDriverProfile({
                    fullName: "Alex Mercer",
                    driversLicense: "ON-DL-49301-92305",
                    vehicleNumber: "CVBA 894",
                    vehicleType: "Premium Car (Tesla Model 3)",
                    isVerified: false,
                    status: "offline"
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/driver/requests", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRideRequests(data.requests);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch("/api/driver/toggle-status", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: online ? "offline" : "online" })
            });
            if (res.ok) {
                setOnline(!online);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (rideId: string) => {
        setActioning(rideId);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/driver/accept-ride", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rideId })
            });
            if (res.ok) {
                // Update requests state
                setRideRequests(prev => prev.filter(r => r.id !== rideId));
                // Add fake cash to earnings
                setEarnings(prev => ({
                    ...prev,
                    daily: prev.daily + 35,
                    weekly: prev.weekly + 35
                }));
                alert("Ride accepted successfully! GPS route guided to pickup.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActioning(null);
        }
    };

    const handleDecline = async (rideId: string) => {
        // Simply filter out locally or let backend know
        setRideRequests(prev => prev.filter(r => r.id !== rideId));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-geo-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const isVerified = driverProfile?.isVerified ?? false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            <Header />
            <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto space-y-8">
                {/* Banner Verification Status */}
                {!isVerified ? (
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <ShieldAlert className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="font-bold text-lg text-white">Verification Status: Pending Checks</h2>
                                <p className="text-sm text-gray-400 max-w-2xl mt-1 leading-relaxed">
                                    We are currently performing Canadian citizen background, SIN and driver's license validations. You can explore the dashboard but cannot accept live passengers until verified.
                                </p>
                            </div>
                        </div>
                        <div className="bg-amber-500/10 text-amber-400 text-xs px-4 py-2 rounded-xl font-bold uppercase tracking-wider border border-amber-500/20">
                            Under Review
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <Award className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="font-bold text-lg text-white">Profile Fully Verified ✔</h2>
                                <p className="text-sm text-gray-400 max-w-2xl mt-1 leading-relaxed">
                                    Your identity documents, vehicle plates, and background are verified. You are authorized to accept high-tier VIP and standard bookings.
                                </p>
                            </div>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 text-xs px-4 py-2 rounded-xl font-bold uppercase tracking-wider border border-emerald-500/30">
                            Active Partner
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Driver Info & Toggle Status */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-geo-red/5 rounded-full blur-2xl" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-geo-red flex items-center justify-center shadow-lg shadow-red-500/20 text-white font-black text-2xl">
                                    {driverProfile?.fullName ? driverProfile.fullName[0] : "D"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{driverProfile?.fullName || "Driver Partner"}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{driverProfile?.vehicleType || "VIP Driver"}</p>
                                </div>
                            </div>

                            <div className="border-t border-white/5 py-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">License Plate</span>
                                    <span className="font-semibold text-gray-300">{driverProfile?.vehicleNumber || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Driver License</span>
                                    <span className="font-semibold text-gray-300">{driverProfile?.driversLicense || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service Area</span>
                                    <span className="font-semibold text-gray-300">Toronto Metro, ON</span>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm">Availability Mode</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{online ? "Receiving ride offers" : "Offline / Resting"}</p>
                                </div>
                                <Switch
                                    checked={online}
                                    onCheckedChange={toggleStatus}
                                    disabled={!isVerified}
                                    className="data-[state=checked]:bg-geo-red"
                                    title="Driver Availability status online/offline"
                                />
                            </div>
                        </div>

                        {/* Earnings Recap */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl space-y-4">
                            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-geo-red" /> Earnings Dashboard
                            </h3>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                                    <span className="text-[10px] text-gray-500 block uppercase">Today</span>
                                    <span className="text-lg font-black text-white">CA${earnings.daily}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                                    <span className="text-[10px] text-gray-500 block uppercase">Weekly</span>
                                    <span className="text-lg font-black text-white">CA${earnings.weekly}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
                                    <span className="text-[10px] text-gray-500 block uppercase">Monthly</span>
                                    <span className="text-lg font-black text-white font-mono">CA${earnings.monthly}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ride Offers panel */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Active Ride Requests</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Real-time taxi matching listings in your radar</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-geo-red rounded-full animate-ping" />
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Radar Scanning</span>
                                </div>
                            </div>

                            {!online ? (
                                <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-gray-500">
                                    <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                    <p className="font-bold text-white mb-1">You are Currently Offline</p>
                                    <p className="text-sm max-w-sm mx-auto">Toggle Availability Mode to "Online" on the left panel to begin receiving bookings.</p>
                                </div>
                            ) : rideRequests.length === 0 ? (
                                <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-gray-500">
                                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600 animate-pulse" />
                                    <p className="font-bold text-white mb-1">Scanning for requests near you...</p>
                                    <p className="text-sm max-w-sm mx-auto">New CAD fare bookings will stream here automatically.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {rideRequests.map(req => (
                                        <div key={req.id} className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-geo-red opacity-80" />

                                            <div className="space-y-3 flex-1 w-full">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-geo-red/10 border border-geo-red/20 text-geo-red text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
                                                        CA${req.fare} Fare
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                        <p className="text-gray-300">
                                                            <strong className="text-white text-xs block font-bold text-gray-500 uppercase">Pickup</strong>
                                                            {req.source}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-geo-red mt-1.5 flex-shrink-0" />
                                                        <p className="text-gray-300">
                                                            <strong className="text-white text-xs block font-bold text-gray-500 uppercase">Destination</strong>
                                                            {req.destination}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleAccept(req.id)}
                                                    disabled={actioning === req.id}
                                                    className="flex-1 md:flex-none bg-geo-red hover:bg-red-600 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                                                >
                                                    <Check className="w-4 h-4" /> Accept Ride
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(req.id)}
                                                    className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-4 py-3 rounded-xl text-sm transition flex items-center justify-center gap-1"
                                                >
                                                    <X className="w-4 h-4" /> Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
