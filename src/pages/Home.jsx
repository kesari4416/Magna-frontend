import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Stethoscope, Heart, Brain, Baby, Bone, Flower2, Activity,
  Phone, Calendar, ShieldCheck, Award, Users, Clock, Play, Star, MapPin
} from "lucide-react";
import { api, mediaUrl } from "@/lib/api";

const iconMap = { Stethoscope, Heart, Brain, Baby, Bone, Flower2, Activity };

const HERO_IMAGE = "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg";
const ABOUT_IMG = "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200";

export default function Home() {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data || [])).catch(() => {});
    api.get("/doctors").then((r) => setDoctors(r.data || [])).catch(() => {});
    api.get("/reviews").then((r) => setReviews(r.data || [])).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Magna Hospital" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A0146A]/85 via-[#A0146A]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28 lg:py-40 grid lg:grid-cols-2 gap-12">
          <div className="text-white animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs uppercase tracking-[0.25em] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F472B6]" /> Trusted since decades
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
              Healing hands,<br />caring hearts.
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              At Magna Hospital, we blend advanced medicine with deep empathy. Multi-specialty care, 24×7 emergency response, and a team that treats you like family.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointments"
                data-testid="hero-book-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#A0146A] font-medium hover:bg-[#F472B6] hover:text-white transition-all hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" /> Book an Appointment
              </Link>
              <a
                href="tel:+918300134462"
                data-testid="hero-call-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" /> +91 83001 34462
              </a>
            </div>
          </div>

          <div className="hidden lg:flex items-end justify-end">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { v: "24/7", l: "Emergency Care", icon: Clock },
                { v: "50+", l: "Expert Doctors", icon: Users },
                { v: "20+", l: "Specialties", icon: Stethoscope },
                { v: "10k+", l: "Happy Patients", icon: Heart },
              ].map((s, i) => (
                <div key={s.l} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }} data-testid={`hero-stat-${s.l}`}>
                  <s.icon className="w-5 h-5 text-[#F472B6] mb-3" />
                  <div className="font-heading text-3xl font-semibold">{s.v}</div>
                  <div className="text-xs uppercase tracking-[0.15em] text-white/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, t: "NABH Aligned", s: "Quality Standards" },
            { icon: Award, t: "Award Winning", s: "Patient Care" },
            { icon: Clock, t: "24×7 Open", s: "Always Available" },
            { icon: Users, t: "Multispecialty", s: "Under One Roof" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-3" data-testid={`trust-${b.t}`}>
              <div className="w-12 h-12 rounded-full bg-[#FBF7F9] grid place-items-center"><b.icon className="w-5 h-5 text-[#A0146A]" /></div>
              <div>
                <div className="font-heading text-sm font-semibold text-[#A0146A]">{b.t}</div>
                <div className="text-xs text-[#6B7280]">{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Our Specialties</div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight">Care across every life stage</h2>
          </div>
          <Link to="/services" data-testid="view-all-services" className="inline-flex items-center gap-2 text-[#A0146A] font-medium hover:gap-3 transition-all">
            View all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.slice(0, 6).map((s, i) => {
            const Icon = iconMap[s.icon] || Stethoscope;
            const span = i === 0 ? "md:col-span-2 md:row-span-2" : "";
            return (
              <Link
                to="/services"
                key={s.id}
                data-testid={`service-card-${s.name}`}
                className={`group relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover-lift ${span}`}
              >
                <div className={`zoom-img ${i === 0 ? "h-72 md:h-full" : "h-44"}`}>
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#A0146A]/90 via-[#A0146A]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/20 grid place-items-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-heading text-xl text-white font-medium">{s.name}</div>
                  {i === 0 && <div className="text-sm text-white/80 mt-2 max-w-md">{s.description}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="zoom-img rounded-3xl overflow-hidden">
            <img src={ABOUT_IMG} alt="Inside Magna Hospital" className="w-full h-[480px] object-cover" />
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— About Magna</div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight mb-6">
              Where modern medicine meets a familiar warmth.
            </h2>
            <p className="text-base text-[#1E1E1E] leading-relaxed mb-4">
              Magna Hospital is a multi-specialty healthcare facility committed to delivering excellence in patient care. Backed by experienced physicians and modern infrastructure, we treat every patient as part of our extended family.
            </p>
            <p className="text-base text-[#6B7280] leading-relaxed mb-8">
              From routine consultations to advanced surgical interventions, we deliver outcomes with empathy, transparency and a relentless focus on safety.
            </p>
            <Link
              to="/about"
              data-testid="home-about-cta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] transition-all hover:-translate-y-0.5"
            >
              Learn more about us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Meet our doctors</div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight">Expertise you can trust</h2>
          </div>
          <Link to="/doctors" data-testid="view-all-doctors" className="inline-flex items-center gap-2 text-[#A0146A] font-medium hover:gap-3 transition-all">
            All doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((d) => (
            <div key={d.id} data-testid={`doctor-card-${d.name}`} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover-lift">
              <div className="zoom-img h-72">
                <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-[#F472B6] mb-2">{d.specialty}</div>
                <div className="font-heading text-lg text-[#A0146A] font-medium">{d.name}</div>
                <div className="text-sm text-[#6B7280] mt-1">{d.qualifications}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="bg-[#A0146A] text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F472B6]/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 relative">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Patient Stories</div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-12 max-w-2xl">
            Real stories from people we&apos;ve had the privilege to care for.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} data-testid={`review-card-${r.patient_name}`} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
                {r.video_url ? (
                  <div className="relative h-56 bg-black">
                    <video src={mediaUrl(r.video_url)} controls className="w-full h-full object-cover" data-testid="video-review-player" />
                  </div>
                ) : r.photo_url ? (
                  <div className="h-56 zoom-img">
                    <img src={mediaUrl(r.photo_url)} alt={r.patient_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-[#8B1158] to-[#A0146A] grid place-items-center">
                    <Play className="w-10 h-10 text-white/40" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F472B6] text-[#F472B6]" />)}
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed line-clamp-4">&ldquo;{r.review_text}&rdquo;</p>
                  <div className="mt-4 text-sm font-medium">{r.patient_name}</div>
                  <div className="text-xs text-white/50">{r.treatment}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/reviews" data-testid="view-all-reviews" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#A0146A] font-medium hover:bg-[#F472B6] hover:text-white transition-all hover:-translate-y-0.5">
              Read all stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-10 md:p-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight mb-4">Need urgent care?</h2>
            <p className="text-[#6B7280] mb-6 max-w-md">Our emergency unit is open 24 hours a day, every day. Call us or visit us anytime — we are ready when you need us.</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+918300134462" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] transition-all">
                <Phone className="w-4 h-4" /> Emergency Helpline
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#A0146A] text-[#A0146A] font-medium hover:bg-[#A0146A] hover:text-white transition-all">
                <MapPin className="w-4 h-4" /> Get directions
              </Link>
            </div>
          </div>
          <div className="bg-[#FBF7F9] rounded-2xl p-6 border border-[#E5E7EB]">
            <div className="text-xs uppercase tracking-[0.2em] text-[#F472B6] mb-2">Hospital Address</div>
            <div className="font-heading text-lg text-[#A0146A] mb-1">Magna Hospital</div>
            <p className="text-sm text-[#6B7280]">Puchikadu, Vellayambalam, Puthukadai, Pudukadai, Kanyakumari, Tamil Nadu 629171</p>
            <div className="mt-4 text-sm text-[#1E1E1E]">Open <strong className="text-[#A0146A]">24 hours</strong>, every day.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
