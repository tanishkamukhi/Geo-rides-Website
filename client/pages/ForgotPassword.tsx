import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900">
            <Header />

            {/* Dynamic Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2070&q=80")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

            <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Glass Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                        {/* Glow effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-geo-red blur-[80px] opacity-30 rounded-full"></div>

                        {!isSubmitted ? (
                            <div className="relative z-10">
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                        className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30 border border-white/20"
                                    >
                                        <img src="/logo.png" alt="Geo Rides Logo" className="w-full h-full object-cover" />
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forgot Password?</h1>
                                    <p className="text-gray-300 text-sm">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-geo-red transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-8 bg-gradient-to-r from-geo-red to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </motion.button>
                                </form>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center relative z-10"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-3">Check Your Email</h1>
                                <p className="text-gray-300 text-sm mt-4">
                                    We have sent a password reset link to <span className="font-bold text-white">{email}</span>. Please check your inbox and spam folder.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-8 text-geo-red font-bold hover:text-red-400 transition-colors"
                                >
                                    Didn't receive email? Try again
                                </button>
                            </motion.div>
                        )}

                        <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
                            <Link to="/login" className="inline-flex items-center space-x-2 text-gray-400 hover:text-geo-red font-medium transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
