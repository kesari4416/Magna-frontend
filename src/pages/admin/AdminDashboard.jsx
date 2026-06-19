import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Stethoscope, Users, Star, Inbox, LogOut, ExternalLink, CalendarClock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

import DashboardHome from "@/components/admin/DashboardHome";
import ReviewsManager from "@/components/admin/ReviewsManager";
import DoctorsManager from "@/components/admin/DoctorsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import InquiriesManager from "@/components/admin/InquiriesManager";
import AppointmentsManager from "@/components/admin/AppointmentsManager";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard, testid: "admin-nav-dashboard" },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarClock, testid: "admin-nav-appointments" },
  { to: "/admin/reviews", label: "Patient Reviews", icon: Star, testid: "admin-nav-reviews" },
  { to: "/admin/doctors", label: "Doctors", icon: Users, testid: "admin-nav-doctors" },
  { to: "/admin/services", label: "Services", icon: Stethoscope, testid: "admin-nav-services" },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox, testid: "admin-nav-inquiries" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F5EBF1] flex flex-col lg:flex-row" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#A0146A] text-white lg:min-h-screen flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-2">
              <img src="/magna-logo.png" alt="Magna Hospital" className="h-10 w-auto" />
            </div>
            <div>
              <div className="font-heading text-base font-semibold">Magna Admin</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Control Room</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={n.testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <n.icon className="w-4 h-4" /> {n.label}
              {n.label === "Inquiries" && stats?.unresolved_inquiries > 0 && (
                <span className="ml-auto text-[10px] bg-[#F472B6] text-white rounded-full px-2 py-0.5">{stats.unresolved_inquiries}</span>
              )}
              {n.label === "Appointments" && stats?.pending_appointments > 0 && (
                <span className="ml-auto text-[10px] bg-[#F472B6] text-white rounded-full px-2 py-0.5">{stats.pending_appointments}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white" data-testid="admin-view-site">
            <ExternalLink className="w-3 h-3" /> View public site
          </a>
          <div className="px-4 py-2 text-xs text-white/40">{user?.email}</div>
          <button onClick={handleLogout} data-testid="admin-logout" className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <Routes>
          <Route index element={<DashboardHome stats={stats} reload={() => api.get("/admin/stats").then((r) => setStats(r.data))} />} />
          <Route path="appointments" element={<AppointmentsManager />} />
          <Route path="reviews" element={<ReviewsManager />} />
          <Route path="doctors" element={<DoctorsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="inquiries" element={<InquiriesManager />} />
        </Routes>
      </main>
    </div>
  );
}
