import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Send, MapPin, Mail, Phone, Globe, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "Canada",
        mobile: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const countries = [
        { code: "CA", name: "Canada" },
        { code: "IN", name: "India" },
        { code: "US", name: "United States" },
        { code: "GB", name: "United Kingdom" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email || !formData.mobile) {
            toast.error("Please fill out all required fields marked with *");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Thank you for contacting us! The query has been sent successfully.");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                country: "Canada",
                mobile: "",
                message: "",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Header />

            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Upper Grid: Description & Quick Support */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-20">
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">
                            How can we help?
                        </h1>
                        <div className="h-1.5 w-20 bg-primary rounded-full transition-all duration-300" />
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Thanks for your interest in Scootcabs / Geo Rides!
                            <br />
                            Want to know more about us or have any queries? Write to us or fill out the form below. Our dedicated customer support representative will get back to you shortly.
                        </p>
                    </div>

                    {/* Contact Support Card */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Contact Support</h3>
                            <p className="text-sm text-muted-foreground mb-4">Reach us directly at</p>
                            <a
                                href="mailto:support@scoottnc.com"
                                className="text-primary font-bold hover:underline transition"
                            >
                                support@scoottnc.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Middle Grid: Office & Map Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 bg-muted/30 border border-border/50 p-8 sm:p-12 rounded-[40px]">
                    {/* Custom Illustration */}
                    <div className="relative overflow-hidden rounded-[32px] aspect-[4/3] bg-gradient-to-tr from-primary/10 to-primary/5 flex items-center justify-center p-6 border border-border">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_70%)]" />
                        {/* Visual Vector Artwork representing map/rides */}
                        <svg
                            className="w-full h-full max-w-sm text-primary transition-all duration-300"
                            viewBox="0 0 200 150"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="100" cy="75" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                            <circle cx="100" cy="75" r="25" stroke="currentColor" strokeWidth="1" />
                            <path d="M40 75H160" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                            <path d="M100 15V135" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                            <g className="animate-bounce">
                                <circle cx="100" cy="70" r="12" fill="currentColor" fillOpacity="0.2" />
                                <path
                                    d="M100 52C94.5 52 90 56.5 90 62C90 69.5 100 78 100 78C100 78 110 69.5 110 62C110 56.5 105.5 52 100 52ZM100 65C98.3 65 97 63.7 97 62C97 60.3 98.3 59 100 59C101.7 59 103 60.3 103 62C103 63.7 101.7 65 100 65Z"
                                    fill="currentColor"
                                />
                            </g>
                            {/* Secondary dots representing local drivers */}
                            <circle cx="70" cy="55" r="4" fill="currentColor" className="animate-pulse" />
                            <circle cx="130" cy="95" r="5" fill="currentColor" fillOpacity="0.7" />
                            <circle cx="140" cy="50" r="3" fill="currentColor" className="animate-pulse" />
                        </svg>
                    </div>

                    {/* Details & Location Button */}
                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Office</span>
                        <h2 className="text-3xl font-bold text-foreground">Scoot TNC Inc</h2>
                        <div className="space-y-3">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                3 A Ferndale Ave,
                                <br />
                                St. Catharines, ON L2P 1V2
                            </p>
                            <div className="flex flex-col gap-2 pt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary" /> +12894076959
                                </span>
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary" /> info@scoottnc.com
                                </span>
                            </div>
                        </div>
                        <a
                            href="https://www.google.com/maps/place/3+A+Ferndale+Ave,+St.+Catharines,+ON+L2P+1V2,+Canada/@43.1553323,-79.2121803,17z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:scale-105 active:scale-100 transition-all duration-200"
                        >
                            <MapPin className="w-4 h-4" />
                            View On Map
                        </a>
                    </div>
                </div>

                {/* Lower Form Section */}
                <div className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Let's Talk With Us</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        </p>
                    </div>

                    {/* Form rounded box */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-card border border-border p-8 sm:p-12 rounded-[32px] shadow-lg space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email address"
                                className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Country select */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                    <Globe className="w-4 h-4 text-muted-foreground" /> Country *
                                </label>
                                <select
                                    name="country"
                                    id="country-select"
                                    aria-label="Select Country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition appearance-none cursor-pointer"
                                    required
                                >
                                    {countries.map((c) => (
                                        <option key={c.code} value={c.name} className="text-dark bg-background">
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile No */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Mobile No *</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    placeholder="Mobile number"
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Write Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Your message details here..."
                                rows={5}
                                className="w-full bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
