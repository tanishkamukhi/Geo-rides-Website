import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, MapPin, Mail, CheckCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-geo-red/10 text-geo-red rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-geo-dark mb-2">GEORIDES Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Effective Date: November 20, 2025. Content sourced from official GeoRides standards.</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-10">
          <div className="p-6 bg-red-50 border-l-4 border-geo-red rounded-r-2xl">
            <p className="text-gray-700 leading-relaxed font-medium">
              At GEORIDES, accessible from <strong>https://georides.ca/</strong>, one of our main priorities is the privacy of our riders, drivers, and partners. This Privacy Policy document outlines the types of information collected and how we utilize it.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information directly from you, automatically as you use our Services, and from verified Canadian compliance databases.
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-geo-red" /> A. Information You Provide Directly
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <td><strong>Account Details:</strong> Full name, email address, mobile phone number, date of birth.</td>
                <td><strong>Driver Verification:</strong> Driver's License photo, Canadian SIN Number (for driver partner background validation), and vehicle license plate number.</td>
                <td><strong>Payment Data:</strong> Card tokens, billing postal code, and payment transaction receipts processed via PCI-compliant partners.</td>
              </ul>

              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pt-2">
                <MapPin className="w-5 h-5 text-geo-red" /> B. Information Collected Automatically
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <td><strong>Ride & Usage Data:</strong> Reservation details, distance traveled, vehicle type, and emergency SOS logs.</td>
                <td><strong>Precise Location Coordinates:</strong> GPS location is collected from the moment a ride or emergency SOS is triggered until the trip concludes.</td>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-600 ml-4 leading-relaxed">
              <td><strong>Service Execution:</strong> Matching riders with nearby verified drivers, calculating upfront fares, and providing live map tracking.</td>
              <td><strong>Safety & Emergency Response:</strong> Transmitting live GPS coordinates to emergency services (911) when SOS is pressed.</td>
              <td><strong>Driver Verification:</strong> Verifying driver credentials with compliance officers at <code>tanishkamukhi12@gmail.com</code>.</td>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark">3. Data Security & Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement AES-256 bit encryption and SSL secure socket layers to safeguard user data against unauthorized access, loss, or alteration.
            </p>
          </section>

          <section className="p-8 bg-gray-900 text-white rounded-3xl space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Mail className="w-6 h-6 text-geo-red" /> 4. Contact Us
            </h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy or wish to request data removal, contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p>Email: <a href="mailto:support@georides.com" className="text-geo-red underline font-bold">support@georides.com</a></p>
              <p>Driver Compliance: <a href="mailto:tanishkamukhi12@gmail.com" className="text-geo-red underline font-bold">tanishkamukhi12@gmail.com</a></p>
              <p>Website: <a href="https://georides.ca/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white underline">https://georides.ca/</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
