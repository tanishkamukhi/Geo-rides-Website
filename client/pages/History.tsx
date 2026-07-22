import { useState, useEffect } from "react";
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
    Package,
    Hotel,
    History as HistoryIcon,
    Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Booking {
    id: number;
    bookingId: string;
    bookingType?: string;
    pickupLocation?: string;
    dropLocation?: string;
    pickup?: string;
    drop?: string;
    hotelName?: string;
    roomType?: string;
    vehicleType?: string;
    estimatedFare?: string;
    fare?: string;
    status?: string;
    paymentStatus?: string;
    createdAt?: string;
    checkIn?: string;
    checkOut?: string;
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString("en-CA", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    } catch { return iso; }
}

function BookingIcon({ type }: { type?: string }) {
    if (type === "hotel") return <Hotel className="w-6 h-6 text-geo-red" />;
    if (type === "parcel") return <Package className="w-6 h-6 text-geo-red" />;
    if (type === "bike") return <Bike className="w-6 h-6 text-geo-red" />;
    return <Car className="w-6 h-6 text-geo-red" />;
}

function tripLabel(b: Booking): string {
    if (b.bookingType === "hotel") return "Hotel Stay";
    if (b.bookingType === "parcel") return "Parcel Courier";
    return `${b.vehicleType || "Cab"} Ride`;
}

function fareDisplay(b: Booking): string {
    return b.fare || b.estimatedFare || "—";
}

export default function TripHistory() {
    const { t } = useTranslation();
    const [trips, setTrips] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) { setLoading(false); setError("Please log in to view your trip history."); return; }

        fetch(`/api/my-bookings?userId=${userId}`)
            .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
            .then(data => { setTrips(Array.isArray(data) ? data : []); })
            .catch(e => { console.error(e); setError("Could not load trip history. Please try again."); })
            .finally(() => setLoading(false));
    }, []);

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

                {loading && (
                    <div className="flex flex-col items-center py-24">
                        <Loader2 className="w-12 h-12 text-geo-red animate-spin mb-4" />
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Loading your trips...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <HistoryIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500">{error}</p>
                        <Link to="/login" className="inline-block mt-6 px-8 py-3 bg-geo-red text-white font-bold rounded-xl">Login</Link>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        {trips.map((trip) => (
                            <div key={trip.bookingId || trip.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                            <BookingIcon type={trip.bookingType} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-geo-dark uppercase tracking-tight">{tripLabel(trip)}</h3>
                                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(trip.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-geo-dark">{fareDisplay(trip)}</p>
                                        <span className={`text-[10px] font-bold py-1 px-2 rounded-full uppercase ${
                                            (trip.status || "").toLowerCase() === "completed"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-amber-100 text-amber-600"
                                        }`}>{trip.status || "pending"}</span>
                                    </div>
                                </div>

                                {trip.bookingType === "hotel" ? (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Hotel className="w-4 h-4 text-geo-red flex-shrink-0" />
                                            <span className="text-gray-600 font-medium">{trip.hotelName || trip.pickupLocation}</span>
                                        </div>
                                        {(trip.checkIn || trip.checkOut) && (
                                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span>{trip.checkIn} → {trip.checkOut}</span>
                                            </div>
                                        )}
                                        {trip.roomType && (
                                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                                                <CreditCard className="w-4 h-4 flex-shrink-0" />
                                                <span>{trip.roomType}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3 relative mb-4">
                                        <div className="absolute left-1.5 top-2 bottom-6 w-0.5 bg-gray-100"></div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                            <span className="text-gray-600 flex-1 truncate">{trip.pickup || trip.pickupLocation || "—"}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="w-3 h-3 rounded-full bg-geo-red z-10"></div>
                                            <span className="text-gray-600 flex-1 truncate">{trip.drop || trip.dropLocation || "—"}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>ID: {trip.bookingId || trip.id}</span>
                                    <span className="text-geo-red group-hover:underline">View Details</span>
                                </div>
                            </div>
                        ))}

                        {trips.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <HistoryIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500">No trips found. Start your first journey today!</p>
                                <Link to="/" className="inline-block mt-6 px-8 py-3 bg-geo-red text-white font-bold rounded-xl">Book Now</Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
