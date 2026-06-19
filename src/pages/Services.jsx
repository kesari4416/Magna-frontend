import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Heart, Brain, Baby, Bone, Flower2, Activity, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const iconMap = { Stethoscope, Heart, Brain, Baby, Bone, Flower2, Activity };

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get("/services").then((r) => setServices(r.data || [])); }, []);

  return (
    <div data-testid="services-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Our Services</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            Multi-specialty care, all under one roof.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
            Discover comprehensive medical, surgical and diagnostic services delivered by experienced clinicians using modern technology.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = iconMap[s.icon] || Stethoscope;
            return (
              <div key={s.id} data-testid={`services-card-${s.name}`} className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover-lift">
                <div className="zoom-img h-52">
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="w-11 h-11 rounded-full bg-[#FBF7F9] grid place-items-center mb-4">
                    <Icon className="w-5 h-5 text-[#A0146A]" />
                  </div>
                  <div className="font-heading text-xl text-[#A0146A] font-medium mb-2">{s.name}</div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{s.description}</p>
                  <Link to="/appointments" className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-[#A0146A] hover:gap-3 transition-all">
                    Book consultation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
