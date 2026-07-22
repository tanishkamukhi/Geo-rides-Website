import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, EyeOff, Server, FileCheck, Key, Database, Mail } from "lucide-react";

export default function DataSecurity() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-geo-red px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Official Data Security Standards
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-geo-dark mb-4">
            Data Security & Privacy Protection
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            GeoRides uses enterprise-grade encryption, PIPEDA compliance, and secure document verification vaults to protect every rider and driver partner.
          </p>
        </div>

        {/* Security Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-geo-red text-white rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">AES-256 Bit Encryption</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              All network transmissions and user authentication tokens are encrypted using TLS 1.3 and AES-256 standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">PIPEDA & GDPR Compliant</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Fully compliant with Canadian Personal Information Protection and Electronic Documents Act guidelines.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Driver Vault Verification</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Driver license, SIN numbers, and vehicle registration documents are stored in zero-knowledge encrypted vaults.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">GPS Masking & Anonymity</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pickup and dropoff locations are anonymized after trip completion. We never sell your personal data.
            </p>
          </div>
        </div>

        {/* Detailed Security Policy Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark flex items-center gap-3">
              <Database className="w-6 h-6 text-geo-red" /> 1. Driver Registration Security & Verification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              When a new driver partner registers on GeoRides, sensitive verification details (Driver's License, Canadian SIN Number, Vehicle Identification Plate) undergo strict audit procedures. Automated verification alerts and background check notifications are dispatched directly to compliance administrators at <strong className="text-geo-red font-mono">tanishkamukhi12@gmail.com</strong>.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
              📌 <strong>Driver Verification Notice:</strong> Driver accounts remain in pending state until document validation clears. Verification status updates are communicated to both driver profile and admin audit logs.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark flex items-center gap-3">
              <Server className="w-6 h-6 text-geo-red" /> 2. Infrastructure & Payment Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              GeoRides payment processing is powered by PCI-DSS Level 1 certified gateways. Credit card numbers are never saved directly on GeoRides web servers. Transaction sessions are protected by tokenized payment keys.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-geo-dark flex items-center gap-3">
              <Mail className="w-6 h-6 text-geo-red" /> 3. Data Protection Inquiries
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions regarding your data privacy, request account data deletion, or report security vulnerabilities, please contact our Security & Verification Lead:
            </p>
            <div className="p-6 bg-gray-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">GeoRides Compliance Lead</p>
                <p className="text-lg font-bold">Tanishka Mukhi — Data Security Compliance</p>
                <p className="text-geo-red font-mono font-semibold">tanishkamukhi12@gmail.com</p>
              </div>
              <a
                href="mailto:tanishkamukhi12@gmail.com"
                className="px-6 py-3 bg-geo-red text-white font-bold rounded-xl hover:bg-red-600 transition"
              >
                Contact Data Security
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
