import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    MapPin, MapPinCheck, Search, ChevronRight, Shield, Phone, Clock, CreditCard, AlertCircle,
    Star, Hotel, Calendar, Mail, ExternalLink, ArrowRight, Package, Car, Wifi, Coffee, Waves
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RideBooking from "./RideBooking";

// ── HOTEL DATA ────────────────────────────────────────────────────────────────
const hotelData = [
    {
        id: 1,
        name: "Fairmont Royal York",
        city: "Toronto",
        stars: 5,
        pricePerNight: 399,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=350&fit=crop",
        address: "100 Front St W, Toronto, ON M5J 1E3",
        phone: "+1 (416) 368-2511",
        email: "royalyork@fairmont.com",
        lat: 43.6459,
        lng: -79.3810,
        amenities: ["Free WiFi", "Pool", "Breakfast", "Spa"],
        roomTypes: [
            { type: "Deluxe Room", price: 399, available: true },
            { type: "Premier Room", price: 549, available: true },
            { type: "Suite", price: 999, available: false },
        ],
    },
    {
        id: 2,
        name: "Fairmont Hotel Vancouver",
        city: "Vancouver",
        stars: 5,
        pricePerNight: 349,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=350&fit=crop",
        address: "900 W Georgia St, Vancouver, BC V6C 2W6",
        phone: "+1 (604) 684-3131",
        email: "vancouver@fairmont.com",
        lat: 49.2837,
        lng: -123.1211,
        amenities: ["Free WiFi", "Pool", "Breakfast", "Concierge"],
        roomTypes: [
            { type: "Deluxe Room", price: 349, available: true },
            { type: "Club Room", price: 499, available: true },
            { type: "Heritage Suite", price: 899, available: false },
        ],
    },
    {
        id: 3,
        name: "Ritz-Carlton Montreal",
        city: "Montreal",
        stars: 5,
        pricePerNight: 449,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=350&fit=crop",
        address: "1228 Sherbrooke St W, Montreal, QC H3G 1H6",
        phone: "+1 (514) 842-4212",
        email: "montreal@ritzcarlton.com",
        lat: 45.5022,
        lng: -73.5779,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
        roomTypes: [
            { type: "Superior Room", price: 449, available: true },
            { type: "Executive Club", price: 599, available: true },
            { type: "Grand Suite", price: 1199, available: true },
        ],
    },
    {
        id: 4,
        name: "Hotel Arts Calgary",
        city: "Calgary",
        stars: 4,
        pricePerNight: 249,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=350&fit=crop",
        address: "119 12 Ave SW, Calgary, AB T2R 0G8",
        phone: "+1 (403) 266-4611",
        email: "info@hotelarts.ca",
        lat: 51.0421,
        lng: -114.0686,
        amenities: ["Free WiFi", "Breakfast", "Spa", "Gym"],
        roomTypes: [
            { type: "Deluxe Room", price: 249, available: true },
            { type: "Studio Suite", price: 349, available: false },
            { type: "Penthouse", price: 699, available: true },
        ],
    },
    {
        id: 5,
        name: "Andaz Ottawa ByWard Market",
        city: "Ottawa",
        stars: 4,
        pricePerNight: 279,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=350&fit=crop",
        address: "325 Dalhousie St, Ottawa, ON K1N 7G1",
        phone: "+1 (613) 321-1234",
        email: "ottawa@andaz.com",
        lat: 45.4290,
        lng: -75.6881,
        amenities: ["Free WiFi", "Pool", "Breakfast", "Parking"],
        roomTypes: [
            { type: "King Room", price: 279, available: true },
            { type: "Double Queen", price: 329, available: true },
            { type: "Andaz Suite", price: 549, available: true },
        ],
    },
    {
        id: 6,
        name: "Marriott Edmonton",
        city: "Edmonton",
        stars: 4,
        pricePerNight: 219,
        image: "https://images.unsplash.com/photo-1551882547-ff40c4a49f50?w=600&h=350&fit=crop",
        address: "10220 102 Ave NW, Edmonton, AB T5J 4C5",
        phone: "+1 (780) 423-9999",
        email: "edmonton@marriott.com",
        lat: 53.5461,
        lng: -113.4938,
        amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
        roomTypes: [
            { type: "Superior Room", price: 219, available: true },
            { type: "Executive Room", price: 289, available: false },
            { type: "Suite", price: 449, available: true },
        ],
    },
];

// ── AVAILABILITY LOGIC ────────────────────────────────────────────────────────
function getAvailability(hotelId: number, roomType: string, checkIn: string, checkOut: string): boolean {
    if (!checkIn || !checkOut) return true;
    const seed = hotelId + roomType.length + new Date(checkIn).getDate();
    return seed % 3 !== 0;
}

// ── AMENITY ICONS ─────────────────────────────────────────────────────────────
const AmenityIcon = ({ name }: { name: string }) => {
    if (name.includes("WiFi")) return <Wifi className="w-3.5 h-3.5" />;
    if (name.includes("Pool")) return <Waves className="w-3.5 h-3.5" />;
    if (name.includes("Breakfast")) return <Coffee className="w-3.5 h-3.5" />;
    return <Star className="w-3.5 h-3.5" />;
};

// ── TRAVEL & STAY PAGE ────────────────────────────────────────────────────────
function TravelAndStay() {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [selectedCity, setSelectedCity] = useState("All");
    const [selectedHotel, setSelectedHotel] = useState<typeof hotelData[0] | null>(null);
    const isLoggedIn = !!localStorage.getItem("authToken");

    const cities = ["All", ...Array.from(new Set(hotelData.map(h => h.city)))];
    const filtered = selectedCity === "All" ? hotelData : hotelData.filter(h => h.city === selectedCity);

    const handleBookHotel = async (hotel: typeof hotelData[0], roomType: string, price: number) => {
        if (!isLoggedIn) { navigate("/login"); return; }
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) { navigate("/login"); return; }

        try {
            const guestName = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "Guest User";
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: Number(userId),
                    bookingType: "hotel",
                    hotelName: hotel.name,
                    hotelAddress: hotel.address,
                    roomType,
                    fare: `CA$${price}`,
                    currency: "CAD",
                    checkIn: checkIn || new Date().toISOString().split("T")[0],
                    checkOut: checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    guestsCount: 1,
                    guestName: guestName,
                    status: "Confirmed",
                    paymentStatus: "paid",
                    phone: hotel.phone
                })
            });

            if (response.ok) {
                const data = await response.json();
                navigate("/stay-booking-success", {
                    state: {
                        bookingId: data.booking?.bookingId,
                        hotelName: hotel.name,
                        hotelAddress: hotel.address,
                        roomType,
                        checkIn: checkIn || new Date().toISOString().split("T")[0],
                        checkOut: checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                        guestsCount: 1,
                        guestName: guestName,
                        fare: `CA$${price}`,
                        status: "Confirmed",
                        paymentStatus: "paid",
                        phone: hotel.phone
                    }
                });
            } else {
                throw new Error("Hotel booking failed");
            }
        } catch (e) {
            console.error(e);
            alert("Booking failed. Please try again.");
        }
    };

    const handleCallHotel = (hotel: typeof hotelData[0]) => {
        if (!isLoggedIn) { navigate("/login"); return; }
        window.location.href = `tel:${hotel.phone.replace(/\s/g, "")}`;
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

                {/* Hero Banner */}
                <div className="relative rounded-[40px] overflow-hidden mb-12 h-64 flex items-center"
                    style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)" }}>
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&fit=crop')", backgroundSize: "cover" }} />
                    <div className="relative z-10 px-12 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <Hotel className="w-8 h-8 text-yellow-400" />
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Travel & Stay</h1>
                        </div>
                        <p className="text-white/70 text-lg max-w-xl">
                            Book premium hotels across Canada with real pricing, availability, and direct contact — all in one place.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-10 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[160px]">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Check-in</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input type="date" min={today} value={checkIn}
                                onChange={e => setCheckIn(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-geo-red outline-none" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Check-out</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input type="date" min={checkIn || today} value={checkOut}
                                onChange={e => setCheckOut(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-geo-red outline-none" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">City</label>
                        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-geo-red outline-none cursor-pointer">
                            {cities.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => { }}
                        className="bg-geo-red text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" /> Search
                    </button>
                </div>

                {!isLoggedIn && (
                    <div className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-2xl">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold text-sm">Login to book rooms and call hotels directly.</span>
                        <button onClick={() => navigate("/login")}
                            className="ml-auto bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-amber-700 transition">
                            Login →
                        </button>
                    </div>
                )}

                {/* Hotel Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filtered.map(hotel => (
                        <div key={hotel.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden">
                                <img src={hotel.image} alt={hotel.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                                    {hotel.city}
                                </div>
                                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                                    {"★".repeat(hotel.stars)} {hotel.stars}-Star
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-black text-gray-900">{hotel.name}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-geo-red">CA${hotel.pricePerNight.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">per night</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{hotel.address}</span>
                                </div>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hotel.amenities.map(a => (
                                        <span key={a} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            <AmenityIcon name={a} /> {a}
                                        </span>
                                    ))}
                                </div>

                                {/* Contact */}
                                <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex flex-col gap-2">
                                    <a href={`tel:${hotel.phone}`}
                                        onClick={e => { if (!isLoggedIn) { e.preventDefault(); navigate("/login"); } }}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-geo-red transition font-medium">
                                        <Phone className="w-4 h-4 text-geo-red flex-shrink-0" />
                                        {hotel.phone}
                                    </a>
                                    <a href={`mailto:${hotel.email}`}
                                        onClick={e => { if (!isLoggedIn) { e.preventDefault(); navigate("/login"); } }}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-geo-red transition font-medium">
                                        <Mail className="w-4 h-4 text-geo-red flex-shrink-0" />
                                        <span className="truncate">{hotel.email}</span>
                                    </a>
                                </div>

                                {/* Room Types */}
                                <div className="space-y-2 mb-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rooms & Availability</p>
                                    {hotel.roomTypes.map(room => {
                                        const avail = getAvailability(hotel.id, room.type, checkIn, checkOut);
                                        return (
                                            <div key={room.type}
                                                className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                                                <div>
                                                    <span className="font-semibold text-sm text-gray-800">{room.type}</span>
                                                    <span className="text-xs text-gray-500 ml-2">CA${room.price.toLocaleString()}/night</span>
                                                </div>
                                                {(checkIn && checkOut) ? (
                                                    avail ? (
                                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Available</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Sold Out</span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Select dates</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Map */}
                                <div className="rounded-2xl overflow-hidden h-40 mb-5 border border-gray-100">
                                    <iframe
                                        width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.lng - 0.01},${hotel.lat - 0.01},${hotel.lng + 0.01},${hotel.lat + 0.01}&layer=mapnik&marker=${hotel.lat},${hotel.lng}`}
                                        allowFullScreen
                                        title={`Map of ${hotel.name}`}
                                    />
                                </div>

                                {/* CTA Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleCallHotel(hotel)}
                                        className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-gray-700 active:scale-95 transition-all text-sm"
                                    >
                                        <Phone className="w-4 h-4" /> Call Hotel
                                    </button>
                                    <button
                                        onClick={() => handleBookHotel(hotel, hotel.roomTypes[0].type, hotel.roomTypes[0].price)}
                                        className="flex items-center justify-center gap-2 bg-geo-red text-white py-3 rounded-2xl font-bold hover:bg-red-600 active:scale-95 transition-all text-sm"
                                    >
                                        Book Room <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Google Maps External Link */}
                                <a
                                    href={`https://www.google.com/maps?q=${hotel.lat},${hotel.lng}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-geo-red transition"
                                >
                                    <ExternalLink className="w-3 h-3" /> View on Google Maps
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

// ── PARCEL SERVICE PAGE ───────────────────────────────────────────────────────
function ParcelService() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("authToken");
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ pickup: "", dropoff: "", weight: "0-5kg", urgent: false });
    const [isBooking, setIsBooking] = useState(false);

    const weightOptions = [
        { label: "0–5 kg", value: "0-5kg", price: 80 },
        { label: "5–15 kg", value: "5-15kg", price: 150 },
        { label: "15–30 kg", value: "15-30kg", price: 260 },
        { label: "30+ kg", value: "30+kg", price: 400 },
    ];
    const selected = weightOptions.find(w => w.value === form.weight)!;
    const totalPrice = selected.price + (form.urgent ? 100 : 0);

    const handleBook = async () => {
        if (!isLoggedIn) { navigate("/login"); return; }
        if (!form.pickup || !form.dropoff) return;
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) { navigate("/login"); return; }

        setIsBooking(true);
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: Number(userId),
                    bookingType: "parcel",
                    pickup: form.pickup,
                    drop: form.dropoff,
                    pickupLocation: form.pickup,
                    dropLocation: form.dropoff,
                    vehicleType: "parcel",
                    estimatedFare: `CA$${totalPrice}`,
                    fare: `CA$${totalPrice}`,
                    currency: "CAD",
                    status: "Completed",
                    paymentStatus: "paid"
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsBooking(false);
                navigate("/booking-success", {
                    state: {
                        bookingId: data.booking?.bookingId,
                        pickup: form.pickup,
                        dropoff: form.dropoff,
                        type: "Parcel Courier",
                        fare: `CA$${totalPrice}`
                    }
                });
            } else {
                throw new Error("Parcel booking failed");
            }
        } catch (e) {
            console.error(e);
            setIsBooking(false);
            alert("Parcel booking failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
                {/* Hero */}
                <div className="relative rounded-[40px] overflow-hidden mb-10 h-52 flex items-center"
                    style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
                    <div className="relative z-10 px-12 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-8 h-8 text-yellow-400" />
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Parcel Service</h1>
                        </div>
                        <p className="text-white/70">Fast, secure & insured parcel delivery across the city</p>
                    </div>
                </div>

                {!isLoggedIn && (
                    <div className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-2xl">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold text-sm">Login to book a parcel delivery.</span>
                        <button onClick={() => navigate("/login")}
                            className="ml-auto bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-amber-700 transition">
                            Login →
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-black text-gray-900 mb-6">Book a Parcel</h2>
                    <div className="space-y-5">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-geo-red" />
                            <input type="text" placeholder="Pickup address"
                                value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-geo-red outline-none" />
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Delivery address"
                                value={form.dropoff} onChange={e => setForm({ ...form, dropoff: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-geo-red outline-none" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Parcel Weight</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {weightOptions.map(opt => (
                                    <button key={opt.value}
                                        onClick={() => setForm({ ...form, weight: opt.value })}
                                        className={`p-3 rounded-2xl border text-center transition-all ${form.weight === opt.value
                                            ? "border-geo-red bg-geo-red/5 ring-1 ring-geo-red"
                                            : "border-gray-200 hover:border-gray-300"}`}>
                                        <div className="font-bold text-sm text-gray-900">{opt.label}</div>
                                        <div className="text-xs text-gray-500">CA${opt.price}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                            <div>
                                <p className="font-bold text-sm text-gray-900">⚡ Urgent Delivery</p>
                                <p className="text-xs text-gray-500">Deliver within 2 hours (+CA$10)</p>
                            </div>
                            <button onClick={() => setForm({ ...form, urgent: !form.urgent })}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${form.urgent ? "bg-geo-red" : "bg-gray-300"}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${form.urgent ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                        </div>

                        {form.pickup && form.dropoff && (
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Estimated Total</p>
                                    <p className="text-3xl font-black text-gray-900">CA${totalPrice}</p>
                                    <p className="text-xs text-gray-400">{selected.label} weight{form.urgent ? " + urgent fee" : ""}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-600 font-bold text-sm">{form.urgent ? "⚡ 2 hrs" : "🕐 4–6 hrs"}</p>
                                    <p className="text-xs text-gray-400">Est. delivery</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleBook}
                            disabled={isBooking || !form.pickup || !form.dropoff}
                            className="w-full bg-geo-red text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-600 active:scale-[0.99] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isBooking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Booking Parcel…
                                </>
                            ) : (
                                <>
                                    <Package className="w-5 h-5" /> Book Parcel Delivery
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    {[
                        { icon: Shield, label: "Insured Delivery", desc: "Up to CA$500 item insurance included" },
                        { icon: Clock, label: "Real-Time Tracking", desc: "Track your parcel every step of the way" },
                        { icon: MapPinCheck, label: "Doorstep Pickup", desc: "We come to you — no drop-off needed" },
                    ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="bg-white rounded-[24px] border border-gray-100 p-6">
                            <Icon className="w-8 h-8 text-geo-red mb-3" />
                            <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
                            <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

// ── ORIGINAL CAB BOOKING ──────────────────────────────────────────────────────
interface CabBookingProps {
    type: string;
}

function CabBooking({ type }: CabBookingProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [locations, setLocations] = useState({ pickup: "", dropoff: "" });
    const [selectedTier, setSelectedTier] = useState<"economy" | "luxury">("economy");
    const [isPriorityBooking, setIsPriorityBooking] = useState(false);
    const [fareEstimate, setFareEstimate] = useState<number | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    const serviceInfo = {
        bike: { label: t("services.bikeTaxi"), icon: "🏍️", baseFare: 10 },
        auto: { label: t("services.autoRide"), icon: "🛺", baseFare: 15 },
        cab: { label: t("services.cabBooking"), icon: "🚗", baseFare: 25 },
    }[type as "bike" | "auto" | "cab"] || { label: "Ride", icon: "🚗", baseFare: 20 };

    useEffect(() => {
        if (locations.pickup && locations.dropoff) {
            const multiplier = selectedTier === "luxury" ? 2.5 : 1.0;
            const priorityFee = isPriorityBooking ? 10 : 0;
            setFareEstimate(Math.floor(serviceInfo.baseFare * multiplier + Math.random() * 20 + priorityFee));
        }
    }, [locations, serviceInfo.baseFare, selectedTier, isPriorityBooking]);

    const handleBooking = () => {
        const token = localStorage.getItem("authToken");
        if (!token) { navigate("/login"); return; }
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            navigate("/booking-success", {
                state: { pickup: locations.pickup, dropoff: locations.dropoff, type, fare: fareEstimate }
            });
        }, 3000);
    };

    const recentDestinations = [
        "Union Station, Toronto", "CN Tower, Front St W",
        "Toronto Pearson Airport (YYZ)", "Eaton Centre, Yonge St"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="text-3xl">{serviceInfo.icon}</div>
                                <h1 className="text-2xl font-bold text-geo-dark">{serviceInfo.label}</h1>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-geo-red" />
                                    <input type="text" placeholder="Enter pickup location"
                                        value={locations.pickup}
                                        onChange={e => setLocations({ ...locations, pickup: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black placeholder:text-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-geo-red focus:outline-none transition"
                                    />
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input type="text" placeholder="Where to?"
                                        value={locations.dropoff}
                                        onChange={e => setLocations({ ...locations, dropoff: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 text-black placeholder:text-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-geo-red focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Ride Tier</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setSelectedTier("economy")}
                                        className={`p-4 rounded-2xl border text-left transition-all duration-200 ${selectedTier === "economy" ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                                        <div className="font-bold text-gray-900">Standard Class</div>
                                        <div className="text-[10px] text-gray-500 mt-1 leading-tight">Regular ride-sharing comfort</div>
                                    </button>
                                    <button onClick={() => setSelectedTier("luxury")}
                                        className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group shadow-sm ${selectedTier === "luxury" ? "border-yellow-500 bg-yellow-500/5 ring-1 ring-yellow-500" : "border-gray-200 hover:border-gray-300"}`}>
                                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl">VVIP</div>
                                        <div className="font-bold text-gray-900 group-hover:text-yellow-600 transition duration-150">Luxury Private</div>
                                        <div className="text-[10px] text-gray-500 mt-1 leading-tight">Elite Tesla & VIP experience</div>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-between shadow-sm">
                                <div>
                                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">⚡ Priority Pickup</h4>
                                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5 max-w-[200px]">Skip queue, match instantly (Surcharge: CA$5)</p>
                                </div>
                                <button onClick={() => setIsPriorityBooking(!isPriorityBooking)}
                                    title="Toggle priority pickup"
                                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none ${isPriorityBooking ? "bg-primary" : "bg-gray-300"}`}
                                    role="switch" aria-checked={isPriorityBooking ? "true" : "false"}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isPriorityBooking ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Destinations</h3>
                                <div className="space-y-2">
                                    {recentDestinations.map((dest, i) => (
                                        <button key={i} onClick={() => setLocations({ ...locations, dropoff: dest })}
                                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition text-left group">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 flex-1 truncate text-sm">{dest}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {fareEstimate && (
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold">ESTIMATED FARE</p>
                                                <p className="text-xl font-bold text-gray-900">CA${fareEstimate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xs font-bold leading-none ${isPriorityBooking ? "text-primary animate-pulse" : "text-green-600"}`}>
                                                {isPriorityBooking ? "⚡ 2 MINS AWAY" : "5 MINS AWAY"}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={handleBooking}
                                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl hover:brightness-95 active:scale-[0.99] transition-all shadow-lg text-lg flex items-center justify-center space-x-2">
                                        <span>Book {selectedTier === "luxury" ? "VIP Luxury" : "Standard"} Ride</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
                            <h3 className="font-bold text-primary flex items-center space-x-2 mb-4">
                                <Shield className="w-5 h-5" />
                                <span>Geo Safety Protocol</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-2xl text-center shadow-sm">
                                    <Phone className="w-6 h-6 text-primary mx-auto mb-1" />
                                    <p className="text-[10px] font-bold uppercase text-gray-700">SOS Button</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl text-center shadow-sm">
                                    <MapPinCheck className="w-6 h-6 text-primary mx-auto mb-1" />
                                    <p className="text-[10px] font-bold uppercase text-gray-700">Live Track</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-[400px] lg:h-auto min-h-[500px] relative">
                        <div className="w-full h-full bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner">
                            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.10,28.50,77.30,28.70&layer=mapnik"
                                allowFullScreen title="Map view of ride location" />

                            {isBooking && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                                    <div className="text-center">
                                        <div className={`w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${selectedTier === "luxury" ? "border-yellow-500" : "border-primary"}`} />
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {selectedTier === "luxury" ? "Pairing with Premium Tesla Driver…" : `Requesting ${serviceInfo.label}…`}
                                        </h3>
                                        <p className="text-gray-500 mt-2 text-sm">
                                            {isPriorityBooking ? "⚡ Priority routing active" : "Finding best route and driver"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!locations.pickup && !isBooking && (
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-xs">
                                        <AlertCircle className="w-12 h-12 text-geo-red mx-auto mb-4" />
                                        <h4 className="font-bold text-geo-dark mb-2">Set Your Pickup</h4>
                                        <p className="text-sm text-gray-500">Enter pickup and drop location to view the map route.</p>
                                    </div>
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

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function ServiceDetails() {
    const { type } = useParams<{ type: string }>();
    if (type === "travel") return <TravelAndStay />;
    if (type === "parcel") return <ParcelService />;
   return <RideBooking />;
}
