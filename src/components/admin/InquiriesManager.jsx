import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Trash2, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const { data } = await api.get("/admin/inquiries");
    setInquiries(data || []);
  };
  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    await api.put(`/admin/inquiries/${id}/resolve`);
    toast.success("Marked as resolved");
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await api.delete(`/admin/inquiries/${id}`);
    toast.success("Deleted");
    load();
  };

  const filtered = inquiries.filter((i) =>
    filter === "all" ? true : filter === "open" ? !i.is_resolved : i.is_resolved
  );

  return (
    <div data-testid="inquiries-manager">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold">Patient Inquiries</h1>
          <p className="text-sm text-[#6B7280]">Messages submitted through the contact form.</p>
        </div>
        <div className="inline-flex bg-white border border-[#E5E7EB] rounded-full p-1">
          {["all", "open", "resolved"].map((f) => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? "bg-[#A0146A] text-white" : "text-[#6B7280] hover:text-[#A0146A]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl py-16 text-center text-[#6B7280]">No inquiries to show.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((i) => (
            <div key={i.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5" data-testid={`inquiry-${i.name}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-heading text-base text-[#A0146A] font-semibold">{i.name}</div>
                    <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${i.is_resolved ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F472B6]/15 text-[#F472B6]"}`}>
                      {i.is_resolved ? "Resolved" : "Open"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-[#6B7280] flex-wrap">
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1 hover:text-[#A0146A]"><Mail className="w-3 h-3" /> {i.email}</a>
                    <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1 hover:text-[#A0146A]"><Phone className="w-3 h-3" /> {i.phone}</a>
                    {i.subject && <span className="text-[#A0146A] font-medium">— {i.subject}</span>}
                  </div>
                  <p className="text-sm text-[#1E1E1E] mt-3 leading-relaxed">{i.message}</p>
                </div>
                <div className="flex gap-2">
                  {!i.is_resolved && (
                    <button onClick={() => resolve(i.id)} data-testid={`resolve-inquiry-${i.name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] hover:bg-[#10B981]/10 hover:text-[#10B981] hover:border-[#10B981]/30">
                      <Check className="w-3 h-3" /> Resolve
                    </button>
                  )}
                  <button onClick={() => remove(i.id)} data-testid={`delete-inquiry-${i.name}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#E5E7EB] text-[#EF4444] hover:bg-[#FEE]">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
