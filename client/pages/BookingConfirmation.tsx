import { useLocation, Link } from "react-router-dom";
import { CheckCircle, MapPin, Clock, DollarSign, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingData = location.state || {
    bookingId: "GEO" + Math.random().toString(9).slice(2, 11).toUpperCase(),
    pickupLocation: "Current Location",
    dropLocation: "Destination",
    vehicleType: "Cab",
    estimatedFare: "₹250",
    estimatedTime: "5 mins",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    vehicleNumber: "DL-01-AB-1234",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
            <h1 className="text-4xl font-bold text-geo-dark mb-2">
              Your Ride is Booked!
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Your driver is on the way
            </p>
            <div className="inline-block bg-geo-red bg-opacity-10 px-6 py-2 rounded-full">
              <p className="text-geo-red font-bold text-lg">
                Booking ID: {bookingData.bookingId}
              </p>
            </div>
          </div>

          {/* Ride Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Trip Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-geo-dark mb-6">
                Trip Details
              </h2>

              {/* Pickup */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-geo-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  A
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.pickupLocation}
                  </p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-geo-red rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  B
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drop Location</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.dropLocation}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Vehicle & Fare */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vehicle Type</span>
                  <span className="font-bold text-gray-900">
                    {bookingData.vehicleType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-geo-red" />
                    <span className="text-gray-600">Est. Time</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {bookingData.estimatedTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-geo-red" />
                    <span className="text-gray-600">Est. Fare</span>
                  </div>
                  <span className="font-bold text-xl text-geo-red">
                    {bookingData.estimatedFare}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Driver Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-geo-dark mb-6">
                Driver Details
              </h2>

              {/* Driver Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-geo-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-4xl">
                    {bookingData.driverName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-geo-dark">
                  {bookingData.driverName}
                </h3>
                <div className="flex justify-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-1">4.9 Rating</p>
              </div>

              {/* Vehicle Number */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Vehicle Number</p>
                <p className="text-2xl font-bold text-geo-dark">
                  {bookingData.vehicleNumber}
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-geo-red text-white font-bold rounded-lg hover:bg-red-600 transition">
                  <Phone className="w-5 h-5" />
                  <span>Call Driver</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-geo-red text-geo-red font-bold rounded-lg hover:bg-geo-red hover:text-white transition">
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Tracking Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-geo-red mx-auto mb-4 opacity-60" />
                <p className="text-gray-600 font-semibold">Live Tracking Map</p>
                <p className="text-gray-500 text-sm">
                  Driver location will appear here in real app
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button className="px-6 py-3 border-2 border-geo-red text-geo-red font-bold rounded-lg hover:bg-geo-red hover:text-white transition">
              Share Details
            </button>
            <button className="px-6 py-3 bg-geo-red text-white font-bold rounded-lg hover:bg-red-600 transition">
              Track in Map
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Tip</h3>
            <p className="text-blue-800">
              You can track your driver's location in real-time. Be ready at your pickup location 2 minutes before the driver arrives.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
