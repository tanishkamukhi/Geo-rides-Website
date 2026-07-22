import { useLocation, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Calendar,
    Users,
    CreditCard,
    Phone,
    FileText,
    History as HistoryIcon,
    Home,
    ChevronRight,
    MapPin,
    Building
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StayBookingSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    // Safe retrieval of state data
    const bookingData = {
        hotelName: "Fairmont Royal York",
        hotelAddress: "100 Front St W, Toronto, ON M5J 1E3",
        roomType: "Deluxe Room",
        guestName: "Guest User",
        bookingId: "GRS" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        guestsCount: 2,
        fare: "CA$399.00",
        paymentStatus: "paid",
        status: "Confirmed",
        phone: "+1 (416) 368-2511",
        ...(location.state || {}),
    };

    const handleDownloadInvoice = () => {
        alert("Your hotel booking invoice is being generated. Download will start automatically.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 pt-28 pb-16 px-4 max-w-3xl mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-geo-dark tracking-tight">Stay Booked Successfully!</h1>
                    <p className="text-gray-500 mt-2">Your reservation has been confirmed by the hotel.</p>
                </div>

                {/* Booking Reference Hero Badge */}
                <div className="bg-gradient-to-r from-geo-red to-red-600 rounded-3xl p-6 text-white shadow-xl mb-8 overflow-hidden relative">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20">
                        <Building className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <span className="font-bold uppercase tracking-wider text-xs text-red-100">Booking Reference</span>
                            <h2 className="text-2xl font-black">{bookingData.bookingId}</h2>
                        </div>
                        <div className="text-right">
                            <span className="font-bold uppercase tracking-wider text-xs text-red-100">Status</span>
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold inline-block border border-white/10 uppercase">
                                {bookingData.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotel Details Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Building className="w-8 h-8 text-geo-red" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-xl text-geo-dark">{bookingData.hotelName}</h3>
                            <div className="flex items-center space-x-1.5 text-gray-500 text-sm mt-1">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span>{bookingData.hotelAddress}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm mb-4">
                        <div className="flex items-center space-x-3">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Room Type</span>
                            <span className="font-bold text-geo-dark">{bookingData.roomType}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Guest Name</span>
                            <span className="font-bold text-geo-dark">{bookingData.guestName}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Check-In</span>
                            <span className="font-bold text-geo-dark">{bookingData.checkIn}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Check-Out</span>
                            <span className="font-bold text-geo-dark">{bookingData.checkOut}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Guests</span>
                            <span className="font-bold text-geo-dark">{bookingData.guestsCount}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 w-24">Payment Status</span>
                            <span className="font-bold text-emerald-600 uppercase text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                {bookingData.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Total Paid</span>
                        <span className="font-black text-2xl text-geo-red">{bookingData.fare}</span>
                    </div>
                </div>

                {/* Stay Success Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <a
                        href={`tel:${bookingData.phone.replace(/\s/g, "")}`}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition cursor-pointer text-gray-700 font-bold text-center"
                    >
                        <Phone className="w-5 h-5 text-geo-red" />
                        <span>Contact Hotel</span>
                    </a>
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition text-gray-700 font-bold cursor-pointer"
                    >
                        <FileText className="w-5 h-5 text-geo-red" />
                        <span>Invoice</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-3">
                    <Link to="/history" className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition group cursor-pointer shadow-sm">
                        <div className="flex items-center space-x-4">
                            <HistoryIcon className="w-6 h-6 text-gray-400 group-hover:text-geo-red transition" />
                            <span className="font-bold text-geo-dark">View Booking History</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-geo-red transition" />
                    </Link>
                    <Link to="/" className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition group cursor-pointer shadow-sm">
                        <div className="flex items-center space-x-4">
                            <Home className="w-6 h-6 text-gray-400 group-hover:text-geo-red transition" />
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
