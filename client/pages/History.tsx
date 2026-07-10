import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    CreditCard,
    ChevronRight,
    Bike,
    Car,
    History as HistoryIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TripHistory() {
    const { t } = useTranslation();

    const trips = [
        {
            id: "GEO882KSL",
            date: "24 June 2026, 10:30 AM",
            pickup: "Connaught Place, Delhi",
            drop: "Indira Gandhi International Airport",
            fare: "₹450",
            type: "cab",
            status: "Completed"
        },
        {
            id: "GEO112ABC",
            date: "22 June 2026, 08:15 PM",
            pickup: "Sector 15, Rohini",
            drop: "Pacific Mall, Subhash Nagar",
            fare: "₹120",
            type: "bike",
            status: "Completed"
        },
        {
            id: "GEO990XYZ",
            date: "20 June 2026, 05:45 PM",
            pickup: "Hauz Khas Village",
            drop: "DLF Cyber City",
            fare: "₹280",
            type: "auto",
            status: "Completed"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
                <div className="flex items-center space-x-4 mb-8">
                    <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-geo-red transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-geo-dark">Your Trips</h1>
                </div>

                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        {trip.type === 'bike' ? <Bike className="w-6 h-6 text-geo-red" /> : <Car className="w-6 h-6 text-geo-red" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-geo-dark uppercase tracking-tight">{trip.type} Ride</h3>
                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{trip.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-geo-dark">{trip.fare}</p>
                                    <span className="text-[10px] font-bold py-1 px-2 bg-green-100 text-green-600 rounded-full uppercase">{trip.status}</span>
                                </div>
                            </div>

                            <div className="space-y-3 relative mb-4">
                                <div className="absolute left-1.5 top-2 bottom-6 w-0.5 bg-gray-100"></div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                    <span className="text-gray-600 flex-1 truncate">{trip.pickup}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-geo-red z-10"></div>
                                    <span className="text-gray-600 flex-1 truncate">{trip.drop}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>ID: {trip.id}</span>
                                <span className="text-geo-red group-hover:underline">View Details</span>
                            </div>
                        </div>
                    ))}
                </div>

                {trips.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <HistoryIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500">No trips found. Start your first journey today!</p>
                        <Link to="/" className="inline-block mt-6 px-8 py-3 bg-geo-red text-white font-bold rounded-xl">Book Now</Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
