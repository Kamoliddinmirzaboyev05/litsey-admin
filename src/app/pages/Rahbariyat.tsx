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
    
    if (!formData.full_name || !formData.position_uz) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring (Ism va Lavozim)");
      return;
    }

    setIsSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();

    // Base fields
    data.append("full_name", formData.full_name);
    data.append("academic_degree", formData.academic_degree || "");
    data.append("phone", formData.phone || "");
    data.append("email", formData.email || "");
    data.append("sort_order", String(formData.sort_order || 0));
    data.append("is_active", formData.is_active ? "true" : "false");
    
    // Translation fields - always append to ensure they exist
    data.append("position_uz", formData.position_uz);
    data.append("position_ru", formData.position_ru || "");
    data.append("bio_uz", formData.bio_uz || "");
    data.append("bio_ru", formData.bio_ru || "");
    data.append("reception_hours_uz", formData.reception_hours_uz || "");
    data.append("reception_hours_ru", formData.reception_hours_ru || "");

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
        toast.success(editingLeader ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
        setIsModalOpen(false);
        fetchLeaders();
      } else {
        const errData = await response.json();
        if (errData && typeof errData === 'object') {
          // Extract error messages from all fields
          const errorMessages = Object.entries(errData)
            .map(([field, msgs]) => {
              const message = Array.isArray(msgs) ? msgs.join(', ') : msgs;
              return `${field}: ${message}`;
            })
            .join('\n');
          toast.error(errorMessages || "Xatolik yuz berdi");
          console.error("API Error Details:", errData);
        } else {
          toast.error("Xatolik yuz berdi");
        }
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
      console.error("Submit error:", error);
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
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Photo and Basic Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <ImageUpload
                        label="Fotosurat"
                        value={formData.photo}
                        onChange={(file) => setFormData({ ...formData, photo: file })}
                        placeholder="Rasm yuklash"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                          To'liq ismi *
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                          placeholder="F.I.Sh."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                            Telefon raqami
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                            placeholder="+998 88 777 88 88"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                            Email manzili
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                            placeholder="example@fdtu.uz"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Translations */}
                  <div className="space-y-6">
                    {/* UZ Translation */}
                    <div className="p-5 bg-[#0d89b1]/5 dark:bg-[#0d89b1]/10 rounded-2xl border border-[#0d89b1]/10 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-[#0d89b1] rounded-full"></span>
                        <h3 className="text-sm font-bold text-[#0d89b1] uppercase tracking-wider">O'zbek tilida</h3>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1 uppercase">Lavozimi *</label>
                        <input
                          type="text"
                          value={formData.position_uz}
                          onChange={(e) => setFormData({ ...formData, position_uz: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                          placeholder="Masalan: Direktor o'rinbosari"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1 uppercase">Qabul vaqti</label>
                        <input
                          type="text"
                          value={formData.reception_hours_uz}
                          onChange={(e) => setFormData({ ...formData, reception_hours_uz: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                          placeholder="Chorshanba-Payshanba, 10:00 - 17:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 ml-1 uppercase">Qisqacha ma'lumot (Bio)</label>
                        <textarea
                          value={formData.bio_uz}
                          onChange={(e) => setFormData({ ...formData, bio_uz: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white resize-none"
                          placeholder="Litsey direktorining o'quv ishlari bo'yicha o'rinbosari"
                        />
                      </div>
                    </div>

                    {/* RU Translation */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Rus tilida</h3>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Lavozimi</label>
                        <input
                          type="text"
                          value={formData.position_ru}
                          onChange={(e) => setFormData({ ...formData, position_ru: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                          placeholder="Например: Заместитель директора"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Qabul vaqti</label>
                        <input
                          type="text"
                          value={formData.reception_hours_ru}
                          onChange={(e) => setFormData({ ...formData, reception_hours_ru: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                          placeholder="Среда-Четверг, 10:00 - 17:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Bio</label>
                        <textarea
                          value={formData.bio_ru}
                          onChange={(e) => setFormData({ ...formData, bio_ru: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white resize-none"
                          placeholder="Заместитель директора по учебной работе..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden/Minimal System Fields */}
                <div className="flex items-center gap-6 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tartib:</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                      className="w-16 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:border-[#0d89b1] outline-none dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">Holati:</label>
                    <select
                      value={String(formData.is_active)}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                      className="px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:border-[#0d89b1] outline-none dark:text-white"
                    >
                      <option value="true">Faol</option>
                      <option value="false">Nofaol</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 transition-colors">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-2.5 bg-[#0d89b1] text-white font-bold rounded-xl hover:bg-[#0a6d8f] shadow-lg shadow-[#0d89b1]/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingLeader ? "O'zgarishlarni saqlash" : "Rahbarni qo'shish"}
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
