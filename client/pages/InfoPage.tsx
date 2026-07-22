import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Building2, Briefcase, Newspaper, TrendingUp, HelpCircle, AlertOctagon,
  FileText, Cookie, RefreshCw, ArrowRight, ShieldCheck, Mail, Phone, MapPin
} from "lucide-react";

interface ContentBlock {
  title: string;
  subtitle: string;
  icon: any;
  sections: { heading: string; body: string }[];
}

const pageData: Record<string, ContentBlock> = {
  about: {
    title: "About GeoRides",
    subtitle: "Canada's Most Trusted Premium Mobility & Car Sharing Platform",
    icon: Building2,
    sections: [
      {
        heading: "Who We Are",
        body: "GeoRides is Canada's premier tech-enabled transportation platform offering premium cab bookings, hourly/daily car rentals, parcel courier deliveries, and hotel stays across 500+ cities."
      },
      {
        heading: "Our Mission",
        body: "Sourced from GEORIDES standards (georides.ca), our mission is to empower urban movement with instant digital access, 24/7 emergency safety, and sustainable mobility solutions."
      },
      {
        heading: "Why Canada Chooses GeoRides",
        body: "With 10M+ completed rides, 200K+ verified driver partners, and 4.9-star customer rating, GeoRides sets the benchmark for safety, reliability, and transparent pricing."
      }
    ]
  },
  careers: {
    title: "Careers at GeoRides",
    subtitle: "Build the Future of Urban Mobility",
    icon: Briefcase,
    sections: [
      {
        heading: "Join Our Team",
        body: "We are looking for engineers, product designers, customer support specialists, and fleet operations managers to transform how cities move."
      },
      {
        heading: "Driver Partner Opportunities",
        body: "Are you looking to earn flexible income? Register as a GeoRides driver partner today. Verification details are processed by compliance officers at tanishkamukhi12@gmail.com."
      },
      {
        heading: "Perks & Benefits",
        body: "Competitive salary, health & dental coverage, flexible remote work, and free GeoRides credits for you and your family."
      }
    ]
  },
  blog: {
    title: "GeoRides Blog & Insights",
    subtitle: "Latest News, Travel Guides & Mobility Updates",
    icon: Newspaper,
    sections: [
      {
        heading: "5 Tips for Safe Night Rides in Toronto & Vancouver",
        body: "Learn how to use GeoRides' 1-Tap Emergency SOS, share live GPS locations with family, and verify driver credentials before stepping inside."
      },
      {
        heading: "Hourly vs. Daily Car Rentals: What's Right For You?",
        body: "Explore GEORIDES transparent pricing starting at $9/hr or $59/day with digital key app unlock."
      },
      {
        heading: "Zero-Emission Mobility: Our 2030 Sustainability Goal",
        body: "How GeoRides is transitioning 50% of our driver partner fleet to electric and hybrid vehicles."
      }
    ]
  },
  press: {
    title: "Press & Media",
    subtitle: "Official Announcements, Media Kits & Contact",
    icon: Newspaper,
    sections: [
      {
        heading: "Media Enquiries",
        body: "For press releases, executive interviews, or brand assets, please email press@georides.com or support@georides.ca."
      },
      {
        heading: "GeoRides Expands to 500+ Canadian Municipalities",
        body: "GeoRides officially announces expansion into 500+ cities across Ontario, British Columbia, Alberta, and Quebec."
      }
    ]
  },
  investors: {
    title: "Investor Relations",
    subtitle: "Financial Reports, Growth Metrics & Corporate Governance",
    icon: TrendingUp,
    sections: [
      {
        heading: "Strong Market Growth",
        body: "GeoRides continues to demonstrate 45% YoY trip volume growth driven by our integrated cab, car rental, parcel, and stay ecosystem."
      },
      {
        heading: "Investor Contact",
        body: "For investor presentations, quarterly disclosures, or capital inquiry meetings, write to investors@georides.com."
      }
    ]
  },
  help: {
    title: "Help Center",
    subtitle: "How can we assist you today?",
    icon: HelpCircle,
    sections: [
      {
        heading: "Instant Support 24/7",
        body: "Have a question about your booking, payment, or driver status? Our support agents are available around the clock."
      },
      {
        heading: "Common Topics",
        body: "• How to book a cab or car rental\n• Payment methods & receipts\n• Lost item recovery\n• Driver account verification"
      },
      {
        heading: "Direct Assistance",
        body: "Call us at +1 604 1234567 or email support@georides.com."
      }
    ]
  },
  report: {
    title: "Report an Issue",
    subtitle: "We take your feedback & safety seriously",
    icon: AlertOctagon,
    sections: [
      {
        heading: "Submit a Report",
        body: "If you experienced a delayed trip, payment discrepancy, or driver behavior concern, please submit a report below."
      },
      {
        heading: "Emergency Safety",
        body: "If you are in immediate physical danger, please switch to the Safety tab and press the red 1-Tap SOS button to dial 911 immediately."
      }
    ]
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "GEORIDES Service Agreement & Rental Terms",
    icon: FileText,
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing GEORIDES website (georides.ca) or mobile applications, you agree to comply with all federal and provincial regulations."
      },
      {
        heading: "2. Driver Partner Obligations",
        body: "Drivers must maintain valid licensing, background checks, and submit Canadian SIN verification details to tanishkamukhi12@gmail.com for approval."
      },
      {
        heading: "3. Booking & Cancellation Policies",
        body: "Riders may cancel free of charge up to 5 minutes after booking confirmation. Car rental reservations carry zero penalty when canceled 24h prior."
      }
    ]
  },
  cookies: {
    title: "Cookie Policy",
    subtitle: "How GeoRides Uses Cookies & Tracking Technologies",
    icon: Cookie,
    sections: [
      {
        heading: "Essential Cookies",
        body: "GeoRides uses essential session cookies to keep you logged in, save your active ride status, and store your preferred language."
      },
      {
        heading: "Managing Preferences",
        body: "You can disable optional performance cookies at any time through your web browser settings."
      }
    ]
  },
  refund: {
    title: "Refund Policy",
    subtitle: "Transparent Money-Back Guarantee",
    icon: RefreshCw,
    sections: [
      {
        heading: "Eligibility for Refunds",
        body: "If a ride is canceled by the driver, or if you were charged twice due to a billing error, a 100% full refund is issued automatically within 3 business days."
      },
      {
        heading: "Requesting a Refund",
        body: "Visit your Trip History, select the relevant ride ID, and tap 'Request Refund', or email billing@georides.com."
      }
    ]
  }
};

export default function InfoPage() {
  const location = useLocation();
  const pageKey = location.pathname.replace("/", "") || "about";
  const data = pageData[pageKey] || pageData["about"];
  const IconComponent = data.icon;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-geo-red/10 text-geo-red rounded-2xl flex items-center justify-center">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-geo-dark">{data.title}</h1>
              <p className="text-gray-500 text-base">{data.subtitle}</p>
            </div>
          </div>

          <div className="space-y-8 border-t border-gray-100 pt-8">
            {data.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xl font-bold text-geo-dark">{section.heading}</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Official GeoRides Support</p>
              <p className="font-bold">Need additional assistance?</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/safety"
                className="px-5 py-2.5 bg-geo-red text-white font-bold rounded-xl text-sm hover:bg-red-600 transition"
              >
                Safety & Emergency
              </Link>
              <a
                href="mailto:support@georides.com"
                className="px-5 py-2.5 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
