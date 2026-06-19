import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Stethoscope, Star, Inbox, ArrowRight, CalendarClock } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardHome({ stats }) {
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    api.get("/admin/inquiries").then((r) => setRecentInquiries((r.data || []).slice(0, 5))).catch(() => {});
    api.get("/admin/reviews").then((r) => setRecentReviews((r.data || []).slice(0, 5))).catch(() => {});
    api.get("/admin/appointments").then((r) => setRecentAppointments((r.data || []).slice(0, 5))).catch(() => {});
  }, []);

  const cards = [
    { label: "Appointments", value: stats?.appointments ?? "—", sub: stats?.pending_appointments ? `${stats.pending_appointments} pending` : null, icon: CalendarClock, link: "/admin/appointments", testid: "stat-appointments" },
    { label: "Doctors", value: stats?.doctors ?? "—", icon: Users, link: "/admin/doctors", testid: "stat-doctors" },
    { label: "Services", value: stats?.services ?? "—", icon: Stethoscope, link: "/admin/services", testid: "stat-services" },
    { label: "Reviews", value: stats?.reviews ?? "—", icon: Star, link: "/admin/reviews", testid: "stat-reviews" },
    { label: "Inquiries", value: stats?.inquiries ?? "—", sub: stats?.unresolved_inquiries ? `${stats.unresolved_inquiries} open` : null, icon: Inbox, link: "/admin/inquiries", testid: "stat-inquiries" },
  ];

  return (
    <div data-testid="dashboard-home">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-[#F472B6] mb-2">Overview</div>
        <h1 className="font-heading text-3xl text-[#A0146A] font-semibold">Welcome back, Admin</h1>
        <p className="text-sm text-[#6B7280] mt-1">Here&apos;s what&apos;s happening at Magna Hospital.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            to={c.link}
            key={c.label}
            data-testid={c.testid}
            className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#A0146A] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FBF7F9] grid place-items-center">
                <c.icon className="w-4 h-4 text-[#A0146A]" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A0146A] group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-heading text-3xl text-[#A0146A] font-semibold">{c.value}</div>
            <div className="text-xs uppercase tracking-[0.15em] text-[#6B7280] mt-1">{c.label}</div>
            {c.sub && <div className="text-[10px] text-[#F472B6] font-medium mt-1">{c.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-[#A0146A] font-semibold">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-xs text-[#A0146A] hover:underline">View all</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-sm text-[#6B7280] py-8 text-center">No inquiries yet.</div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((i) => (
                <div key={i.id} className="flex items-start justify-between gap-3 py-2 border-b border-[#E5E7EB] last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#A0146A] truncate">{i.name}</div>
                    <div className="text-xs text-[#6B7280] truncate">{i.subject || i.message.slice(0, 50)}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${i.is_resolved ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F472B6]/10 text-[#F472B6]"}`}>
                    {i.is_resolved ? "Resolved" : "Open"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-[#A0146A] font-semibold">Recent Reviews</h2>
            <Link to="/admin/reviews" className="text-xs text-[#A0146A] hover:underline">Manage</Link>
          </div>
          {recentReviews.length === 0 ? (
            <div className="text-sm text-[#6B7280] py-8 text-center">No reviews yet.</div>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.id} className="py-2 border-b border-[#E5E7EB] last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#A0146A]">{r.patient_name}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-[#F472B6] text-[#F472B6]" />)}
                    </div>
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1 line-clamp-2">{r.review_text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
