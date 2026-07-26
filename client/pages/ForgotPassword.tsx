import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const sendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("OTP Sent Successfully");
            setStep(2);
        } catch {
            alert("Unable to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("OTP Verified");
            setStep(3);
        } catch {
            alert("Verification Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                    password: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Password Reset Successfully");
            navigate("/login");
        } catch {
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900">
            <Header />

            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2070&q=80")',
                }}
            />

            <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

            <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600 blur-[80px] opacity-30 rounded-full"></div>{step === 1 ? (

                            <div className="relative z-10">

                                <div className="text-center mb-8">

                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Forgot Password?
                                    </h1>

                                    <p className="text-gray-300 text-sm">
                                        Enter your email address and we'll send you a 6-digit OTP.
                                    </p>

                                </div>

                                <form onSubmit={sendOTP} className="space-y-6">

                                    <div>

                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Email Address
                                        </label>

                                        <div className="relative">

                                            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                                required
                                            />

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl bg-red-600 text-white font-bold"
                                    >
                                        {isLoading ? "Sending..." : "Send OTP"}
                                    </button>

                                </form>

                            </div>

                        ) : step === 2 ? (

                            <div className="relative z-10 space-y-6">

                                <h1 className="text-3xl font-bold text-white text-center">
                                    Verify OTP
                                </h1>

                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white"
                                />

                                <button
                                    onClick={verifyOTP}
                                    className="w-full py-4 rounded-xl bg-red-600 text-white font-bold"
                                >
                                    Verify OTP
                                </button>

                            </div>

                        ) : (

                            <div className="relative z-10 space-y-6">

                                <h1 className="text-3xl font-bold text-white text-center">
                                    Create New Password
                                </h1>

                                <div className="relative">

                                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                                    />

                                </div>

                                <div className="relative">

                                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                                    />

                                </div>

                                <button
                                    onClick={resetPassword}
                                    className="w-full py-4 rounded-xl bg-red-600 text-white font-bold"
                                >
                                    Reset Password
                                </button>

                            </div>

                        )}

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">

                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-gray-300 hover:text-red-400"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>

                        </div>          </div>
                </motion.div>
            </div>
        </div>
    );
}