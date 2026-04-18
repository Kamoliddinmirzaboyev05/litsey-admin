import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Loader2, FileText, Download, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";
import { PageSkeleton as SkeletonLoader } from "../components/PageSkeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
interface TranslationField {
  document_name: string;
  note: string;
}

interface TimetableDocument {
  id: number;
  translations: {
    uz: TranslationField;
    ru?: TranslationField;
    en?: TranslationField;
    uz_cyrl?: TranslationField;
  };
  document_file: string;
  is_required: boolean;
  sort_order: number;
}

export default function DarsJadvali() {
  const [timetables, setTimetables] = useState<TimetableDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimetableDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"uz" | "ru">("uz");

  const [formData, setFormData] = useState({
    translations: {
      uz: { document_name: "", note: "" },
      ru: { document_name: "", note: "" },
    },
    document_file: null as File | string | null,
    sort_order: 0,
    is_required: false,
  });

  const languages = [
    { id: "uz", label: "O'zbekcha" },
    { id: "ru", label: "Русский" },
    // { id: "en", label: "English" },
    // { id: "uz_cyrl", label: "Криллcha" },
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
        const results = Array.isArray(data) ? data : data.results || [];
        setTimetables(results);
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
      translations: {
        uz: { document_name: "", note: "" },
        ru: { document_name: "", note: "" },
      },
      document_file: null,
      sort_order: timetables.length,
      is_required: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TimetableDocument) => {
    setEditingItem(item);
    setFormData({
      translations: {
        uz: item.translations.uz || { document_name: "", note: "" },
        ru: item.translations.ru || { document_name: "", note: "" },
      },
      document_file: item.document_file ? getImageUrl(item.document_file) : null,
      sort_order: item.sort_order,
      is_required: item.is_required,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/documents/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Jadval o'chirildi");
        fetchTimetables();
      } else {
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.detail || "O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();
    data.append("sort_order", String(formData.sort_order));
    data.append("is_required", formData.is_required ? "true" : "false");

    // Translations fields
    data.append("document_name_uz", formData.translations.uz.document_name || "Hujjat");
    data.append("note_uz", formData.translations.uz.note || ".");
    data.append("document_name_ru", formData.translations.ru.document_name || "Документ");
    data.append("note_ru", formData.translations.ru.note || ".");
    data.append("document_name_en", "Document");
    data.append("note_en", ".");
    data.append("document_name_uz_cyrl", "Ҳужжат");
    data.append("note_uz_cyrl", ".");

    if (formData.document_file instanceof File) {
      data.append("document_file", formData.document_file);
    }

    const uploadWithXHR = () => {
      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            const errorData = JSON.parse(xhr.responseText || "{}");
            reject(new Error(errorData.detail || "Server xatosi"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Tarmoq xatosi")));

        const url = editingItem 
          ? `${API_BASE_URL}/admission/documents/${editingItem.id}/` 
          : `${API_BASE_URL}/admission/documents/`;
        const method = editingItem ? "PATCH" : "POST";

        xhr.open(method, url);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(data);
      });
    };

    try {
      await uploadWithXHR();
      setUploadProgress(100);
      toast.success(editingItem ? "Jadval tahrirlandi" : "Jadval qo'shildi");
      setTimeout(() => {
        setIsModalOpen(false);
        setUploadProgress(0);
      }, 500);
      fetchTimetables();
    } catch (error: any) {
      toast.error(error.message || "Server bilan bog'lanishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonLoader type="grid" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1f2937] p-5 md:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Dars jadvali</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sinf va guruhlar uchun PDF jadvallarni boshqarish</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0d89b1] text-white font-bold rounded-lg hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98] w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Yangi jadval
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {timetables.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-gray-800 rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <FileText className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                {item.is_required && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full uppercase tracking-wider">
                    Majburiy
                  </span>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{item.translations.uz.document_name}</h3>
            {item.translations.uz.note && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{item.translations.uz.note}</p>
            )}
            <a
              href={getImageUrl(item.document_file)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 text-sm"
            >
              <Download className="w-4 h-4" />
              PDF ni ko'rish
            </a>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1f2937] w-full max-w-2xl rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#1f2937] dark:text-gray-100">
                {editingItem ? "Jadvalni tahrirlash" : "Yangi jadval qo'shish"}
              </h3>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveTab(lang.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        activeTab === lang.id 
                          ? "bg-white dark:bg-gray-700 text-[#0d89b1] shadow-sm" 
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="p-5 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
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
                          activeTab === "uz" ? formData.translations.uz.document_name :
                          formData.translations.ru.document_name
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            translations: {
                              ...formData.translations,
                              [activeTab]: {
                                ...formData.translations[activeTab],
                                document_name: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder={`Masalan: 10-A sinf dars jadvali (${activeTab})`}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all text-sm"
                        required={activeTab === "uz"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Izoh ({activeTab.toUpperCase()})
                      </label>
                      <textarea
                        value={
                          activeTab === "uz" ? formData.translations.uz.note :
                          formData.translations.ru.note
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            translations: {
                              ...formData.translations,
                              [activeTab]: {
                                ...formData.translations[activeTab],
                                note: e.target.value
                              }
                            }
                          });
                        }}
                        placeholder="Jadval haqida qisqacha ma'lumot..."
                        rows={2}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">PDF Fayl *</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, document_file: e.target.files?.[0] || null })}
                      className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-[#0d89b1]/10 file:text-[#0d89b1] hover:file:bg-[#0d89b1]/20 cursor-pointer"
                      required={!editingItem}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="is_required_cb"
                      checked={formData.is_required}
                      onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0d89b1] focus:ring-[#0d89b1]"
                    />
                    <label htmlFor="is_required_cb" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      Majburiy hujjat
                    </label>
                  </div>
                </div>

                {isSubmitting && (
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-xs font-bold text-[#0d89b1]">
                      <span>Fayl yuklanmoqda...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-200 dark:border-gray-700">
                      <motion.div
                        className="h-full bg-[#0d89b1] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#0d89b1] text-white font-bold rounded-lg hover:bg-[#0a6d8f] transition-all shadow-xl shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
