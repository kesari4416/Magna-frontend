import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trash2, Mail, Phone, Calendar, Clock, User } from "lucide-react";
import { api } from "@/lib/api";

const STATUS_STYLES = {
  pending: "bg-[#F472B6]/15 text-[#F472B6]",
  confirmed: "bg-[#10B981]/10 text-[#10B981]",
  declined: "bg-[#EF4444]/10 text-[#EF4444]",
  completed: "bg-[#A0146A]/10 text-[#A0146A]",
};

const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const { data } = await api.get("/admin/appointments");
    setAppointments(data || []);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/appointments/${id}/status`, null, { params: { status } });
    toast.success(`Marked as ${status}`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await api.delete(`/admin/appointments/${id}`);
    toast.success("Deleted");
    load();
  };

  const filtered = appointments.filter((a) => (filter === "all" ? true : a.status === filter));

  return (
    <div data-testid="appointments-manager">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold">Appointments</h1>
          <p className="text-sm text-[#6B7280]">Confirm or decline patient appointment requests.</p>
        </div>
        <div className="inline-flex bg-white border border-[#E5E7EB] rounded-full p-1 flex-wrap">
          {["all", "pending", "confirmed", "declined", "completed"].map((f) => (
            <button
              key={f}
              data-testid={`appt-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? "bg-[#A0146A] text-white" : "text-[#6B7280] hover:text-[#A0146A]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl py-16 text-center text-[#6B7280]">No appointments to show.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} data-testid={`appt-${a.patient_name}`} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <div className="font-heading text-base text-[#A0146A] font-semibold">{a.patient_name}</div>
                    <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${STATUS_STYLES[a.status] || STATUS_STYLES.pending}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-[#6B7280]">
                    <span className="inline-flex items-center gap-1.5"><User className="w-3 h-3" /> {a.doctor_name}</span>
                    <span className="inline-flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {a.appointment_date}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" /> {formatTime12(a.appointment_time)}</span>
                    <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#A0146A]"><Phone className="w-3 h-3" /> {a.phone}</a>
                  </div>
                  <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#6B7280] hover:text-[#A0146A]"><Mail className="w-3 h-3" /> {a.email}</a>
                  {a.reason && <p className="text-sm text-[#1E1E1E] mt-3 leading-relaxed bg-[#FBF7F9] p-3 rounded-lg">{a.reason}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.status !== "confirmed" && (
                    <button onClick={() => updateStatus(a.id, "confirmed")} data-testid={`appt-confirm-${a.patient_name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] hover:bg-[#10B981]/10 hover:text-[#10B981] hover:border-[#10B981]/30">
                      <CheckCircle2 className="w-3 h-3" /> Confirm
                    </button>
                  )}
                  {a.status !== "declined" && (
                    <button onClick={() => updateStatus(a.id, "declined")} data-testid={`appt-decline-${a.patient_name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] hover:bg-[#EF4444]/10 hover:text-[#EF4444] hover:border-[#EF4444]/30">
                      <XCircle className="w-3 h-3" /> Decline
                    </button>
                  )}
                  {a.status === "confirmed" && (
                    <button onClick={() => updateStatus(a.id, "completed")} data-testid={`appt-complete-${a.patient_name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] hover:bg-[#A0146A]/10 hover:text-[#A0146A]">
                      Mark Completed
                    </button>
                  )}
                  <button onClick={() => remove(a.id)} data-testid={`appt-delete-${a.patient_name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] text-[#EF4444] hover:bg-[#FEE]">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
