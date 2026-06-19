import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#A0146A] text-white mt-20" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="mb-4 inline-block bg-white rounded-2xl p-4">
            <img src="/magna-logo.png" alt="Magna Hospital" className="h-16 w-auto" />
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Delivering compassionate, world-class healthcare with a personal touch. Open 24 hours, every day.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#F472B6] transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-[#F472B6] transition-colors">Services</Link></li>
            <li><Link to="/doctors" className="hover:text-[#F472B6] transition-colors">Our Doctors</Link></li>
            <li><Link to="/reviews" className="hover:text-[#F472B6] transition-colors">Patient Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-[#F472B6] transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60 mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#F472B6]" />
              <span>Puchikadu, Vellayambalam, Pudukadai, Kanyakumari, Tamil Nadu 629171</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F472B6]" />
              <a href="tel:+918300134462" className="hover:text-[#F472B6]">+91 83001 34462</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F472B6]" />
              <a href="mailto:info@magnahospital.com" className="hover:text-[#F472B6]">info@magnahospital.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm uppercase tracking-[0.2em] text-white/60 mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/magna_hospital/" target="_blank" rel="noreferrer" data-testid="footer-instagram" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-[#F472B6] hover:border-[#F472B6] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/magnahospital/" target="_blank" rel="noreferrer" data-testid="footer-facebook" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-[#F472B6] hover:border-[#F472B6] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 text-xs text-white/50 flex flex-col md:flex-row justify-between items-center gap-2">
          <div>© {new Date().getFullYear()} Magna Hospital. All rights reserved.</div>
          <div>Caring beyond cure.</div>
        </div>
      </div>
    </footer>
  );
};
