import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errorsfullName = "Name is required";
    if (!formData.email.includes("@")) errorsemail = "Valid email required";
    if (!formData.phone || formData.phone.length < 10)
      errorsphone = "Valid phone required";
    if (formData.password.length < 6)
      errorspassword = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errorsconfirmPassword = "Passwords don't match";

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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.userId);
        }
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden">
        <Header />

        {/* Dynamic Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop")' }}
        />

        <div className="flex-1 flex items-center justify-center px-4 pt-24 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Account Created!
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Welcome aboard. Redirecting you to the homepage...
            </p>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="bg-gradient-to-r from-geo-red to-orange-500 h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900">
      <Header />

      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-105"
        style={{ backgroundImage: 'url("/bg-register.jpg")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

            {/* Glow effect */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500 blur-[80px] opacity-30 rounded-full"></div>

            <div className="text-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-gradient-to-br from-geo-red to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30"
              >
                <MapPin className="text-white w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {t("register.title", "Create an Account")}
              </h1>
              <p className="text-gray-300 text-sm">
                {t("register.subtitle", "Join Geo Rides for premium travel experiences")}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {t("register.name", "Full Name")}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all ${fielderrorsfullName ? "border-red-500" : "border-white/10"
                      }`}
                  />
                </div>
                {fielderrorsfullName && <p className="text-red-400 text-xs mt-1.5 ml-1">{fielderrorsfullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {t("register.email", "Email Address")}
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all ${fielderrorsemail ? "border-red-500" : "border-white/10"
                        }`}
                    />
                  </div>
                  {fielderrorsemail && <p className="text-red-400 text-xs mt-1.5 ml-1">{fielderrorsemail}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {t("register.phone", "Phone Number")}
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (647) 555-1234"
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all ${fielderrorsphone ? "border-red-500" : "border-white/10"
                        }`}
                    />
                  </div>
                  {fielderrorsphone && <p className="text-red-400 text-xs mt-1.5 ml-1">{fielderrorsphone}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {t("register.password", "Password")}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all ${fielderrorspassword ? "border-red-500" : "border-white/10"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fielderrorspassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{fielderrorspassword}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {t("register.confirmPassword", "Confirm Password")}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all ${fielderrorsconfirmPassword ? "border-red-500" : "border-white/10"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fielderrorsconfirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{fielderrorsconfirmPassword}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-gradient-to-r from-geo-red to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : t("register.signUp", "Sign Up")}
              </motion.button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-8 relative z-10">
              {t("register.alreadyAccount", "Already have an account?")}{" "}
              <Link
                to="/login"
                className="text-geo-red hover:text-red-400 font-bold transition-colors"
              >
                {t("register.signIn", "Sign in here")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}




