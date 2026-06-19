import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "918300134462"; // +91 83001 34462 — no plus, no spaces
const DEFAULT_MESSAGE = "Hello Magna Hospital, I'd like to know more about your services.";

export const WhatsAppButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-testid="whatsapp-float-btn"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] hover:bg-[#1da856] hover:-translate-y-0.5 transition-all"
    >
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping" />
        <MessageCircle className="w-5 h-5 relative" />
      </span>
      <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
    </a>
  );
};
