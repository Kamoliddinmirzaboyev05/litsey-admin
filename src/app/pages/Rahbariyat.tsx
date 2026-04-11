import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUpload } from "../components/ImageUpload";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface ManagementTranslation {
  position: string;
  bio: string;
  reception_hours: string;
}

interface Leader {
  id: number;
  slug: string;
  full_name: string;
  academic_degree: string;
  phone: string;
  email: string;
  photo: string;
  sort_order: number;
  is_active: boolean;
  translations: {
    uz: ManagementTranslation;
    ru: ManagementTranslation;
  };
}

export default function Rahbariyat() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    academic_degree: "",
    phone: "",
    email: "",
    sort_order: 0,
    is_active: true,
    position_uz: "",
    position_ru: "",
    bio_uz: "",
    bio_ru: "",
    reception_hours_uz: "",
    reception_hours_ru: "",
    photo: null as File | string | null,
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/management/`);
      const data = await response.json();
      if (response.ok) {
        setLeaders(Array.isArray(data) ? data : data.results || []);
      } else {
        toast.error("Rahbariyat ma'lumotlarini yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLeader(null);
    setFormData({
      full_name: "",
      academic_degree: "",
      phone: "",
      email: "",
      sort_order: 0,
      is_active: true,
      position_uz: "",
      position_ru: "",
      bio_uz: "",
      bio_ru: "",
      reception_hours_uz: "",
      reception_hours_ru: "",
      photo: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData({
      full_name: leader.full_name || "",
      academic_degree: leader.academic_degree || "",
      phone: leader.phone || "",
      email: leader.email || "",
      sort_order: leader.sort_order || 0,
      is_active: !!leader.is_active,
      position_uz: leader.translations?.uz?.position || "",
      position_ru: leader.translations?.ru?.position || "",
      bio_uz: leader.translations?.uz?.bio || "",
      bio_ru: leader.translations?.ru?.bio || "",
      reception_hours_uz: leader.translations?.uz?.reception_hours || "",
      reception_hours_ru: leader.translations?.ru?.reception_hours || "",
      photo: leader.photo ? getImageUrl(leader.photo) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Ushbu rahbar ma'lumotlarini o'chirmoqchimisiz?")) {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}/management/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          toast.success("Muvaffaqiyatli o'chirildi");
          fetchLeaders();
        } else {
          toast.error("O'chirishda xatolik");
        }
      } catch (error) {
        toast.error("Server bilan bog'lanishda xatolik");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();

    data.append("full_name", formData.full_name);
    data.append("academic_degree", formData.academic_degree || "");
    data.append("phone", formData.phone || "");
    data.append("email", formData.email || "");
    data.append("sort_order", String(formData.sort_order || 0));
    data.append("is_active", String(formData.is_active));
    
    if (formData.position_uz) data.append("position_uz", formData.position_uz);
    if (formData.position_ru) data.append("position_ru", formData.position_ru);
    if (formData.bio_uz) data.append("bio_uz", formData.bio_uz);
    if (formData.bio_ru) data.append("bio_ru", formData.bio_ru);
    if (formData.reception_hours_uz) data.append("reception_hours_uz", formData.reception_hours_uz);
    if (formData.reception_hours_ru) data.append("reception_hours_ru", formData.reception_hours_ru);

    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    }

    try {
      const url = editingLeader
        ? `${API_BASE_URL}/management/${editingLeader.id}/`
        : `${API_BASE_URL}/management/`;
      const method = editingLeader ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success(editingLeader ? "Tahrirlandi" : "Qo'shildi");
        setIsModalOpen(false);
        fetchLeaders();
      } else {
        const errData = await response.json();
        toast.error(errData.detail || "Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">Rahbariyat</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">Litsey rahbariyati boshqaruvi</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi rahbar qo'shish
        </button>
      </div>

      {/* Leaders Display */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 text-[#0d89b1] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-all flex flex-col"
            >
              <div className="p-6 flex-1">
                {/* Photo and basic info */}
                <div className="flex flex-col items-center text-center">
                  <ImageWithFallback
                    src={getImageUrl(leader.photo)}
                    alt={leader.full_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#0d89b1]/10 dark:border-[#0d89b1]/20"
                  />
                  <h3 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mt-4">
                    {leader.full_name}
                  </h3>
                  <p className="text-sm text-[#0d89b1] font-medium mt-1">
                    {leader.translations?.uz?.position}
                  </p>
                  <p className="text-xs text-[#64748b] dark:text-gray-400 mt-1">{leader.academic_degree}</p>
                </div>

                {/* Bio */}
                {leader.translations?.uz?.bio && (
                  <div className="mt-4 p-4 bg-[#f8fafc] dark:bg-gray-800/50 rounded-lg transition-colors">
                    <p className="text-sm text-[#64748b] dark:text-gray-400 leading-relaxed line-clamp-3">
                      {leader.translations.uz.bio}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#64748b] dark:text-gray-400 font-medium min-w-[80px]">
                      Qabul:
                    </span>
                    <span className="text-[#1f2937] dark:text-gray-200">
                      {leader.translations?.uz?.reception_hours || "Ko'rsatilmagan"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#64748b] dark:text-gray-400 font-medium min-w-[80px]">
                      Telefon:
                    </span>
                    <span className="text-[#1f2937] dark:text-gray-200">{leader.phone || "Ko'rsatilmagan"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#64748b] dark:text-gray-400 font-medium min-w-[80px]">
                      Email:
                    </span>
                    <span className="text-[#1f2937] dark:text-gray-200">{leader.email || "Ko'rsatilmagan"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => handleEdit(leader)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(leader.id)}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1f2937] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border dark:border-gray-700 shadow-xl transition-colors">
              <div className="sticky top-0 bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100">
                  {editingLeader ? "Rahbar ma'lumotlarini tahrirlash" : "Yangi rahbar qo'shish"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-[#64748b] dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <ImageUpload
                      label="Foto"
                      value={formData.photo}
                      onChange={(file) => setFormData({ ...formData, photo: file })}
                      placeholder="Rahbar fotosuratini yuklash uchun bosing"
                    />
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                        To'liq ismi *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                        Ilmiy daraja
                      </label>
                      <input
                        type="text"
                        value={formData.academic_degree}
                        onChange={(e) => setFormData({ ...formData, academic_degree: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Saralash tartibi
                        </label>
                        <input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Status
                        </label>
                        <select
                          value={String(formData.is_active)}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        >
                          <option value="true">Faol</option>
                          <option value="false">Nofaol</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Lavozimi</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        placeholder="UZ *"
                        value={formData.position_uz}
                        onChange={(e) => setFormData({ ...formData, position_uz: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        required
                      />
                      <input
                        type="text"
                        placeholder="RU"
                        value={formData.position_ru}
                        onChange={(e) => setFormData({ ...formData, position_ru: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Qabul vaqti</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        placeholder="Qabul vaqti (UZ)"
                        value={formData.reception_hours_uz}
                        onChange={(e) => setFormData({ ...formData, reception_hours_uz: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                      <input
                        type="text"
                        placeholder="Qabul vaqti (RU)"
                        value={formData.reception_hours_ru}
                        onChange={(e) => setFormData({ ...formData, reception_hours_ru: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Biografiya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      placeholder="Biografiya (UZ)"
                      value={formData.bio_uz}
                      onChange={(e) => setFormData({ ...formData, bio_uz: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                    <textarea
                      placeholder="Biografiya (RU)"
                      value={formData.bio_ru}
                      onChange={(e) => setFormData({ ...formData, bio_ru: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 transition-colors">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-[#1f2937] dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingLeader ? "Saqlash" : "Qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
