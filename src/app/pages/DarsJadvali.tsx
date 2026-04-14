import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit, Calendar, ExternalLink, X, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface TimetableDocument {
  id: number;
  is_required: boolean;
  sort_order: number;
  document_name_uz: string;
  document_name_ru: string;
  document_name_en: string;
  document_name_uz_cyrl: string;
  note_uz: string;
  note_uz_cyrl: string;
  note_ru: string;
  note_en: string;
  document_file: string | null;
}

export default function DarsJadvali() {
  const [timetables, setTimetables] = useState<TimetableDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimetableDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"uz" | "ru" | "en" | "uz_cyrl">("uz");

  const [formData, setFormData] = useState({
    document_name_uz: "",
    document_name_ru: "",
    document_name_en: "",
    document_name_uz_cyrl: "",
    note_uz: "",
    note_ru: "",
    note_en: "",
    note_uz_cyrl: "",
    document_file: null as File | string | null,
    sort_order: 0,
  });

  const languages = [
    { id: "uz", label: "O'zbekcha" },
    { id: "ru", label: "Русский" },
    { id: "en", label: "English" },
    { id: "uz_cyrl", label: "Криллcha" },
  ] as const;

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/documents/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const allDocs = Array.isArray(data) ? data : data.results || [];
        // User specifically said to use this endpoint for timetable
        // We filter by name or just show all if they are using it exclusively for this
        // For now, let's show all but allow them to manage
        setTimetables(allDocs);
      }
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      document_name_uz: "",
      document_name_ru: "",
      document_name_en: "",
      document_name_uz_cyrl: "",
      note_uz: "",
      note_ru: "",
      note_en: "",
      note_uz_cyrl: "",
      document_file: null,
      sort_order: timetables.length,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TimetableDocument) => {
    setEditingItem(item);
    setFormData({
      document_name_uz: item.document_name_uz || "",
      document_name_ru: item.document_name_ru || "",
      document_name_en: item.document_name_en || "",
      document_name_uz_cyrl: item.document_name_uz_cyrl || "",
      note_uz: item.note_uz || "",
      note_ru: item.note_ru || "",
      note_en: item.note_en || "",
      note_uz_cyrl: item.note_uz_cyrl || "",
      document_file: item.document_file ? getImageUrl(item.document_file) : null,
      sort_order: item.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ushbu dars jadvalini o'chirmoqchimisiz?")) return;
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/documents/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("O'chirildi");
        fetchTimetables();
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();
    data.append("document_name_uz", formData.document_name_uz);
    data.append("document_name_ru", formData.document_name_ru);
    data.append("document_name_en", formData.document_name_en);
    data.append("document_name_uz_cyrl", formData.document_name_uz_cyrl);
    data.append("note_uz", formData.note_uz);
    data.append("note_ru", formData.note_ru);
    data.append("note_en", formData.note_en);
    data.append("note_uz_cyrl", formData.note_uz_cyrl);
    data.append("sort_order", String(formData.sort_order));
    data.append("is_required", "false"); // Default for timetable

    if (formData.document_file instanceof File) {
      data.append("document_file", formData.document_file);
    }

    try {
      const url = editingItem 
        ? `${API_BASE_URL}/admission/documents/${editingItem.id}/`
        : `${API_BASE_URL}/admission/documents/`;
      const method = editingItem ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success("Saqlandi");
        setIsModalOpen(false);
        fetchTimetables();
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server xatosi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d89b1]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">Dars jadvali</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">
            O'quv dars jadvallarini PDF formatida yuklash va boshqarish
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#0d89b1] text-white font-bold rounded-xl hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Yangi jadval qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timetables.map((item) => (
          <div 
            key={item.id}
            className="group bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#0d89b1]/10 text-[#0d89b1] rounded-2xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#1f2937] dark:text-gray-100 text-lg line-clamp-1">
                  {item.document_name_uz}
                </h3>
                <span className="text-xs text-gray-400 font-medium">Tartib: {item.sort_order}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">
              {item.note_uz || "Ushbu dars jadvali uchun qo'shimcha izoh mavjud emas."}
            </p>

            {item.document_file && (
              <a 
                href={getImageUrl(item.document_file)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-[#0d89b1] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                PDF Jadvalni ko'rish
              </a>
            )}
          </div>
        ))}

        {timetables.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem]">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm mb-4">
              <Calendar className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">Hozircha dars jadvallari yuklanmagan</p>
            <button 
              onClick={handleAdd}
              className="mt-4 text-[#0d89b1] font-bold hover:underline"
            >
              Birinchi jadvalni qo'shish
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1f2937] w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">
                {editingItem ? "Jadvalni tahrirlash" : "Yangi jadval qo'shish"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mr-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveTab(lang.id)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === lang.id 
                          ? "bg-white dark:bg-gray-700 text-[#0d89b1] shadow-sm" 
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2 mb-6">
                    <span className="w-4 h-[1px] bg-[#0d89b1]" />
                    {languages.find(l => l.id === activeTab)?.label} tilidagi ma'lumotlar
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Sinf yoki Guruh nomi ({activeTab.toUpperCase()}) {activeTab === "uz" && "*"}
                      </label>
                      <input
                        type="text"
                        value={
                          activeTab === "uz" ? formData.document_name_uz :
                          activeTab === "ru" ? formData.document_name_ru :
                          activeTab === "en" ? formData.document_name_en :
                          formData.document_name_uz_cyrl
                        }
                        onChange={(e) => {
                          const field = `document_name_${activeTab}` as keyof typeof formData;
                          setFormData({ ...formData, [field]: e.target.value });
                        }}
                        placeholder={`Masalan: 10-A sinf dars jadvali (${activeTab})`}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all"
                        required={activeTab === "uz"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Izoh ({activeTab.toUpperCase()})
                      </label>
                      <textarea
                        value={
                          activeTab === "uz" ? formData.note_uz :
                          activeTab === "ru" ? formData.note_ru :
                          activeTab === "en" ? formData.note_en :
                          formData.note_uz_cyrl
                        }
                        onChange={(e) => {
                          const field = `note_${activeTab}` as keyof typeof formData;
                          setFormData({ ...formData, [field]: e.target.value });
                        }}
                        placeholder="Jadval haqida qisqacha ma'lumot..."
                        rows={2}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tartib raqami</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">PDF Fayl</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, document_file: file });
                        }}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm file:hidden cursor-pointer"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm">
                        {formData.document_file instanceof File ? formData.document_file.name : (formData.document_file ? "Fayl yuklangan" : "Faylni tanlang")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-12 py-4 bg-[#0d89b1] text-white font-bold rounded-2xl hover:bg-[#0a6d8f] transition-all shadow-xl shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
