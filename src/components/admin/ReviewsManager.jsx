import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Star, X, Play } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";

const EMPTY = { patient_name: "", rating: 5, treatment: "", review_text: "", photo_url: "", video_url: "" };

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState({ image: false, video: false });

  const load = async () => {
    const { data } = await api.get("/admin/reviews");
    setReviews(data || []);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
  };
  const openEdit = (r) => {
    setForm({
      patient_name: r.patient_name, rating: r.rating, treatment: r.treatment || "",
      review_text: r.review_text, photo_url: r.photo_url || "", video_url: r.video_url || "",
    });
    setEditingId(r.id);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/reviews/${editingId}`, form);
        toast.success("Review updated");
      } else {
        await api.post("/admin/reviews", form);
        toast.success("Review added");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await api.delete(`/admin/reviews/${id}`);
    toast.success("Deleted");
    load();
  };

  const handleUpload = async (file, type) => {
    if (!file) return;
    setUploading({ ...uploading, [type]: true });
    const fd = new FormData();
    fd.append("file", file);
    try {
      const endpoint = type === "video" ? "/admin/upload/video" : "/admin/upload/image";
      if (type === "image") fd.append("folder", "reviews");
      const { data } = await api.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (type === "video") setForm((f) => ({ ...f, video_url: data.url }));
      else setForm((f) => ({ ...f, photo_url: data.url }));
      toast.success(`${type === "video" ? "Video" : "Image"} uploaded`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  return (
    <div data-testid="reviews-manager">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-[#A0146A] font-semibold">Patient Reviews</h1>
          <p className="text-sm text-[#6B7280]">Upload photo / video testimonials from patients.</p>
        </div>
        <button onClick={openCreate} data-testid="add-review-btn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158] transition-colors">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FBF7F9] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Media</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Patient</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Treatment</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Rating</th>
              <th className="text-left px-5 py-3 font-medium text-[#6B7280] text-xs uppercase tracking-[0.15em]">Review</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <tr><td colSpan={6} className="text-center text-[#6B7280] py-10">No reviews yet.</td></tr>
            )}
            {reviews.map((r) => (
              <tr key={r.id} className="border-b border-[#E5E7EB] last:border-0">
                <td className="px-5 py-3">
                  {r.video_url ? (
                    <div className="w-16 h-12 bg-black rounded grid place-items-center relative overflow-hidden">
                      {r.photo_url && <img src={mediaUrl(r.photo_url)} alt="" className="w-full h-full object-cover opacity-60" />}
                      <Play className="w-5 h-5 text-white absolute" />
                    </div>
                  ) : r.photo_url ? (
                    <img src={mediaUrl(r.photo_url)} alt={r.patient_name} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-12 bg-[#FBF7F9] rounded" />
                  )}
                </td>
                <td className="px-5 py-3 font-medium text-[#A0146A]">{r.patient_name}</td>
                <td className="px-5 py-3 text-[#6B7280]">{r.treatment}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-[#F472B6] text-[#F472B6]" />)}
                  </div>
                </td>
                <td className="px-5 py-3 text-[#1E1E1E] max-w-xs truncate">{r.review_text}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(r)} data-testid={`edit-review-${r.patient_name}`} className="p-2 hover:bg-[#FBF7F9] rounded"><Pencil className="w-4 h-4 text-[#6B7280]" /></button>
                  <button onClick={() => handleDelete(r.id)} data-testid={`delete-review-${r.patient_name}`} className="p-2 hover:bg-[#FBF7F9] rounded"><Trash2 className="w-4 h-4 text-[#EF4444]" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 my-8" onClick={(e) => e.stopPropagation()} data-testid="review-form-modal">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-[#A0146A] font-semibold">{editingId ? "Edit" : "Add"} Patient Review</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-[#FBF7F9] rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Patient Name</label>
                  <input data-testid="review-input-name" required value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Treatment</label>
                  <input data-testid="review-input-treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A]" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Rating ({form.rating} ★)</label>
                <input data-testid="review-input-rating" type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Review Text</label>
                <textarea data-testid="review-input-text" required rows={4} value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#A0146A] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Photo Upload</label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#A0146A] text-sm text-[#6B7280]">
                    <Upload className="w-4 h-4" /> {uploading.image ? "Uploading..." : "Choose photo"}
                    <input data-testid="review-photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0], "image")} />
                  </label>
                  {form.photo_url && <div className="mt-2 text-xs text-[#10B981]">✓ Photo uploaded</div>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#6B7280] mb-1.5">Video Upload</label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#A0146A] text-sm text-[#6B7280]">
                    <Upload className="w-4 h-4" /> {uploading.video ? "Uploading..." : "Choose video"}
                    <input data-testid="review-video-upload" type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0], "video")} />
                  </label>
                  {form.video_url && <div className="mt-2 text-xs text-[#10B981]">✓ Video uploaded</div>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-5 py-2.5 rounded-full border border-[#E5E7EB] text-[#6B7280] text-sm">Cancel</button>
                <button type="submit" data-testid="review-save-btn" className="flex-1 px-5 py-2.5 rounded-full bg-[#A0146A] text-white text-sm font-medium hover:bg-[#8B1158]">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
