import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";

const EMPTY = { name: "", specialty: "", qualifications: "", experience_years: 0, bio: "", photo_url: "" };

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/doctors");
    setDoctors(data || []);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setOpen(true); };
  const openEdit = (d) => {
    setForm({
      name: d.name, specialty: d.specialty, qualifications: d.qualifications,
      experience_years: d.experience_years || 0, bio: d.bio || "", photo_url: d.photo_url || "",
    });
    setEditingId(d.id);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/doctors/${editingId}`, form);
        toast.success("Doctor updated");
      } else {
        await api.post("/admin/doctors", form);
        toast.success("Doctor added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await api.delete(`/admin/doctors/${id}`);
    toast.success("Deleted");
    load();
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "doctors");
    try {
      const { data } = await api.post("/admin/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, photo_url: data.url }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="doctors-manager">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold">Doctors</h1>
          <p className="text-sm text-[#6B7280]">Manage the hospital&apos;s medical team.</p>
        </div>
        <button onClick={openCreate} data-testid="add-doctor-btn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158]">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((d) => (
          <div key={d.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="h-56 bg-[#FBF7F9]">
              {d.photo_url ? <img src={mediaUrl(d.photo_url)} alt={d.name} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-[0.15em] text-[#F472B6]">{d.specialty}</div>
              <div className="font-heading text-base text-[#A0146A] font-medium">{d.name}</div>
              <div className="text-xs text-[#6B7280] mt-1">{d.qualifications}</div>
              <div className="text-xs text-[#6B7280]">{d.experience_years}+ yrs experience</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(d)} data-testid={`edit-doctor-${d.name}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs border border-[#E5E7EB] hover:bg-[#FBF7F9]"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(d.id)} data-testid={`delete-doctor-${d.name}`} className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs border border-[#E5E7EB] text-[#EF4444] hover:bg-[#FEE]"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 my-8" onClick={(e) => e.stopPropagation()} data-testid="doctor-form-modal">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-[#A0146A] font-semibold">{editingId ? "Edit" : "Add"} Doctor</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-[#FBF7F9] rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Name</label>
                  <input data-testid="doctor-input-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Specialty</label>
                  <input data-testid="doctor-input-specialty" required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Qualifications</label>
                  <input data-testid="doctor-input-qualifications" required value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Experience (years)</label>
                  <input data-testid="doctor-input-experience" type="number" min="0" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value || 0) })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Bio</label>
                <textarea data-testid="doctor-input-bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A] resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Photo</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#A0146A] text-sm text-[#6B7280]">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Choose photo"}
                  <input data-testid="doctor-photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
                </label>
                {form.photo_url && <div className="mt-2 flex items-center gap-2"><img src={mediaUrl(form.photo_url)} alt="" className="w-12 h-12 object-cover rounded" /><span className="text-xs text-[#10B981]">✓ Photo set</span></div>}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-5 py-2.5 rounded-full border border-[#E5E7EB] text-[#6B7280] text-sm">Cancel</button>
                <button type="submit" data-testid="doctor-save-btn" className="flex-1 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158]">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
