import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, ExternalLink, Plus, Trash2, Edit, FileText, Check, X, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface AdmissionData {
  academic_year: string;
  total_quota: number;
  grant_quota: number;
  contract_quota: number;
  contract_price: string;
  application_start: string;
  application_end: string;
  exam_date: string;
  results_date: string;
  online_apply_url: string;
  is_active: boolean;
}

interface AdmissionDocument {
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

interface AdmissionSubject {
  id: number;
  subject_type: string;
  max_score: number;
  sort_order: number;
  subject_name_uz: string;
  subject_name_ru: string;
  subject_name_en: string;
  subject_name_uz_cyrl: string;
  description_uz: string;
  description_uz_cyrl: string;
  description_ru: string;
  description_en: string;
}

const initialData: AdmissionData = {
  academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  total_quota: 0,
  grant_quota: 0,
  contract_quota: 0,
  contract_price: "",
  application_start: new Date().toISOString().split("T")[0],
  application_end: "",
  exam_date: "",
  results_date: "",
  online_apply_url: "",
  is_active: true,
};

export default function Qabul() {
  const [formData, setFormData] = useState<AdmissionData>(initialData);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAdmission, setCurrentAdmission] = useState<AdmissionData | null>(null);
  
  const [activeTab, setActiveTab] = useState<"uz" | "ru" | "en" | "uz_cyrl">("uz");

  // Documents state
  const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AdmissionDocument | null>(null);
  const [isDocSubmitting, setIsDocSubmitting] = useState(false);
  const [docFormData, setDocFormData] = useState({
    is_required: true,
    sort_order: 0,
    document_name_uz: "",
    document_name_ru: "",
    document_name_en: "",
    document_name_uz_cyrl: "",
    note_uz: "",
    note_uz_cyrl: "",
    note_ru: "",
    note_en: "",
    document_file: null as File | string | null,
  });

  // Subjects state
  const [subjects, setSubjects] = useState<AdmissionSubject[]>([]);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<AdmissionSubject | null>(null);
  const [isSubSubmitting, setIsSubSubmitting] = useState(false);
  const [subFormData, setSubFormData] = useState({
    subject_type: "test",
    max_score: 10,
    sort_order: 0,
    subject_name_uz: "",
    subject_name_ru: "",
    subject_name_en: "",
    subject_name_uz_cyrl: "",
    description_uz: "",
    description_uz_cyrl: "",
    description_ru: "",
    description_en: "",
  });

  const languages = [
    { id: "uz", label: "O'zbekcha" },
    { id: "ru", label: "Русский" },
    { id: "en", label: "English" },
    { id: "uz_cyrl", label: "Криллча" },
  ] as const;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      const [admissionRes, docsRes, subsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admission/current/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/admission/documents/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/admission/subjects/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (admissionRes.ok) {
        const data = await admissionRes.json();
        setCurrentAdmission(data);
        setFormData(data);
      }
      
      if (docsRes.ok) {
        const data = await docsRes.json();
        setDocuments(Array.isArray(data) ? data : data.results || []);
      }

      if (subsRes.ok) {
        const data = await subsRes.json();
        setSubjects(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.total_quota !== formData.grant_quota + formData.contract_quota) {
      toast.error("Jami kvota grant va kontrakt kvotalari yig'indisiga teng bo'lishi kerak");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/current/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Qabul muvaffaqiyatli saqlandi");
        fetchData();
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

  // Document actions
  const handleAddDoc = () => {
    setEditingDoc(null);
    setDocFormData({
      is_required: true,
      sort_order: documents.length,
      document_name_uz: "",
      document_name_ru: "",
      document_name_en: "",
      document_name_uz_cyrl: "",
      note_uz: "",
      note_uz_cyrl: "",
      note_ru: "",
      note_en: "",
      document_file: null,
    });
    setIsDocModalOpen(true);
  };

  const handleEditDoc = (doc: AdmissionDocument) => {
    setEditingDoc(doc);
    setDocFormData({
      is_required: doc.is_required,
      sort_order: doc.sort_order,
      document_name_uz: doc.document_name_uz || "",
      document_name_ru: doc.document_name_ru || "",
      document_name_en: doc.document_name_en || "",
      document_name_uz_cyrl: doc.document_name_uz_cyrl || "",
      note_uz: doc.note_uz || "",
      note_uz_cyrl: doc.note_uz_cyrl || "",
      note_ru: doc.note_ru || "",
      note_en: doc.note_en || "",
      document_file: doc.document_file ? getImageUrl(doc.document_file) : null,
    });
    setIsDocModalOpen(true);
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm("Ushbu hujjatni o'chirmoqchimisiz?")) return;
    
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/documents/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Hujjat o'chirildi");
        fetchData();
      } else {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    }
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDocSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();
    data.append("is_required", String(docFormData.is_required));
    data.append("sort_order", String(docFormData.sort_order));
    data.append("document_name_uz", docFormData.document_name_uz);
    data.append("document_name_ru", docFormData.document_name_ru);
    data.append("document_name_en", docFormData.document_name_en);
    data.append("document_name_uz_cyrl", docFormData.document_name_uz_cyrl);
    data.append("note_uz", docFormData.note_uz);
    data.append("note_uz_cyrl", docFormData.note_uz_cyrl);
    data.append("note_ru", docFormData.note_ru);
    data.append("note_en", docFormData.note_en);

    if (docFormData.document_file instanceof File) {
      data.append("document_file", docFormData.document_file);
    }

    try {
      const url = editingDoc 
        ? `${API_BASE_URL}/admission/documents/${editingDoc.id}/`
        : `${API_BASE_URL}/admission/documents/`;
      const method = editingDoc ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success(editingDoc ? "Hujjat tahrirlandi" : "Hujjat qo'shildi");
        setIsDocModalOpen(false);
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(errData.detail || "Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setIsDocSubmitting(false);
    }
  };

  // Subject actions
  const handleAddSub = () => {
    setEditingSub(null);
    setSubFormData({
      subject_type: "test",
      max_score: 10,
      sort_order: subjects.length,
      subject_name_uz: "",
      subject_name_ru: "",
      subject_name_en: "",
      subject_name_uz_cyrl: "",
      description_uz: "",
      description_uz_cyrl: "",
      description_ru: "",
      description_en: "",
    });
    setIsSubModalOpen(true);
  };

  const handleEditSub = (sub: AdmissionSubject) => {
    setEditingSub(sub);
    setSubFormData({
      subject_type: sub.subject_type || "test",
      max_score: sub.max_score || 10,
      sort_order: sub.sort_order || 0,
      subject_name_uz: sub.subject_name_uz || "",
      subject_name_ru: sub.subject_name_ru || "",
      subject_name_en: sub.subject_name_en || "",
      subject_name_uz_cyrl: sub.subject_name_uz_cyrl || "",
      description_uz: sub.description_uz || "",
      description_uz_cyrl: sub.description_uz_cyrl || "",
      description_ru: sub.description_ru || "",
      description_en: sub.description_en || "",
    });
    setIsSubModalOpen(true);
  };

  const handleDeleteSub = async (id: number) => {
    if (!confirm("Ushbu imtihon fanini o'chirmoqchimisiz?")) return;
    
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/admission/subjects/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Fan o'chirildi");
        fetchData();
      } else {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    
    try {
      const url = editingSub 
        ? `${API_BASE_URL}/admission/subjects/${editingSub.id}/`
        : `${API_BASE_URL}/admission/subjects/`;
      const method = editingSub ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(subFormData),
      });

      if (response.ok) {
        toast.success(editingSub ? "Fan tahrirlandi" : "Fan qo'shildi");
        setIsSubModalOpen(false);
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(errData.detail || "Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setIsSubSubmitting(false);
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
    <div className="p-6 space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">Qabul jarayoni</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">
            Yangi o'quv yili uchun qabul va hujjatlar sozlamalari
          </p>
        </div>
        {currentAdmission && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-green-200 dark:border-green-800 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Faol qabul mavjud
          </div>
        )}
      </div>

      {/* Warning if active admission exists */}
      {currentAdmission && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
            Diqqat! Hozirda faol qabul jarayoni mavjud. Yangi qabul yaratish uchun joriy qabulni to'xtatish yoki yakunlash kerak bo'lishi mumkin. 
            Backend qoidalari bo'yicha faqat bitta faol qabul bo'lishi mumkin.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Basic Info Form */}
        <section className="bg-white dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-[#0d89b1] rounded-full" />
            <h2 className="text-xl font-bold text-[#1f2937] dark:text-gray-100">Asosiy ma'lumotlar</h2>
          </div>
          
          <form onSubmit={handleAdmissionSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    O'quv yili
                  </label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="Masalan: 2024-2025"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Jami kvota
                    </label>
                    <input
                      type="number"
                      value={formData.total_quota}
                      onChange={(e) => setFormData({ ...formData, total_quota: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Grant
                    </label>
                    <input
                      type="number"
                      value={formData.grant_quota}
                      onChange={(e) => setFormData({ ...formData, grant_quota: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Kontrakt
                    </label>
                    <input
                      type="number"
                      value={formData.contract_quota}
                      onChange={(e) => setFormData({ ...formData, contract_quota: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Kontrakt narxi
                  </label>
                  <input
                    type="text"
                    value={formData.contract_price}
                    onChange={(e) => setFormData({ ...formData, contract_price: e.target.value })}
                    placeholder="Masalan: 12 000 000 so'm"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Online ariza URL
                  </label>
                  <div className="relative group">
                    <input
                      type="url"
                      value={formData.online_apply_url}
                      onChange={(e) => setFormData({ ...formData, online_apply_url: e.target.value })}
                      placeholder="https://example.com/apply"
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                    {formData.online_apply_url && (
                      <a 
                        href={formData.online_apply_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d89b1] p-1 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded-md border-gray-300 text-[#0d89b1] focus:ring-[#0d89b1] transition-all"
                  />
                  <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    Hozirda faol (ko'rsatish)
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Qabul boshlanishi
                    </label>
                    <input
                      type="date"
                      value={formData.application_start}
                      onChange={(e) => setFormData({ ...formData, application_start: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Qabul tugashi
                    </label>
                    <input
                      type="date"
                      value={formData.application_end}
                      onChange={(e) => setFormData({ ...formData, application_end: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Imtihon sanasi
                    </label>
                    <input
                      type="date"
                      value={formData.exam_date}
                      onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Natijalar sanasi
                    </label>
                    <input
                      type="date"
                      value={formData.results_date}
                      onChange={(e) => setFormData({ ...formData, results_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-5 bg-[#0d89b1]/5 dark:bg-[#0d89b1]/10 border border-[#0d89b1]/20 rounded-2xl">
                  <h4 className="text-sm font-bold text-[#0d89b1] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Eslatma
                  </h4>
                  <p className="text-xs text-[#0d89b1]/80 dark:text-[#0d89b1]/90 leading-relaxed font-medium">
                    Kiritilgan sanalar va kvotalar asosiy sahifadagi qabul blokida ko'rsatiladi. 
                    Iltimos, ma'lumotlar to'g'riligini qayta tekshiring.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-10 py-3.5 bg-[#0d89b1] text-white font-bold rounded-xl hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Subjects Section */}
        <section className="bg-white dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#0d89b1] rounded-full" />
              <h2 className="text-xl font-bold text-[#1f2937] dark:text-gray-100">Imtihon fanlari</h2>
            </div>
            <button
              onClick={handleAddSub}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[#1f2937] dark:text-gray-100 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Yangi fan qo'shish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <div 
                  key={sub.id}
                  className="group bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-[#0d89b1] transition-all hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      onClick={() => handleEditSub(sub)}
                      className="p-1.5 bg-white dark:bg-gray-700 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSub(sub.id)}
                      className="p-1.5 bg-white dark:bg-gray-700 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-[#0d89b1]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1f2937] dark:text-gray-100 line-clamp-1">{sub.subject_name_uz}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                          Maks ball: {sub.max_score}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded">
                          Sira: {sub.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#64748b] dark:text-gray-400 line-clamp-2 mb-2 h-10">
                    {sub.description_uz || "Tavsif yo'q"}
                  </p>
                  
                  <div className="text-[10px] font-bold text-gray-400 uppercase">
                    Turi: {sub.subject_type}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Fanlar mavjud emas</p>
              </div>
            )}
          </div>
        </section>

        {/* Documents Section */}
        <section className="bg-white dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#0d89b1] rounded-full" />
              <h2 className="text-xl font-bold text-[#1f2937] dark:text-gray-100">Kerakli hujjatlar</h2>
            </div>
            <button
              onClick={handleAddDoc}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[#1f2937] dark:text-gray-100 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Yangi hujjat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="group bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-[#0d89b1] transition-all hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      onClick={() => handleEditDoc(doc)}
                      className="p-1.5 bg-white dark:bg-gray-700 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 bg-white dark:bg-gray-700 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-[#0d89b1]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1f2937] dark:text-gray-100 line-clamp-1">{doc.document_name_uz}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {doc.is_required && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">
                            Majburiy
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded">
                          Sira: {doc.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#64748b] dark:text-gray-400 line-clamp-2 mb-4 h-10">
                    {doc.note_uz || "Izoh yo'q"}
                  </p>

                  {doc.document_file && (
                    <a 
                      href={getImageUrl(doc.document_file)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-[#0d89b1] hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Faylni ko'rish
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                <FileText className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Hujjatlar mavjud emas</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDocModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1f2937] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white/80 dark:bg-[#1f2937]/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-[#1f2937] dark:text-gray-100">
                {editingDoc ? "Hujjatni tahrirlash" : "Yangi hujjat qo'shish"}
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
                <button 
                  onClick={() => setIsDocModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleDocSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Single language section that switches */}
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2 mb-6">
                      <span className="w-4 h-[1px] bg-[#0d89b1]" />
                      {languages.find(l => l.id === activeTab)?.label} tilidagi ma'lumotlar
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Hujjat nomi ({activeTab.toUpperCase()}) {activeTab === "uz" && "*"}
                        </label>
                        <input
                          type="text"
                          value={
                            activeTab === "uz" ? docFormData.document_name_uz :
                            activeTab === "ru" ? docFormData.document_name_ru :
                            activeTab === "en" ? docFormData.document_name_en :
                            docFormData.document_name_uz_cyrl
                          }
                          onChange={(e) => {
                            const field = `document_name_${activeTab}` as keyof typeof docFormData;
                            setDocFormData({ ...docFormData, [field]: e.target.value });
                          }}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                          required={activeTab === "uz"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Izoh ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          value={
                            activeTab === "uz" ? docFormData.note_uz :
                            activeTab === "ru" ? docFormData.note_ru :
                            activeTab === "en" ? docFormData.note_en :
                            docFormData.note_uz_cyrl
                          }
                          onChange={(e) => {
                            const field = `note_${activeTab}` as keyof typeof docFormData;
                            setDocFormData({ ...docFormData, [field]: e.target.value });
                          }}
                          rows={1}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tartib raqami</label>
                      <input
                        type="number"
                        value={docFormData.sort_order}
                        onChange={(e) => setDocFormData({ ...docFormData, sort_order: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                        <input
                          type="checkbox"
                          checked={docFormData.is_required}
                          onChange={(e) => setDocFormData({ ...docFormData, is_required: e.target.checked })}
                          className="w-5 h-5 rounded-md text-[#0d89b1] focus:ring-[#0d89b1]"
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Majburiy hujjat</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Namuna fayli (PDF, DOCX, JPG...)</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setDocFormData({ ...docFormData, document_file: file });
                        }}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#0d89b1]/10 file:text-[#0d89b1] hover:file:bg-[#0d89b1]/20 cursor-pointer"
                      />
                    </div>
                    {typeof docFormData.document_file === "string" && (
                      <p className="mt-2 text-xs text-[#0d89b1] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Joriy fayl yuklangan
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsDocModalOpen(false)}
                    className="px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isDocSubmitting}
                    className="flex items-center gap-2 px-10 py-3.5 bg-[#0d89b1] text-white font-bold rounded-2xl hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isDocSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Saqlash
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSubModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1f2937] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white/80 dark:bg-[#1f2937]/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-[#1f2937] dark:text-gray-100">
                {editingSub ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
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
                <button 
                  onClick={() => setIsSubModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Single language section that switches */}
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2 mb-6">
                      <span className="w-4 h-[1px] bg-[#0d89b1]" />
                      {languages.find(l => l.id === activeTab)?.label} tilidagi ma'lumotlar
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Fan nomi ({activeTab.toUpperCase()}) {activeTab === "uz" && "*"}
                        </label>
                        <input
                          type="text"
                          value={
                            activeTab === "uz" ? subFormData.subject_name_uz :
                            activeTab === "ru" ? subFormData.subject_name_ru :
                            activeTab === "en" ? subFormData.subject_name_en :
                            subFormData.subject_name_uz_cyrl
                          }
                          onChange={(e) => {
                            const field = `subject_name_${activeTab}` as keyof typeof subFormData;
                            setSubFormData({ ...subFormData, [field]: e.target.value });
                          }}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                          required={activeTab === "uz"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Tavsif ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          value={
                            activeTab === "uz" ? subFormData.description_uz :
                            activeTab === "ru" ? subFormData.description_ru :
                            activeTab === "en" ? subFormData.description_en :
                            subFormData.description_uz_cyrl
                          }
                          onChange={(e) => {
                            const field = `description_${activeTab}` as keyof typeof subFormData;
                            setSubFormData({ ...subFormData, [field]: e.target.value });
                          }}
                          rows={1}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Turi</label>
                      <select
                        value={subFormData.subject_type}
                        onChange={(e) => setSubFormData({ ...subFormData, subject_type: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                      >
                        <option value="test">Test</option>
                        <option value="creative">Ijodiy</option>
                        <option value="interview">Suhbat</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Maks ball *</label>
                      <input
                        type="number"
                        value={subFormData.max_score}
                        onChange={(e) => setSubFormData({ ...subFormData, max_score: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tartib</label>
                      <input
                        type="number"
                        value={subFormData.sort_order}
                        onChange={(e) => setSubFormData({ ...subFormData, sort_order: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSubModalOpen(false)}
                    className="px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubSubmitting}
                    className="flex items-center gap-2 px-10 py-3.5 bg-[#0d89b1] text-white font-bold rounded-2xl hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Saqlash
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
