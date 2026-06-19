import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { api } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inquiries", form);
      toast.success("Thank you! Our team will reach out to you shortly.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Contact</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            We&apos;re here, anytime you need us.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
            Reach out for appointments, emergency assistance or general inquiries. Our team responds promptly with care.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7">
            <div className="w-11 h-11 rounded-full bg-[#A0146A] text-white grid place-items-center mb-4"><MapPin className="w-5 h-5" /></div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#F472B6] mb-2">Address</div>
            <p className="text-sm text-[#1E1E1E] leading-relaxed">Puchikadu, Vellayambalam,<br />Puthukadai, Pudukadai,<br />Kanyakumari, Tamil Nadu 629171</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7">
            <div className="w-11 h-11 rounded-full bg-[#A0146A] text-white grid place-items-center mb-4"><Phone className="w-5 h-5" /></div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#F472B6] mb-2">Phone</div>
            <a href="tel:+918300134462" className="text-sm text-[#1E1E1E] hover:text-[#A0146A] block">+91 83001 34462</a>
            <a href="tel:+918300134462" className="text-xs text-[#6B7280] mt-1 block">Emergency 24/7</a>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7">
            <div className="w-11 h-11 rounded-full bg-[#A0146A] text-white grid place-items-center mb-4"><Mail className="w-5 h-5" /></div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#F472B6] mb-2">Email</div>
            <a href="mailto:info@magnahospital.com" className="text-sm text-[#1E1E1E] hover:text-[#A0146A]">info@magnahospital.com</a>
          </div>
          <div className="bg-[#F472B6] text-white rounded-2xl p-7">
            <div className="w-11 h-11 rounded-full bg-white/15 grid place-items-center mb-4"><Clock className="w-5 h-5" /></div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/80 mb-2">Hours</div>
            <div className="text-sm">Open <strong>24 hours</strong>, every day of the week.</div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10"
            data-testid="contact-form"
          >
            <h2 className="font-heading text-2xl text-[#A0146A] font-semibold mb-6">Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Full Name</label>
                <input data-testid="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Email</label>
                <input data-testid="contact-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Phone</label>
                <input data-testid="contact-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Subject</label>
                <input data-testid="contact-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors" />
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Message</label>
              <textarea data-testid="contact-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors resize-none" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              data-testid="contact-submit"
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
