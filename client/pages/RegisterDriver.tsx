import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, ShieldAlert, FileText, Camera, UploadCloud, XCircle, FileImage, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import Header from "@/components/Header";
import { toast } from "sonner";

type DocumentKey = "profilePhoto" | "selfiePhoto" | "licenseFront" | "licenseBack" | "vehicleRegistration" | "insuranceDocument";

export default function RegisterDriver() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        driversLicense: "",
        vehicleNumber: "",
        vehicleType: "car",
        sinNumber: "",
    });

    const [files, setFiles] = useState<Record<DocumentKey, File | null>>({
        profilePhoto: null,
        selfiePhoto: null,
        licenseFront: null,
        licenseBack: null,
        vehicleRegistration: null,
        insuranceDocument: null,
    });

    const [previews, setPreviews] = useState<Record<DocumentKey, string | null>>({
        profilePhoto: null,
        selfiePhoto: null,
        licenseFront: null,
        licenseBack: null,
        vehicleRegistration: null,
        insuranceDocument: null,
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Camera state
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (key: DocumentKey, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and PDF files are allowed.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB.");
            return;
        }

        setFiles(prev => ({ ...prev, [key]: file }));
        if (file.type.startsWith("image/")) {
            setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
        } else {
            setPreviews(prev => ({ ...prev, [key]: "PDF_PREVIEW" }));
        }
    };

    const removeFile = (key: DocumentKey) => {
        setFiles(prev => ({ ...prev, [key]: null }));
        setPreviews(prev => ({ ...prev, [key]: null }));
    };

    // Camera Logic
    const startCamera = () => {
        setIsCameraOpen(true);
    };

    const stopCamera = () => {
        setIsCameraOpen(false);
    };

    const captureSelfie = () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            // Convert base64 to file
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                    setFiles(prev => ({ ...prev, selfiePhoto: file }));
                    setPreviews(prev => ({ ...prev, selfiePhoto: URL.createObjectURL(file) }));
                    stopCamera();
                });
        }
    };

    const validateStep1 = () => {
        const errors: Record<string, string> = {};
        if (!formData.fullName.trim()) errors.fullName = "Name is required";
        if (!formData.email.includes("@")) errors.email = "Valid email required";
        if (!formData.phone || formData.phone.length < 10) errors.phone = "Valid phone required";
        if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords don't match";
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = () => {
        const errors: Record<string, string> = {};
        if (!formData.driversLicense.trim()) errors.driversLicense = "Driver's license is required";
        if (!formData.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle plate number is required";
        if (!formData.sinNumber.trim()) {
            errors.sinNumber = "SIN number is required";
        } else if (formData.sinNumber.replace(/\D/g, "").length !== 9) {
            errors.sinNumber = "Canadian SIN must be 9 digits";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = () => {
        const requiredDocs: DocumentKey[] = ["profilePhoto", "selfiePhoto", "licenseFront", "licenseBack", "vehicleRegistration", "insuranceDocument"];
        for (const doc of requiredDocs) {
            if (!files[doc]) {
                toast.error("Please upload all required documents to proceed.");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) setStep(2);
        if (step === 2 && validateStep2()) setStep(3);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 3 || !validateStep3()) return;

        setIsLoading(true);
        setError("");

        try {
            const submitData = new FormData();
            
            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });
            submitData.append("role", "driver");

            // Add files
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    submitData.append(key, file);
                }
            });

            const response = await fetch("/api/register", {
                method: "POST",
                body: submitData, // Browser automatically sets Content-Type to multipart/form-data with boundary
            });

            const resData = await response.json();

            if (response.ok) {
                // Auto login (optional, but keep for consistency)
                try {
                    const loginRes = await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: formData.email, password: formData.password }),
                    });
                    if (loginRes.ok) {
                        const data = await loginRes.json();
                        localStorage.setItem("authToken", data.token);
                        localStorage.setItem("userId", data.userId);
                        localStorage.setItem("userRole", "driver");
                    }
                } catch (e) {
                    // Ignore login errors on register
                }
                
                setSuccess(true);
            } else {
                setError(resData.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderUploadCard = (key: DocumentKey, title: string) => {
        const file = files[key];
        const preview = previews[key];

        return (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-40">
                {file ? (
                    <div className="w-full h-full flex flex-col items-center justify-center relative group">
                        {preview === "PDF_PREVIEW" ? (
                            <FileText className="w-12 h-12 text-geo-red mb-2" />
                        ) : (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={preview as string} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition" />
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                            <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                            <div className="flex gap-2">
                                <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-3 py-1 text-xs rounded transition">
                                    Replace
                                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(key, e)} />
                                </label>
                                <button type="button" onClick={() => removeFile(key)} className="bg-red-500/80 hover:bg-red-500 px-3 py-1 text-xs rounded transition">
                                    Remove
                                </button>
                            </div>
                        </div>
                        {!preview?.startsWith('blob') && preview !== "PDF_PREVIEW" && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 text-xs truncate bg-black/50 px-2 py-1 rounded z-10">
                            {file.name}
                        </div>
                    </div>
                ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-geo-red transition mb-2" />
                        <span className="text-sm font-bold text-gray-300">{title}</span>
                        <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                        <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(key, e)} />
                    </label>
                )}
            </div>
        );
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col relative overflow-hidden text-white">
                <Header />
                <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 scale-105"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop")' }} />
                <div className="flex-1 flex items-center justify-center px-4 pt-24 relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center"
                    >
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                            <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-3">Registration submitted successfully.</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">
                                Your documents have been sent to GeoRides Admin for verification. You will receive an email after approval.
                            </p>
                        </div>
                        <div className="mt-8">
                            <button onClick={() => navigate("/")} className="w-full bg-geo-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition">
                                Back to Home
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900 text-white pb-12">
            <Header />
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop")' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />

            <div className="flex-1 flex items-center justify-center px-4 pt-28 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        
                        {/* Stepper Header */}
                        <div className="flex items-center justify-center mb-8 relative z-10">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-geo-red text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-white/10 text-gray-500'}`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-12 h-1 mx-2 rounded transition-colors ${step > s ? 'bg-geo-red' : 'bg-white/10'}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="text-center mb-8 relative z-10">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Driver Partner Verification</h1>
                            <p className="text-gray-400 text-sm">
                                {step === 1 && "Step 1: Personal Details"}
                                {step === 2 && "Step 2: Driver & Vehicle Information"}
                                {step === 3 && "Step 3: Verification Documents"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-geo-red/20 border border-geo-red/50 text-red-200 rounded-xl text-sm backdrop-blur-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative z-10">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Full Name</label>
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                {fieldErrors.fullName && <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Email Address</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Phone Number</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (416) 123-4567" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                            {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-300 mb-2">Password</label>
                                                <div className="relative">
                                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-300 mb-2">Confirm Password</label>
                                                <div className="relative">
                                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                                            </div>
                                        </div>

                                        <button type="button" onClick={nextStep} className="w-full bg-geo-red hover:bg-red-600 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition mt-6">
                                            Continue to Driver Details
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2">Driver's License Number</label>
                                                <input type="text" name="driversLicense" value={formData.driversLicense} onChange={handleChange} placeholder="ON-DL-12345-67890" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                {fieldErrors.driversLicense && <p className="text-red-400 text-xs mt-1">{fieldErrors.driversLicense}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2">Social Insurance Number (SIN)</label>
                                                <input type="text" name="sinNumber" value={formData.sinNumber} onChange={handleChange} placeholder="XXX-XXX-XXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                {fieldErrors.sinNumber && <p className="text-red-400 text-xs mt-1">{fieldErrors.sinNumber}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2">Vehicle Plate Number</label>
                                                <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="ABCD 123" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition" />
                                                {fieldErrors.vehicleNumber && <p className="text-red-400 text-xs mt-1">{fieldErrors.vehicleNumber}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2">Vehicle Type</label>
                                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-geo-red transition">
                                                    <option value="car" className="bg-gray-900">Premium Car </option>
                                                    <option value="suv" className="bg-gray-900">Luxury SUV</option>
                                                    <option value="truck" className="bg-gray-900">Cargo Van / Truck</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <button type="button" onClick={prevStep} className="w-1/3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition">
                                                Back
                                            </button>
                                            <button type="button" onClick={nextStep} className="w-2/3 bg-geo-red hover:bg-red-600 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition">
                                                Proceed to Documents
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
                                            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
                                            <div className="text-left leading-normal">
                                                <p className="font-bold text-base mb-1 text-white">Identity Verification</p>
                                                <p>Upload clear, legible copies of your documents. Allowed formats: JPG, PNG, PDF. Max size: 10MB.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {renderUploadCard("profilePhoto", "Profile Photo")}
                                            
                                            {/* Special Live Selfie Card */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-40 group">
                                                {files.selfiePhoto ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                                                        <img src={previews.selfiePhoto as string} alt="Selfie" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition" />
                                                        <div className="relative z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                                                            <div className="flex gap-2">
                                                                <button type="button" onClick={startCamera} className="bg-geo-red hover:bg-red-600 px-3 py-1 text-xs rounded transition flex items-center gap-1">
                                                                    <RefreshCw className="w-3 h-3" /> Retake
                                                                </button>
                                                                <button type="button" onClick={() => removeFile("selfiePhoto")} className="bg-red-500/80 hover:bg-red-500 px-3 py-1 text-xs rounded transition">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-400" />
                                                        <div className="absolute bottom-2 left-2 right-2 text-xs truncate bg-black/50 px-2 py-1 rounded z-10">Live Selfie</div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                                        <Camera className="w-8 h-8 text-geo-red group-hover:text-red-400 transition mb-2" />
                                                        <span className="text-sm font-bold text-gray-300">Live Selfie</span>
                                                        <button type="button" onClick={startCamera} className="mt-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition">
                                                            Open Camera
                                                        </button>
                                                        <label className="text-[10px] text-gray-500 hover:text-gray-300 underline mt-2 cursor-pointer">
                                                            or manual upload
                                                            <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange("selfiePhoto", e)} />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>

                                            {renderUploadCard("licenseFront", "License (Front)")}
                                            {renderUploadCard("licenseBack", "License (Back)")}
                                            {renderUploadCard("vehicleRegistration", "Registration")}
                                            {renderUploadCard("insuranceDocument", "Insurance")}
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button type="button" onClick={prevStep} className="w-1/3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition">
                                                Back
                                            </button>
                                            <button type="submit" disabled={isLoading} className="w-2/3 bg-geo-red hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition flex justify-center items-center gap-2">
                                                {isLoading ? "Submitting..." : "Submit Verification"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>

                        {/* Camera Modal */}
                        {isCameraOpen && (
                            <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden max-w-lg w-full relative">
                                    <button type="button" onClick={stopCamera} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
                                        <XCircle className="w-8 h-8" />
                                    </button>
                                    <div className="p-4 bg-gray-800 text-center border-b border-white/10">
                                        <h3 className="font-bold text-lg">Position face in frame</h3>
                                    </div>
                                    <div className="relative bg-black flex items-center justify-center aspect-[4/3] overflow-hidden">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={{
                                                width: 640,
                                                height: 480,
                                                facingMode: "user"
                                            }}
                                            className="w-full h-full object-cover"
                                            mirrored={true}
                                            onUserMediaError={() => {
                                                toast.error("Camera access denied or unavailable. You can manually upload a selfie.");
                                                setIsCameraOpen(false);
                                            }}
                                        />
                                        {/* Overlay guide */}
                                        <div className="absolute inset-0 border-[40px] border-black/50 rounded-full scale-75 pointer-events-none z-10"></div>
                                    </div>
                                    <div className="p-6 flex justify-center bg-gray-800 border-t border-white/10">
                                        <button type="button" onClick={captureSelfie} className="bg-geo-red hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition transform hover:scale-105">
                                            <Camera className="w-8 h-8" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center text-gray-400 text-sm mt-8 space-y-3">
                            <div className="pt-3 border-t border-white/10">
                                Already have an account?{" "}
                                <Link to="/login" className="text-geo-red hover:text-red-400 font-bold transition hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
