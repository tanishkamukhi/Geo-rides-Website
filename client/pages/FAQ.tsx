import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How do I book a Geo Ride?",
            a: "Open the app, enter your pickup and drop-off locations, select your preferred vehicle (Bike, Auto, or Cab), and tap 'Book Your Ride'. You'll be connected with a driver in seconds."
        },
        {
            q: "How is the fare calculated?",
            a: "Fares are calculated based on the base price of the vehicle type, the distance traveled, and the estimated time. We provide an upfront fare estimate before you book so there are no surprises."
        },
        {
            q: "What payment methods are available?",
            a: "We support multiple payment options including Cash, UPI, Credit/Debit Cards, and Geo Wallet. You can select your preferred method before confirming the booking."
        },
        {
            q: "How can I contact my driver?",
            a: "Once a driver is assigned, their details and contact options (call and message) will appear on your screen. You can also track their live location as they approach you."
        },
        {
            q: "What if I need to cancel my ride?",
            a: "You can cancel your ride from the booking screen. While we don't charge for immediate cancellations, a small fee may apply if the driver has already reached your pickup location."
        },
        {
            q: "Is Geo Rides safe for late-night travel?",
            a: "Every ride is monitored 24/7 by our safety team. We have features like live trip sharing and an SOS button to ensure you're always safe and connected."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <main className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase tracking-tighter italic">Help Center</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-full shadow-sm focus:ring-2 focus:ring-[#FFD700] outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all shadow-sm">
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-bold text-lg text-black">{faq.q}</span>
                                    {openIndex === index ? <ChevronUp className="w-5 h-5 text-[#FFD700]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 italic">No questions found matching your search.</p>
                        </div>
                    )}
                </div>

                <div className="mt-16 bg-[#FFD700] p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-black mb-2 uppercase italic tracking-tighter">Still have questions?</h3>
                        <p className="text-black/60">Our support team is available 24/7 to help you with any issues.</p>
                    </div>
                    <button className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center space-x-3 hover:scale-105 transition shadow-xl">
                        <MessageCircle className="w-5 h-5" />
                        <span>Chat with us</span>
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
