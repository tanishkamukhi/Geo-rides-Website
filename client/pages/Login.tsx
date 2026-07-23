import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role === "driver") {
          const vStatus = data.verificationStatus || (data.isVerified ? "approved" : "pending");
          if (vStatus === "pending") {
            setError("Your account is under verification.\nYou will receive an email after admin verification.");
            return;
          }
          if (vStatus === "rejected") {
            const reasonMsg = data.rejectionReason ? ` Reason: ${data.rejectionReason}` : "";
            setError(`Verification Failed.${reasonMsg}`);
            return;
          }
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.role || "user");

        if (data.role === "driver") {
          navigate("/driver-dashboard");
        } else if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        const errorData = await response.json();
        if (errorData.verificationStatus === "pending" || errorData.message?.includes("under verification")) {
          setError("Your account is under verification.\nYou will receive an email after admin verification.");
        } else if (errorData.verificationStatus === "rejected" || errorData.message?.includes("Verification Failed")) {
          const reasonMsg = errorData.rejectionReason ? ` Reason: ${errorData.rejectionReason}` : "";
          setError(`Verification Failed.${reasonMsg}`);
        } else {
          setError(errorData.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem("authToken", "mock-google-token-12345");
    localStorage.setItem("userId", "google-user-999");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900">
      <Header />

      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-105"
        style={{ backgroundImage: 'url("/bg-login.jpg")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-geo-red blur-[80px] opacity-30 rounded-full"></div>

            <div className="text-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30 border border-white/20"
              >
                <img src="/logo.png" alt="Geo Rides Logo" className="w-full h-full object-cover" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {t("login.title", "Welcome Back")}
              </h1>
              <p className="text-gray-300 text-sm">
                {t("login.subtitle", "Enter your credentials to access your account")}
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

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  {t("login.email", "Email Address")}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-200">
                    {t("login.password", "Password")}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-geo-red hover:text-red-400 text-sm font-medium transition-colors"
                  >
                    {t("login.forgotPassword", "Forgot Password?")}
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-gradient-to-r from-geo-red to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : t("login.signIn", "Sign In")}
              </motion.button>
            </form>

            <div className="my-8 flex items-center relative z-10">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-gray-400 text-sm">{t("login.orSignInWith", "Or continue with")}</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full relative z-10 flex items-center justify-center space-x-3 px-4 py-3.5 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-xl"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </motion.button>

            <div className="text-center text-gray-400 text-sm mt-8 relative z-10 space-y-3">
              <div className="flex justify-center items-center gap-1.5 flex-wrap">
                <span>{t("login.noAccount", "Don't have an account?")}</span>
                <Link
                  to="/register"
                  className="text-geo-red hover:text-red-400 font-bold transition-colors"
                >
                  {t("login.createRiderAccount", "Register as Rider")}
                </Link>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-center items-center gap-1.5 flex-wrap">
                <span>Want to partner with us?</span>
                <Link
                  to="/register-driver"
                  className="text-geo-red hover:text-red-400 font-bold transition-colors hover:underline"
                >
                  Register as Driver
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
