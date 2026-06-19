import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

export default function Appointments() {
  const [params] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [step, setStep] = useState(1);
  const [doctorId, setDoctorId] = useState(params.get("doctor") || "");
  const [date, setDate] = useState(formatDate(new Date()));
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ patient_name: "", email: "", phone: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get("/doctors").then((r) => setDoctors(r.data || []));
  }, []);

  useEffect(() => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setSelectedTime("");
    api.get(`/appointments/availability`, { params: { doctor_id: doctorId, date } })
      .then((r) => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, date]);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const today = formatDate(new Date());
  const maxDate = formatDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

  const handleSubmit = async () => {
    if (!selectedDoctor || !date || !selectedTime) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/appointments", {
        ...form,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        appointment_date: date,
        appointment_time: selectedTime,
      });
      setConfirmed(data);
      toast.success("Appointment requested!");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div data-testid="appointment-confirmed" className="max-w-2xl mx-auto px-6 lg:px-12 py-28 text-center">
        <div className="w-20 h-20 rounded-full bg-[#10B981]/10 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold mb-3">Appointment Requested</h1>
        <p className="text-[#6B7280] mb-8">
          Thank you, {confirmed.patient_name}. We&apos;ve received your request and will confirm shortly via phone.
        </p>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm"><span className="text-[#6B7280]">Doctor</span><span className="font-medium text-[#A0146A]">{confirmed.doctor_name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#6B7280]">Date</span><span className="font-medium text-[#A0146A]">{confirmed.appointment_date}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#6B7280]">Time</span><span className="font-medium text-[#A0146A]">{formatTime12(confirmed.appointment_time)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#6B7280]">Status</span><span className="font-medium text-[#F472B6] uppercase tracking-[0.15em] text-xs">{confirmed.status}</span></div>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="appointments-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Book an Appointment</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            Reserve your time. We&apos;ll take care of the rest.
          </h1>
          <p className="mt-5 max-w-2xl text-white/80">Select your preferred doctor, choose a date and confirm an available time slot. Our team will reach out to confirm your appointment.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
          {["Doctor", "Date & Time", "Your Details"].map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-medium transition-colors ${done ? "bg-[#F472B6] text-white" : active ? "bg-[#A0146A] text-white" : "bg-[#E5E7EB] text-[#6B7280]"}`}>
                    {done ? "✓" : n}
                  </div>
                  <span className={`text-xs uppercase tracking-[0.15em] ${active || done ? "text-[#A0146A] font-semibold" : "text-[#6B7280]"} hidden sm:inline`}>{label}</span>
                </div>
                {n < 3 && <div className={`flex-1 h-px mx-3 ${done ? "bg-[#F472B6]" : "bg-[#E5E7EB]"}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10">
          {/* STEP 1 — Doctor */}
          {step === 1 && (
            <div data-testid="step-doctor">
              <h2 className="font-heading text-2xl text-[#A0146A] font-semibold mb-1">Choose your doctor</h2>
              <p className="text-sm text-[#6B7280] mb-6">Pick a specialist for your visit.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((d) => {
                  const selected = d.id === doctorId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDoctorId(d.id)}
                      data-testid={`doctor-select-${d.name}`}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${selected ? "border-[#A0146A] bg-[#A0146A]/5" : "border-[#E5E7EB] hover:border-[#A0146A]/40"}`}
                    >
                      <img src={mediaUrl(d.photo_url)} alt={d.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#F472B6]">{d.specialty}</div>
                        <div className="font-heading text-base text-[#A0146A] font-medium truncate">{d.name}</div>
                        <div className="text-xs text-[#6B7280] truncate">{d.qualifications}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  disabled={!doctorId}
                  onClick={() => setStep(2)}
                  data-testid="step-1-next"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Time */}
          {step === 2 && (
            <div data-testid="step-datetime">
              <h2 className="font-heading text-2xl text-[#A0146A] font-semibold mb-1">Pick date & confirm slot</h2>
              <p className="text-sm text-[#6B7280] mb-6">{selectedDoctor?.name} &middot; {selectedDoctor?.specialty}</p>

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2 flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5" /> Appointment date</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  max={maxDate}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="appointment-date-input"
                  className="w-full md:w-72 px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-3 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Available time slots</label>
                {loadingSlots ? (
                  <div className="text-sm text-[#6B7280]">Loading slots...</div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map((s) => {
                      const isSelected = selectedTime === s.time;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setSelectedTime(s.time)}
                          data-testid={`slot-${s.time}`}
                          className={`px-3 py-2.5 rounded-lg text-sm border transition-colors
                            ${isSelected ? "bg-[#A0146A] text-white border-[#A0146A]" : ""}
                            ${!isSelected && s.available ? "bg-white border-[#E5E7EB] text-[#1E1E1E] hover:border-[#A0146A]" : ""}
                            ${!s.available ? "bg-[#F5EBF1] text-[#9CA3AF] border-[#E5E7EB] line-through cursor-not-allowed" : ""}
                          `}
                        >
                          {formatTime12(s.time)}
                        </button>
                      );
                    })}
                  </div>
                )}
                {!loadingSlots && slots.length > 0 && slots.every((s) => !s.available) && (
                  <div className="mt-4 text-sm text-[#EF4444]">All slots taken for this date — please pick another date.</div>
                )}
              </div>

              <div className="flex justify-between mt-10">
                <button onClick={() => setStep(1)} data-testid="step-2-back" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:bg-[#FBF7F9]">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!selectedTime}
                  onClick={() => setStep(3)}
                  data-testid="step-2-next"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Patient details */}
          {step === 3 && (
            <div data-testid="step-details">
              <h2 className="font-heading text-2xl text-[#A0146A] font-semibold mb-1">Your details</h2>
              <p className="text-sm text-[#6B7280] mb-6">{selectedDoctor?.name} &middot; {date} &middot; {formatTime12(selectedTime)}</p>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Full Name</label>
                  <input required data-testid="appointment-name" value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</label>
                  <input required type="email" data-testid="appointment-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</label>
                  <input required data-testid="appointment-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Reason for visit</label>
                  <textarea rows={3} data-testid="appointment-reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] resize-none" />
                </div>

                <div className="sm:col-span-2 flex justify-between items-center mt-4">
                  <button type="button" onClick={() => setStep(2)} data-testid="step-3-back" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:bg-[#FBF7F9]">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={submitting} data-testid="appointment-submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] disabled:opacity-50 transition-all hover:-translate-y-0.5">
                    {submitting ? "Booking..." : "Confirm Appointment"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
