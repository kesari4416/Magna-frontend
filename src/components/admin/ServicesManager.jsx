import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";

const EMPTY = { name: "", description: "", icon: "Stethoscope", image_url: "" };
const ICON_OPTIONS = ["Stethoscope", "Heart", "Brain", "Baby", "Bone", "Flower2", "Activity"];

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const { data } = await api.get("/services");
    setServices(data || []);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setOpen(true); };
  const openEdit = (s) => {
    setForm({ name: s.name, description: s.description, icon: s.icon || "Stethoscope", image_url: s.image_url || "" });
    setEditingId(s.id);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, form);
        toast.success("Service updated");
      } else {
        await api.post("/admin/services", form);
        toast.success("Service added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await api.delete(`/admin/services/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div data-testid="services-manager">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold">Services</h1>
          <p className="text-sm text-[#6B7280]">Manage medical specialties shown on the public site.</p>
        </div>
        <button onClick={openCreate} data-testid="add-service-btn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158]">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FBF7F9] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Image</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Name</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Icon</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Description</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-[#E5E7EB] last:border-0">
                <td className="px-5 py-3">
                  {s.image_url ? <img src={s.image_url} alt="" className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-[#FBF7F9] rounded" />}
                </td>
                <td className="px-5 py-3 font-medium text-[#A0146A]">{s.name}</td>
                <td className="px-5 py-3 text-[#6B7280]">{s.icon}</td>
                <td className="px-5 py-3 text-[#1E1E1E] max-w-md truncate">{s.description}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(s)} data-testid={`edit-service-${s.name}`} className="p-2 hover:bg-[#FBF7F9] rounded"><Pencil className="w-4 h-4 text-[#6B7280]" /></button>
                  <button onClick={() => handleDelete(s.id)} data-testid={`delete-service-${s.name}`} className="p-2 hover:bg-[#FBF7F9] rounded"><Trash2 className="w-4 h-4 text-[#EF4444]" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 my-8" onClick={(e) => e.stopPropagation()} data-testid="service-form-modal">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-[#A0146A] font-semibold">{editingId ? "Edit" : "Add"} Service</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-[#FBF7F9] rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Name</label>
                  <input data-testid="service-input-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Icon</label>
                  <select data-testid="service-input-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:border-[#A0146A]">
                    {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Description</label>
                <textarea data-testid="service-input-description" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A] resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Image URL</label>
                <input data-testid="service-input-image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-5 py-2.5 rounded-full border border-[#E5E7EB] text-[#6B7280] text-sm">Cancel</button>
                <button type="submit" data-testid="service-save-btn" className="flex-1 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158]">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
