import "./global.css";
import "@/i18n/config";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/NotFound";

import ServiceDetails from "./pages/ServiceDetails";
import BookingSuccess from "./pages/BookingSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import History from "./pages/History";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import PartnerWithUs from "./pages/PartnerWithUs";
import DriverDashboard from "./pages/DriverDashboard";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/service/:type" element={<ServiceDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/partner" element={<PartnerWithUs />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
