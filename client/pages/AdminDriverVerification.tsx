import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle, FileText, Check, X, ShieldAlert, RefreshCw, Users, Layers, Ban, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface Driver {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    driversLicense?: string;
    sinNumber: string;
    profilePhoto?: string;
    selfiePhoto?: string;
    licenseFront?: string;
    licenseBack?: string;
    vehicleRegistration?: string;
    insuranceDocument?: string;
    verificationStatus: "pending" | "approved" | "rejected";
    isVerified: boolean;
    rejectionReason?: string;
    createdAt: string;
}

export default function AdminDriverVerification() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [driverSearch, setDriverSearch] = useState("");
    const [driverFilter, setDriverFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [actionId, setActionId] = useState<string | null>(null);

    const [viewDocsDriver, setViewDocsDriver] = useState<Driver | null>(null);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState("");

    const [rejectingDriverId, setRejectingDriverId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchDrivers();
    }, [token, navigate]);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/drivers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setDrivers(data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load drivers");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDriver = async (id: string) => {
        setActionId(id);
        try {
            const res = await fetch(`/api/admin/drivers/${id}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                toast.success("Driver approved successfully");
                fetchDrivers();
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to approve driver");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setActionId(null);
        }
    };

    const handleRejectDriver = (id: string) => {
        setRejectingDriverId(id);
        setRejectionReason("");
    };

    const confirmRejectDriver = async () => {
        if (!rejectingDriverId) return;
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setActionId(rejectingDriverId);
        try {
            const res = await fetch(`/api/admin/drivers/${rejectingDriverId}/reject`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rejectionReason })
            });

            if (res.ok) {
                toast.success("Driver application rejected");
                setRejectingDriverId(null);
                fetchDrivers();
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to reject driver");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setActionId(null);
        }
    };

    const openPreview = (url: string | undefined, title: string) => {
        if (!url) {
            toast.error(`Missing document: ${title}`);
            return;
        }
        setPreviewDoc(`/${url.replace(/^\//, '')}`);
        setPreviewTitle(title);
    };

    const filteredDrivers = drivers.filter(d => {
        const status = d.verificationStatus || (d.isVerified ? "approved" : "pending");
        if (driverFilter === "pending" && status !== "pending") return false;
        if (driverFilter === "approved" && status !== "approved") return false;
        if (driverFilter === "rejected" && status !== "rejected") return false;

        if (driverSearch.trim()) {
            const q = driverSearch.toLowerCase();
            const name = (d.fullName || "").toLowerCase();
            const email = (d.email || "").toLowerCase();
            const phone = (d.phone || "").toLowerCase();
            const vehicle = (d.vehicleNumber || "").toLowerCase();
            const license = (d.driversLicense || d.licenseNumber || "").toLowerCase();
            return name.includes(q) || email.includes(q) || phone.includes(q) || vehicle.includes(q) || license.includes(q);
        }
        return true;
    });

    const pendingCount = drivers.filter(d => (d.verificationStatus || (d.isVerified ? "approved" : "pending")) === "pending").length;
    const approvedCount = drivers.filter(d => (d.verificationStatus || (d.isVerified ? "approved" : "pending")) === "approved").length;
    const rejectedCount = drivers.filter(d => (d.verificationStatus || (d.isVerified ? "approved" : "pending")) === "rejected").length;

    return (
        <div className="w-full font-sans">

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <UserCheck className="w-6 h-6 text-geo-red" /> Driver Verification
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Review, verify and manage driver compliance credentials</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl relative overflow-hidden">
                    <Users className="absolute top-5 right-5 w-6 h-6 text-gray-500 opacity-20" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Drivers</p>
                    <h2 className="text-2xl font-black mt-2 text-white">{drivers.length}</h2>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden">
                    <Layers className="absolute top-5 right-5 w-6 h-6 text-amber-500 opacity-20" />
                    <p className="text-xs font-bold text-amber-500/80 uppercase tracking-widest">Pending</p>
                    <h2 className="text-2xl font-black mt-2 text-amber-400">{pendingCount}</h2>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden">
                    <CheckCircle className="absolute top-5 right-5 w-6 h-6 text-emerald-500 opacity-20" />
                    <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest">Approved</p>
                    <h2 className="text-2xl font-black mt-2 text-emerald-400">{approvedCount}</h2>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl relative overflow-hidden">
                    <Ban className="absolute top-5 right-5 w-6 h-6 text-rose-500 opacity-20" />
                    <p className="text-xs font-bold text-rose-500/80 uppercase tracking-widest">Rejected</p>
                    <h2 className="text-2xl font-black mt-2 text-rose-400">{rejectedCount}</h2>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl space-y-4">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-2 flex-wrap text-xs font-bold">
                        <button
                            onClick={() => setDriverFilter("all")}
                            className={`px-3 py-1.5 rounded-lg border transition ${driverFilter === "all" ? "bg-white/10 border-white/20 text-white" : "border-transparent text-gray-400 hover:text-white"}`}
                        >
                            All Drivers
                        </button>
                        <button
                            onClick={() => setDriverFilter("pending")}
                            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${driverFilter === "pending" ? "bg-amber-500/20 border-amber-500/30 text-amber-300" : "border-transparent text-gray-400 hover:text-amber-400"}`}
                        >
                            🟡 Pending
                        </button>
                        <button
                            onClick={() => setDriverFilter("approved")}
                            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${driverFilter === "approved" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "border-transparent text-gray-400 hover:text-emerald-400"}`}
                        >
                            🟢 Approved
                        </button>
                        <button
                            onClick={() => setDriverFilter("rejected")}
                            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${driverFilter === "rejected" ? "bg-rose-500/20 border-rose-500/30 text-rose-300" : "border-transparent text-gray-400 hover:text-rose-400"}`}
                        >
                            🔴 Rejected
                        </button>
                    </div>

                    {/* Search Box */}
                    <div className="w-full md:w-72 relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={driverSearch}
                            onChange={(e) => setDriverSearch(e.target.value)}
                            placeholder="Search drivers..."
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-geo-red"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-xs text-gray-500 uppercase font-bold bg-white/[0.01]">
                                <th className="p-4">Profile Photo</th>
                                <th className="p-4">Driver Name</th>
                                <th className="p-4">Email / Phone</th>
                                <th className="p-4">Vehicle Details</th>
                                <th className="p-4">License Number</th>
                                <th className="p-4">Registration Date</th>
                                <th className="p-4">Verification Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                            {filteredDrivers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500 font-semibold">
                                        {loading ? "Loading..." : "No drivers found matching current filter/search."}
                                    </td>
                                </tr>
                            ) : (
                                filteredDrivers.map(d => {
                                    const status = d.verificationStatus || (d.isVerified ? "approved" : "pending");
                                    const dateStr = d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-CA") : "N/A";
                                    return (
                                        <tr key={d.id} className="hover:bg-white/[0.01] transition">
                                            <td className="p-4">
                                                {d.profilePhoto ? (
                                                    <img src={`/${d.profilePhoto.replace(/^\//, '')}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                        <UserCheck className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-white">{d.fullName}</td>
                                            <td className="p-4 text-gray-300">
                                                <div className="text-sm">{d.email}</div>
                                                <div className="text-xs text-gray-500">{d.phone}</div>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="font-bold text-xs">{d.vehicleType || "N/A"}</div>
                                                <div className="font-mono text-xs text-gray-400">{d.vehicleNumber}</div>
                                            </td>
                                            <td className="p-4 font-mono text-xs">{d.driversLicense || d.licenseNumber}</td>
                                            <td className="p-4 text-xs text-gray-400">{dateStr}</td>
                                            <td className="p-4">
                                                {status === "approved" && (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
                                                        🟢 Approved
                                                    </span>
                                                )}
                                                {status === "pending" && (
                                                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
                                                        🟡 Pending
                                                    </span>
                                                )}
                                                {status === "rejected" && (
                                                    <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold px-2.5 py-1 rounded-full" title={d.rejectionReason || "Rejected"}>
                                                        🔴 Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setViewDocsDriver(d)}
                                                        className="text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View Documents
                                                    </button>
                                                    {status !== "approved" && (
                                                        <button
                                                            onClick={() => handleApproveDriver(d.id)}
                                                            disabled={actionId === d.id}
                                                            className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                                                        >
                                                            <Check className="w-3.5 h-3.5" /> Approve
                                                        </button>
                                                    )}
                                                    {status !== "rejected" && (
                                                        <button
                                                            onClick={() => handleRejectDriver(d.id)}
                                                            disabled={actionId === d.id}
                                                            className="text-xs bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Document Viewer Modal */}
            {viewDocsDriver && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-geo-red" />
                                    Driver Documents: {viewDocsDriver.fullName}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Select a document type to preview</p>
                            </div>
                            <button
                                onClick={() => { setViewDocsDriver(null); setPreviewDoc(null); }}
                                className="text-gray-400 hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Document Selection Sidebar */}
                            <div className="w-full md:w-64 border-r border-white/10 bg-black/20 p-4 space-y-2 overflow-y-auto">
                                {[
                                    { id: "profilePhoto", label: "Profile Photo", url: viewDocsDriver.profilePhoto },
                                    { id: "selfiePhoto", label: "Live Selfie", url: viewDocsDriver.selfiePhoto },
                                    { id: "licenseFront", label: "License (Front)", url: viewDocsDriver.licenseFront },
                                    { id: "licenseBack", label: "License (Back)", url: viewDocsDriver.licenseBack },
                                    { id: "vehicleRegistration", label: "Vehicle Reg", url: viewDocsDriver.vehicleRegistration },
                                    { id: "insuranceDocument", label: "Insurance", url: viewDocsDriver.insuranceDocument }
                                ].map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => openPreview(doc.url, doc.label)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition font-bold text-sm flex justify-between items-center ${previewTitle === doc.label
                                            ? "bg-geo-red text-white"
                                            : "bg-white/5 hover:bg-white/10 text-gray-300"
                                            }`}
                                    >
                                        <span>{doc.label}</span>
                                        {doc.url ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Preview Area */}
                            <div className="flex-1 bg-black/40 relative flex flex-col p-6 items-center justify-center min-h-[400px]">
                                {previewDoc ? (
                                    <div className="w-full h-full flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-white uppercase tracking-wider">{previewTitle}</h4>
                                            <a href={previewDoc} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                                                Open in New Tab
                                            </a>
                                        </div>
                                        <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-2">
                                            {previewDoc.toLowerCase().endsWith(".pdf") ? (
                                                <iframe src={previewDoc} className="w-full h-full rounded-lg" title={previewTitle} />
                                            ) : (
                                                <img src={previewDoc} alt={previewTitle} className="max-w-full max-h-full object-contain rounded-lg" />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-widest text-sm">Select Document to View</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {rejectingDriverId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-rose-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center gap-3 text-rose-500 mb-4">
                            <ShieldAlert className="w-6 h-6" />
                            <h3 className="text-xl font-black uppercase">Reject Verification</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Please provide a reason for rejecting this driver's application. This will be sent to the driver.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. License image is blurry, expired insurance..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-rose-500 h-32 mb-6 resize-none"
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRejectingDriverId(null)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRejectDriver}
                                disabled={actionId === rejectingDriverId || !rejectionReason.trim()}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white transition flex items-center gap-2"
                            >
                                {actionId === rejectingDriverId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
