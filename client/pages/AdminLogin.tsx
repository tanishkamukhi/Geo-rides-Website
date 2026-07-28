import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" }),
      });

      const data = await res.json();

      if (res.ok && data.role === "admin") {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.userId);

        toast.success("Welcome back, Admin!");
        console.log("Token:", localStorage.getItem("authToken"));
        console.log("Role:", localStorage.getItem("userRole"));
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950 text-white font-sans p-4">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555529902-5261145633bf?q=80&w=2070&auto=format&fit=crop")' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
            <ShieldCheck className="w-8 h-8 text-geo-red" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Sign in to access the GeoRides Admin Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-geo-red/20 border border-geo-red/50 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition text-white"
              placeholder="admin@georides.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition text-white pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-geo-red hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition mt-6"
          >
            {isLoading ? "Authenticating..." : "Sign In to Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
