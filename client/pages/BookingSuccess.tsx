import { useLocation, Link } from "react-router-dom";
import {
    CheckCircle2,
    Gift,
    Star,
    Phone,
    MessageSquare,
    Share2,
    AlertTriangle,
    History as HistoryIcon,
    Home,
    ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingSuccess() {
    const location = useLocation();
    const bookingData = location.state || { pickup: "Current Location", dropoff: "Destination", type: "cab", fare: 250 };

    const driver = {
        name: "Ramesh Kumar",
        rating: 4.9,
        vehicle: "White Swift Dzire (DL 1SC 1234)",
        photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-geo-dark">Ride Booked Successfully!</h1>
                    <p className="text-gray-500 mt-2">Driver is arriving in 4 minutes</p>
                </div>

                {/* Reward Section */}
                <div className="bg-gradient-to-r from-geo-red to-red-600 rounded-3xl p-6 text-white shadow-xl mb-8 overflow-hidden relative">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20">
                        <Gift className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-2">
                            <Gift className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-wider text-sm">Reward Unlocked</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">Congratulations!</h2>
                        <p className="text-red-100 text-sm">You earned <span className="font-bold text-white">50 Reward Points</span> and <span className="font-bold text-white">₹25 Cashback</span> for this ride.</p>
                    </div>
                </div>

                {/* Driver Details */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-geo-dark">{driver.name}</h3>
                            <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{driver.rating}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{driver.vehicle}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-geo-red shadow-sm hover:scale-110 transition cursor-pointer">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-geo-red shadow-sm hover:scale-110 transition cursor-pointer">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-500 w-16">Pickup</span>
                            <span className="font-bold text-geo-dark">{bookingData.pickup}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-geo-red rounded-full"></div>
                            <span className="text-gray-500 w-16">Drop</span>
                            <span className="font-bold text-geo-dark">{bookingData.dropoff}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition cursor-pointer">
                        <Share2 className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-gray-700">Share Trip</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-red-100 rounded-2xl shadow-sm hover:bg-red-50 transition text-geo-red cursor-pointer">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold">SOS Emergency</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-3">
                    <Link to="/history" className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <HistoryIcon className="w-6 h-6 text-gray-400" />
                            <span className="font-bold text-geo-dark">Trip History</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-geo-red transition" />
                    </Link>
                    <Link to="/" className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <Home className="w-6 h-6 text-gray-400" />
                            <span className="font-bold text-geo-dark">Back to Home</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-geo-red transition" />
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
