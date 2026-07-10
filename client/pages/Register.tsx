import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, ShieldAlert, Award, FileText, Anchor } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<"user" | "driver">("user");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    driversLicense: "",
    vehicleNumber: "",
    vehicleType: "car",
    sinNumber: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.email.includes("@")) errors.email = "Valid email required";
    if (!formData.phone || formData.phone.length < 10)
      errors.phone = "Valid phone required";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords don't match";

    if (role === "driver") {
      if (!formData.driversLicense.trim()) errors.driversLicense = "Driver's license is required";
      if (!formData.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle plate number is required";
      if (!formData.sinNumber.trim()) {
        errors.sinNumber = "SIN number is required for Canadian Citizen Verification";
      } else if (formData.sinNumber.replace(/\D/g, "").length !== 9) {
        errors.sinNumber = "Canadian SIN must be 9 digits";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const resData = await response.json();

      if (response.ok) {
        // Auto login
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", role);
        }
        setSuccess(true);
        setTimeout(() => {
          if (role === "driver") {
            navigate("/driver-dashboard");
          } else {
            navigate("/");
          }
        }, 3000);
      } else {
        setError(resData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden text-white">
        <Header />
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop")' }} />
        <div className="flex-1 flex items-center justify-center px-4 pt-24 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">Registration Successful!</h2>
            {role === "driver" ? (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-sm flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-left leading-normal">
                    <strong>Verification Pending:</strong> Your driver profile details (Canadian SIN, Driver's License & Vehicle Plate) are currently under verification checks by our staff. You will be redirected to the Driver Dashboard.
                  </p>
                </div>
                <p className="text-gray-300 text-sm">Redirecting to Driver Dashboard...</p>
              </div>
            ) : (
              <p className="text-gray-300 mb-8 text-lg">Welcome aboard. Redirecting to the homepage...</p>
            )}
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mt-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="bg-gradient-to-r from-geo-red to-orange-500 h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900 text-white">
      <Header />
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop")' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl px-2"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-geo-red blur-[100px] opacity-20 rounded-full"></div>

            <div className="text-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-md"
              >
                <img src="/logo.png" alt="Geo Rides" className="w-full h-full object-cover" />
              </motion.div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Create Account</h1>
              <p className="text-gray-400 text-sm">Join the next-generation premium ride network in Canada</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-geo-red/20 border border-geo-red/50 text-red-200 rounded-xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            {/* Profile Selection */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3 text-center">Select Profile Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`p-4 rounded-2xl border text-center transition-all ${role === "user" ? "border-geo-red bg-geo-red/10 ring-1 ring-geo-red" : "border-white/10 hover:border-white/20 bg-white/5"}`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${role === "user" ? "text-geo-red" : "text-gray-400"}`} />
                  <div className="font-bold text-sm">Rider / User</div>
                  <div className="text-[10px] text-gray-500 mt-1">Book premium rides & services</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={`p-4 rounded-2xl border text-center transition-all ${role === "driver" ? "border-geo-red bg-geo-red/10 ring-1 ring-geo-red" : "border-white/10 hover:border-white/20 bg-white/5"}`}
                >
                  <Award className={`w-6 h-6 mx-auto mb-2 ${role === "driver" ? "text-geo-red" : "text-gray-400"}`} />
                  <div className="font-bold text-sm">Driver / Partner</div>
                  <div className="text-[10px] text-gray-500 mt-1">Earn on your own schedule</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                  />
                  {fieldErrors.fullName && <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                  />
                  {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (416) 123-4567"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                />
                {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
              </div>

              {/* Driver Specific Fields */}
              {role === "driver" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl mt-4"
                >
                  <h3 className="font-bold text-sm text-geo-red flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <FileText className="w-4 h-4" /> Driver Credentials (Canada Only)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">Driver's License Number</label>
                      <input
                        type="text"
                        name="driversLicense"
                        value={formData.driversLicense}
                        onChange={handleChange}
                        placeholder="ON-DL-12345-67890"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                      />
                      {fieldErrors.driversLicense && <p className="text-red-400 text-xs mt-1">{fieldErrors.driversLicense}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">Social Insurance Number (SIN)</label>
                      <input
                        type="text"
                        name="sinNumber"
                        value={formData.sinNumber}
                        onChange={handleChange}
                        placeholder="XXX-XXX-XXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                      />
                      {fieldErrors.sinNumber && <p className="text-red-400 text-xs mt-1">{fieldErrors.sinNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">Vehicle Plate Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        placeholder="ABCD 123"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                      />
                      {fieldErrors.vehicleNumber && <p className="text-red-400 text-xs mt-1">{fieldErrors.vehicleNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        title="Driver Vehicle Type"
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                      >
                        <option value="car" className="bg-gray-900">Premium Car </option>
                        <option value="suv" className="bg-gray-900">Luxury SUV</option>
                        <option value="truck" className="bg-gray-900">Cargo Van / Truck</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-geo-red hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition mt-6"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-geo-red hover:text-red-400 font-bold transition">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
