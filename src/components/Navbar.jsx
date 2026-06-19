import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass" data-testid="site-navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          <img src="/hospital.png" alt="Magna Hospital" className="h-16 md:h-20 w-auto" style={{ height: "170px", width: "auto", mixBlendMode: "multiply" }}/>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive
                    ? "text-[#A0146A] font-semibold"
                    : "text-[#1E1E1E] hover:text-[#A0146A]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+918300134462"
            data-testid="navbar-phone"
            className="flex items-center gap-2 text-sm text-[#A0146A] font-medium"
          >
            <Phone className="w-4 h-4" /> +91 83001 34462
          </a>
          <Link
            to="/appointments"
            data-testid="book-appointment-btn"
            className="px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158] transition-all hover:-translate-y-0.5"
          >
            Book Appointment
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-[#A0146A]"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `font-body text-base ${isActive ? "text-[#A0146A] font-semibold" : "text-[#1E1E1E]"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/appointments"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium text-center"
              data-testid="mobile-book-appointment-btn"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
