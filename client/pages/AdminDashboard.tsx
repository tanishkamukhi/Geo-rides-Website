import { ShieldCheck, Activity, Users, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      toast.error("Please login to access the admin portal");
    }
  }, [token, navigate]);

  return (
    <div className="w-full font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-geo-red" />
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Welcome to the GeoRides control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors">
            <Users className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
            <h2 className="text-4xl font-black text-white">2,451</h2>
            <div className="mt-4 text-xs text-emerald-400 font-bold bg-emerald-500/10 inline-block px-2 py-1 rounded">
              +12% this month
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors">
            <Car className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Rides</p>
            <h2 className="text-4xl font-black text-white">42</h2>
            <div className="mt-4 text-xs text-blue-400 font-bold bg-blue-500/10 inline-block px-2 py-1 rounded">
              8 rides completing soon
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors">
            <Activity className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">System Status</p>
            <h2 className="text-4xl font-black text-emerald-400">Online</h2>
            <div className="mt-4 text-xs text-gray-400 font-bold">
              All services operational
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-4">Recent Activity</h3>
        <div className="text-gray-400 text-sm text-center py-10">
          Activity log will populate here as events occur.
        </div>
      </div>
    </div>
  );
}
