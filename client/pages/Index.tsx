import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Car,
  Truck,
  Hotel,
  Package,
  Shield,
  MapPinCheck,
  Phone,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Apple,
  PlayCircle,
  Star,
  Mail,
  Play,
  Pause,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    vehicle: "cab",
  });

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => console.log("Video fail to play: ", err));
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };


  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    // Navigate to booking confirmation with booking data
    navigate("/booking-confirmation", {
      state: {

        bookingId: "GEO" + Date.now(),
        pickupLocation: formData.pickup,
        dropLocation: formData.dropoff,
        vehicleType: formData.vehicle,
        estimatedFare: "$25",
        estimatedTime: "5 mins",
        driverName: "John Smith",
        driverPhone: "+1 647-555-1234",
        vehicleNumber: "ON-AB-1234",
      },
    });

  };

  const services = [
    {
      id: 1,
      titleKey: "services.bikeTaxi",
      descKey: "services.bikeTaxiDesc",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      titleKey: "services.autoRide",
      descKey: "services.autoRideDesc",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      titleKey: "services.cabBooking",
      descKey: "services.cabBookingDesc",
      imageUrl: "https://images.unsplash.com/photo-1488821228519-b21cc028cb0f?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      titleKey: "services.vehicleRental",
      descKey: "services.vehicleRentalDesc",
      imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=250&fit=crop",
    },
    {
      id: 5,
      titleKey: "services.parcelDelivery",
      descKey: "services.parcelDeliveryDesc",
      imageUrl: "https://images.unsplash.com/photo-1453393675326-0066d393e589?w=400&h=250&fit=crop",
    },
  ];

  const features = [
    {
      titleKey: "whyChoose.affordablePricing",
      descKey: "whyChoose.affordablePricingDesc",
      icon: Star,
    },
    {
      titleKey: "whyChoose.verifiedDrivers",
      descKey: "whyChoose.verifiedDriversDesc",
      icon: Shield,
    },
    {
      titleKey: "whyChoose.realTimeTracking",
      descKey: "whyChoose.realTimeTrackingDesc",
      icon: MapPinCheck,
    },
    {
      titleKey: "whyChoose.availability24",
      descKey: "whyChoose.availability24Desc",
      icon: Award,
    },
  ];

  const steps = [
    {
      number: 1,
      titleKey: "howItWorks.step1",
      descKey: "howItWorks.step1Desc",
    },
    {
      number: 2,
      titleKey: "howItWorks.step2",
      descKey: "howItWorks.step2Desc",
    },
    {
      number: 3,
      titleKey: "howItWorks.step3",
      descKey: "howItWorks.step3Desc",
    },
  ];

  const testimonials = [
    {
      name: "Priya Singh",
      role: "Student",
      text: "Geo Rides has been a game-changer for my daily commute. Affordable and reliable!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Professional",
      text: "Best ride-sharing experience. Drivers are courteous and the app is very user-friendly.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      role: "Homemaker",
      text: "Safe, comfortable, and I love the student discounts. Highly recommended!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      questionKey: "faq.q1",
      answerKey: "faq.a1",
    },
    {
      questionKey: "faq.q2",
      answerKey: "faq.a2",
    },
    {
      questionKey: "faq.q3",
      answerKey: "faq.a3",
    },
    {
      questionKey: "faq.q4",
      answerKey: "faq.a4",
    },
    {
      questionKey: "faq.q5",
      answerKey: "faq.a5",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Rapido-Style Hero Section */}
      <section className="relative h-[85vh] flex items-center pt-16 overflow-hidden">
        {/* Background Video with Image Fallback */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="https://scoottnc.com/images/new/home/banner-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/bg-home.jpg"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>

          {/* Video Play/Pause Control Button */}
          <button
            onClick={toggleVideoPlayback}
            className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 hover:border-white/50 flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg"
            aria-label={isVideoPlaying ? "Pause background video" : "Play background video"}
          >
            {isVideoPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                {t('hero.headline')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 max-w-lg">
                {t('hero.subheadline')}
              </p>

              {/* Service Cards Overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {[
                  { id: 'cab', icon: Car, label: 'Cab Service', color: 'bg-blue-500' },
                  { id: 'travel', icon: Hotel, label: 'Travel & Stay', color: 'bg-yellow-400' },
                  { id: 'parcel', icon: Package, label: 'Parcel Service', color: 'bg-green-500' }
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.id}
                      to={`/service/${s.id}`}
                      className={`${s.color} p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform group cursor-pointer flex flex-col items-center justify-center text-geo-dark text-center`}
                    >
                      <Icon className="w-12 h-12 mb-3 group-hover:animate-bounce" />
                      <span className="font-bold text-lg">{s.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Fastest Way to Book</h3>
              <form onSubmit={handleBookRide} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-geo-red" />
                    <input
                      type="text"
                      name="pickup"
                      value={formData.pickup}
                      onChange={handleFormChange}
                      placeholder="Enter pickup location"
                      className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-geo-red transition"
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="dropoff"
                      value={formData.dropoff}
                      onChange={handleFormChange}
                      placeholder="Enter drop location"
                      className="w-full pl-10 pr-4 py-3 bg-white/90 border-0 rounded-xl focus:ring-2 focus:ring-geo-red transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-geo-red text-white font-bold py-4 rounded-xl hover:bg-red-600 transition duration-200 shadow-lg text-lg"
                >
                  {t('hero.bookBtn')}
                </button>
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    New to Geo Rides? <Link to="/register" className="text-geo-red hover:underline font-bold">Create Account</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Maps_icon_%282020%29.svg" alt="Gmaps" className="h-8" />
          <span className="font-bold text-xl text-gray-400 italic">Trusted by 5M+ Users</span>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Razorpay_logo.svg" alt="Razorpay" className="h-8" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-geo-dark mb-4">
              {t('whyChoose.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 hover:border-geo-red transition"
                >
                  <div className="bg-geo-red bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-geo-red" />
                  </div>
                  <h3 className="text-xl font-bold text-geo-dark mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600">{t(feature.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-geo-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-geo-red rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {t(step.descKey)}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-geo-red to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-geo-dark mb-4">
              {t('safety.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('safety.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-2 border-geo-red rounded-xl p-6 text-center hover:shadow-lg transition">
              <Phone className="w-12 h-12 text-geo-red mx-auto mb-4" />
              <h3 className="font-bold text-lg text-geo-dark mb-2">
                {t('safety.emergencySOS')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('safety.emergencySOSDesc')}
              </p>
            </div>

            <div className="border-2 border-geo-red rounded-xl p-6 text-center hover:shadow-lg transition">
              <MapPinCheck className="w-12 h-12 text-geo-red mx-auto mb-4" />
              <h3 className="font-bold text-lg text-geo-dark mb-2">
                {t('safety.liveSharing')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('safety.liveSharingDesc')}
              </p>
            </div>

            <div className="border-2 border-geo-red rounded-xl p-6 text-center hover:shadow-lg transition">
              <Shield className="w-12 h-12 text-geo-red mx-auto mb-4" />
              <h3 className="font-bold text-lg text-geo-dark mb-2">
                {t('safety.driverVerification')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('safety.driverVerificationDesc')}
              </p>
            </div>

            <div className="border-2 border-geo-red rounded-xl p-6 text-center hover:shadow-lg transition">
              <Award className="w-12 h-12 text-geo-red mx-auto mb-4" />
              <h3 className="font-bold text-lg text-geo-dark mb-2">
                {t('safety.tripMonitoring')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('safety.tripMonitoringDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Partner Section */}
      <section className="py-16 md:py-20 bg-geo-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('driverPartner.title')}
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                {t('driverPartner.description')}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-geo-red rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <p className="text-lg">{t('driverPartner.flexibleHours')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-geo-red rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <p className="text-lg">{t('driverPartner.weeklyEarnings')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-geo-red rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <p className="text-lg">{t('driverPartner.easyRegistration')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-geo-red rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <p className="text-lg">{t('driverPartner.support24')}</p>
                </div>
              </div>

              <button className="px-8 py-3 bg-geo-red text-white font-bold rounded-lg hover:bg-red-600 transition">
                {t('driverPartner.registerBtn')}
              </button>
            </div>

            <div className="relative h-96 bg-cover bg-center rounded-2xl overflow-hidden shadow-xl"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=400&fit=crop")' }}>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <Car className="w-20 h-20 mx-auto mb-4 opacity-90" />
                  <p className="text-2xl font-bold">{t('driverPartner.earnIncome')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-geo-dark mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-geo-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-geo-dark">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Link to="/download" className="relative h-96 bg-cover bg-center rounded-2xl overflow-hidden shadow-xl group block cursor-pointer"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop")' }}>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <div className="text-center text-white transform group-hover:scale-105 transition">
                  <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-90 text-geo-red" />
                  <p className="text-xl font-black uppercase tracking-wider">Mobile App Download & Preview</p>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full mt-2 inline-block font-semibold">Click to Download App →</span>
                </div>
              </div>
            </Link>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-geo-dark mb-6">
                {t('mobileApp.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('mobileApp.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/download')} className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-geo-dark text-white rounded-2xl hover:bg-gray-800 transition transform active:scale-95 shadow-md">
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400">{t('mobileApp.downloadOn')}</p>
                    <p className="font-black text-base leading-none">{t('mobileApp.appStore')}</p>
                  </div>
                </button>

                <button onClick={() => navigate('/download')} className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-geo-red text-white rounded-2xl hover:bg-red-600 transition transform active:scale-95 shadow-md">
                  <PlayCircle className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-red-200">{t('mobileApp.getItOn')}</p>
                    <p className="font-black text-base leading-none">{t('mobileApp.googlePlay')}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-geo-dark mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-geo-dark text-left">
                    {t(faq.questionKey)}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-geo-red flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-geo-red flex-shrink-0" />
                  )}
                </button>

                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{t(faq.answerKey)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
