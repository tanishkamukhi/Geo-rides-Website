import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Bike, Car, Truck, Clock, Shield, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const { t } = useTranslation();

  const serviceList = [
    {
      id: 'cab',
      title: 'Cab Service',
      desc: 'Comfort for every journey — economy to luxury',
      img: 'https://images.unsplash.com/photo-1488821228519-b21cc028cb0f?w=400&h=250&fit=crop'
    },
    {
      id: 'travel',
      title: 'Travel & Stay',
      desc: 'Hotels, rooms & full travel planning in one app',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'parcel',
      title: 'Parcel Service',
      desc: 'Quick, secure & insured doorstep delivery',
      img: 'https://images.unsplash.com/photo-1453393675326-0066d393e589?w=400&h=250&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 inline-block relative">
            Our Services
            <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-[#FFD700]"></div>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((service) => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="group flex items-center justify-between p-8 bg-[#F8F9FA] rounded-[32px] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold text-black mb-1">{service.title}</h3>
                <p className="text-gray-500 text-sm">{service.desc}</p>
              </div>
              <div className="w-32 h-24 flex-shrink-0">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 p-12 bg-black rounded-[40px] text-white">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Ready to Ride?</h2>
            <p className="text-gray-400">Join the thousands of happy commuters using Geo Rides every day.</p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-white font-bold hover:text-[#FFD700] transition">Log in</button>
            <Link to="/register" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Sign up
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
