import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Driver Verification", path: "/admin/driver-verification", icon: <UserCheck className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-white/10 flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow">
              <img src="/logo.png" alt="Geo Rides" className="w-full h-full object-cover rounded" />
            </div>
            <div>
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-lg font-black tracking-tight text-geo-red">GEO</span>
                <span className="text-lg font-black tracking-tight text-white">ADMIN</span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-geo-red text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-gray-900 border-b border-white/10 flex items-center px-4 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <img src="/logo.png" alt="Geo Rides" className="w-full h-full object-cover rounded" />
            </div>
            <span className="font-black text-geo-red text-lg">GEO</span>
          </Link>
          <button onClick={handleLogout} className="text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 relative">
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555529902-5261145633bf?q=80&w=2070&auto=format&fit=crop")' }} />
          <div className="relative z-10 p-4 md:p-8 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
