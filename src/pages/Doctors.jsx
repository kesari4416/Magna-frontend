import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Calendar } from "lucide-react";
import { api } from "@/lib/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => { api.get("/doctors").then((r) => setDoctors(r.data || [])); }, []);

  return (
    <div data-testid="doctors-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Our Doctors</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            Doctors who listen, diagnose, and care.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
            A team of experienced consultants and surgeons dedicated to compassionate, evidence-based medicine.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((d) => (
            <div key={d.id} data-testid={`doctors-page-card-${d.name}`} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover-lift">
              <div className="zoom-img h-80">
                <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.18em] text-[#F472B6] mb-2">{d.specialty}</div>
                <div className="font-heading text-xl text-[#A0146A] font-medium mb-3">{d.name}</div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-1">
                  <GraduationCap className="w-4 h-4" /> {d.qualifications}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
                  <Briefcase className="w-4 h-4" /> {d.experience_years}+ years experience
                </div>
                {d.bio && <p className="text-sm text-[#1E1E1E] leading-relaxed mb-4">{d.bio}</p>}
                <Link
                  to={`/appointments?doctor=${d.id}`}
                  data-testid={`doctors-page-book-${d.name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158] transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Book consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
