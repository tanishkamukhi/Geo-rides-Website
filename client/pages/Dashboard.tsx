import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Car, Package, Hotel, Clock, Wallet, MapPin, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser(data);
        } else {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      })
      .catch(err => console.error("Dashboard load failed", err));
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center font-bold bg-gray-50 text-gray-900">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Welcome Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-geo-red rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-red-500/30">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.fullName.split(' ')[0]}!</h1>
              <p className="text-gray-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-geo-red" />
                Ready for your next journey?
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 bg-gray-50 p-4 rounded-2xl flex items-center space-x-4 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Wallet className="w-6 h-6 text-geo-red" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Geopay Balance</p>
              <p className="text-xl font-bold text-gray-900">₹1,250.00</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4 text-gray-900 px-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Book a Ride", icon: Car, color: "text-blue-500", bg: "bg-blue-50", link: "/service/cab" },
            { title: "Parcel Delivery", icon: Package, color: "text-green-500", bg: "bg-green-50", link: "/service/parcel" },
            { title: "Stay Booking", icon: Hotel, color: "text-purple-500", bg: "bg-purple-50", link: "/service/travel" }
          ].map((action, idx) => (
            <Link key={idx} to={action.link}>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:border-geo-red transition-colors group">
                <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center`}>
                  <action.icon className={`w-7 h-7 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-geo-red transition-colors">{action.title}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-geo-red transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Status Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Bookings */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-geo-red" />
                Active Bookings
              </h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 blur-3xl opacity-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="flex justify-between items-start relative z-10 mb-4">
                 <div>
                   <span className="inline-block px-3 py-1 bg-white text-orange-600 font-bold text-xs rounded-full uppercase tracking-wider shadow-sm mb-2">Finding Driver...</span>
                   <p className="font-bold text-gray-900">Standard Cab</p>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-gray-900">₹320</p>
                   <p className="text-sm text-gray-500">Est. 4 mins</p>
                 </div>
               </div>
               <div className="space-y-3 relative z-10">
                 <div className="flex items-center space-x-3 text-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <p className="text-gray-700">Central Station (Pickup)</p>
                 </div>
                 <div className="flex items-center space-x-3 text-sm">
                   <div className="w-2 h-2 rounded-full bg-geo-red"></div>
                   <p className="text-gray-700">Tech Park, Sector 4 (Drop)</p>
                 </div>
               </div>
            </div>
          </section>

          {/* Recent Rides */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Recent Rides
              </h2>
              <Link to="/history" className="text-sm font-bold text-geo-red hover:text-red-600 transition-colors">View All</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { date: "Oct 12, 09:30 AM", type: "Standard Cab", status: "Completed", amount: "₹450" },
                { date: "Oct 10, 06:15 PM", type: "Premium SUV", status: "Completed", amount: "₹850" }
              ].map((ride, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{ride.type}</p>
                      <p className="text-sm text-gray-500">{ride.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{ride.amount}</p>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{ride.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
