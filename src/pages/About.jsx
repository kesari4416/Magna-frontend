import { ShieldCheck, HeartHandshake, Sparkles, Users } from "lucide-react";

const values = [
  { icon: HeartHandshake, t: "Compassion", d: "We treat every patient as we would our own family — with kindness, dignity, and respect." },
  { icon: ShieldCheck, t: "Safety First", d: "Strict protocols and modern infrastructure to ensure every procedure is safe and trustworthy." },
  { icon: Sparkles, t: "Excellence", d: "Continuous improvement, clinical research, and learning to deliver the very best outcomes." },
  { icon: Users, t: "Teamwork", d: "Doctors, nurses, technicians and staff working seamlessly together for your wellbeing." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— About Us</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            Caring beyond cure, for over two decades.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
            Magna Hospital is a multi-specialty healthcare destination dedicated to delivering compassionate, modern, and accessible medical care to the people of Tamil Nadu and beyond.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-16">
        <div className="zoom-img rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200" alt="Hospital reception" className="w-full h-[520px] object-cover" />
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Our Story</div>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight mb-6">A hospital built around the people it serves.</h2>
          <p className="text-base text-[#1E1E1E] leading-relaxed mb-4">
            Founded with a vision to bring world-class healthcare closer to home, Magna Hospital has grown into a trusted multi-specialty institution. Our roots are local, but our standards are global.
          </p>
          <p className="text-base text-[#6B7280] leading-relaxed mb-4">
            From an experienced team of physicians and surgeons to a nursing staff trained in modern protocols, every member at Magna shares one purpose — to be the hospital our community can rely on, day or night.
          </p>
          <p className="text-base text-[#6B7280] leading-relaxed">
            We invest in technology and training so that the people who walk through our doors receive care that is both advanced and deeply human.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-10">
          <div className="bg-[#A0146A] text-white rounded-3xl p-10">
            <div className="text-xs uppercase tracking-[0.25em] text-[#F472B6] mb-3">Mission</div>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold mb-4">To heal with skill. To care with heart.</h3>
            <p className="text-white/80 leading-relaxed">
              Provide accessible, ethical and high-quality healthcare to every patient who walks through our doors — regardless of background or circumstance.
            </p>
          </div>
          <div className="bg-[#F472B6] text-white rounded-3xl p-10">
            <div className="text-xs uppercase tracking-[0.25em] text-white/80 mb-3">Vision</div>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold mb-4">A future where great healthcare is never far away.</h3>
            <p className="text-white/90 leading-relaxed">
              To be the most trusted multi-specialty hospital in our region, recognized for clinical excellence and humane care.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Our Values</div>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#A0146A] font-semibold tracking-tight mb-12 max-w-2xl">The four ideas that guide every decision we make.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.t} className="bg-white border border-[#E5E7EB] rounded-2xl p-7 hover-lift" data-testid={`value-${v.t}`}>
              <div className="w-12 h-12 rounded-full bg-[#FBF7F9] grid place-items-center mb-5">
                <v.icon className="w-5 h-5 text-[#A0146A]" />
              </div>
              <div className="font-heading text-lg text-[#A0146A] font-medium mb-2">{v.t}</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
