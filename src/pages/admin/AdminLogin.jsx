import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin");
      navigate("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF7F9] px-6 py-12" data-testid="admin-login-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#A0146A]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#F472B6]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center" data-testid="login-back-home">
          <img src="/magna-logo.png" alt="Magna Hospital" className="h-20 w-auto" />
        </Link>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-[#F472B6] mb-2">Admin Portal</div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-[#6B7280] mb-7">Manage doctors, services, reviews and inquiries.</p>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  data-testid="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors"
                  placeholder="admin@magnahospital.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-[#6B7280] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  data-testid="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#FBF7F9] focus:outline-none focus:border-[#A0146A] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#A0146A] text-white font-medium hover:bg-[#8B1158] disabled:opacity-50 transition-all"
            >
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <Link to="/" className="block text-center mt-6 text-sm text-[#6B7280] hover:text-[#A0146A]" data-testid="back-to-site">← Back to website</Link>
      </div>
    </div>
  );
}
