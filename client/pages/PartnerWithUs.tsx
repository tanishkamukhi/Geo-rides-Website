import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Clock, Award, Star, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PartnerWithUs() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        vehicleType: "car",
        driversLicense: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/partner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit request.");
            setSuccess(true);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                vehicleType: "car",
                driversLicense: "",
                message: "",
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white selection:bg-geo-red selection:text-white">
            <Header />
            <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Info Column */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-geo-red uppercase tracking-wider backdrop-blur-md">
                        <Award className="w-4 h-4 text-geo-red" />
                        <span>Join our elite team</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                        Partner With Us & <br />{" "}
                        <span className="text-geo-red">Multiply Your Earnings</span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                        Whether you want to drive a premium standard cab, offer travel stays, or deliver parcel orders across Canada, Geo Rides offers elite support, flexible hours, and 100% verified riders.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-geo-red mb-3" />
                            <h3 className="font-bold text-lg mb-1">Instant Verification</h3>
                            <p className="text-sm text-gray-500">Fast DL and background checks to get you on the road quickly.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl backdrop-blur-sm">
                            <Clock className="w-8 h-8 text-geo-red mb-3" />
                            <h3 className="font-bold text-lg mb-1">Flexible Hours</h3>
                            <p className="text-sm text-gray-500">Choose your own shifts and drive whenever you want.</p>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="lg:col-span-5">
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        {/* Background elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-geo-red/10 rounded-full blur-2xl" />

                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Application Form</h2>

                        {success && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-semibold">Your partnership application was submitted successfully!</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 bg-geo-red/10 border border-geo-red/20 text-geo-red p-4 rounded-xl text-sm font-semibold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 (416) 123-4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Vehicle Type</label>
                                <select
                                    value={formData.vehicleType}
                                    title="Vehicle Type"
                                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition"
                                >
                                    <option value="car" className="bg-gray-900">Car / SUV</option>
                                    <option value="bike" className="bg-gray-900">Motorcycle</option>
                                    <option value="truck" className="bg-gray-900">Delivery Van / Truck</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Driver's License Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="DL-XXXXXXXXXXXX"
                                    value={formData.driversLicense}
                                    onChange={(e) => setFormData({ ...formData, driversLicense: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Message or Experience (Optional)</label>
                                <textarea
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red focus:ring-1 focus:ring-geo-red transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-geo-red hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition active:scale-[0.99]"
                            >
                                {loading ? "Submitting Application..." : "Submit Application"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
