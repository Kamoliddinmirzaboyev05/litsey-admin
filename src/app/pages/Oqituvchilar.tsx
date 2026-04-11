import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Grid3x3, List, Loader2 } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUpload } from "../components/ImageUpload";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface TeacherTranslation {
  position: string;
  subject?: string;
  bio?: string;
  achievements?: string;
}

interface Teacher {
  id: number;
  slug: string;
  full_name: string;
  academic_degree: string;
  academic_rank: string;
  category: string;
  experience_years: number;
  sort_order?: number;
  department?: string | number;
  email: string;
  photo: string;
  is_active: boolean;
  translations: {
    uz: TeacherTranslation;
    ru?: TeacherTranslation;
  };
}

export default function Oqituvchilar() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    academic_degree: "",
    academic_rank: "",
    category: "none",
    experience_years: 0,
    sort_order: 0,
    email: "",
    is_active: true,
    position_uz: "",
    position_ru: "",
    subject_uz: "",
    subject_ru: "",
    bio_uz: "",
    bio_ru: "",
    achievements_uz: "",
    achievements_ru: "",
    department: "",
    photo: null as File | string | null,
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/`);
      const data = await response.json();
      if (response.ok) {
        setTeachers(Array.isArray(data) ? data : data.results || []);
      } else {
        toast.error("O'qituvchilarni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((t) =>
        t.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAdd = () => {
    setEditingTeacher(null);
    setFormData({
      full_name: "",
      academic_degree: "",
      academic_rank: "",
      category: "none",
      experience_years: 0,
      sort_order: 0,
      email: "",
      is_active: true,
      position_uz: "",
      position_ru: "",
      subject_uz: "",
      subject_ru: "",
      bio_uz: "",
      bio_ru: "",
      achievements_uz: "",
      achievements_ru: "",
      department: "",
      photo: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      full_name: teacher.full_name || "",
      academic_degree: teacher.academic_degree || "",
      academic_rank: teacher.academic_rank || "",
      category: teacher.category || "none",
      experience_years: teacher.experience_years || 0,
      sort_order: (teacher as any).sort_order || 0,
      email: teacher.email || "",
      is_active: teacher.is_active,
      position_uz: teacher.translations?.uz?.position || "",
      position_ru: teacher.translations?.ru?.position || "",
      subject_uz: teacher.translations?.uz?.subject || "",
      subject_ru: teacher.translations?.ru?.subject || "",
      bio_uz: teacher.translations?.uz?.bio || "",
      bio_ru: teacher.translations?.ru?.bio || "",
      achievements_uz: teacher.translations?.uz?.achievements || "",
      achievements_ru: teacher.translations?.ru?.achievements || "",
      department: (teacher as any).department || "",
      photo: getImageUrl(teacher.photo),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Ushbu o'qituvchini o'chirmoqchimisiz?")) {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}/teachers/${slug}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          toast.success("O'qituvchi o'chirildi");
          fetchTeachers();
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
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);

    const token = sessionStorage.getItem("auth_token");
    const data = new FormData();

    // Required fields based on API docs
    data.append("full_name", formData.full_name);
    data.append("academic_degree", formData.academic_degree || "");
    data.append("academic_rank", formData.academic_rank || "none");
    data.append("category", formData.category || "none");
    data.append("experience_years", String(formData.experience_years || 0));
    data.append("sort_order", String(formData.sort_order || 0));
    data.append("email", formData.email || "");
    data.append("is_active", String(formData.is_active));
    
    // Translation fields
    data.append("position_uz", formData.position_uz);
    if (formData.position_ru) data.append("position_ru", formData.position_ru);
    if (formData.subject_uz) data.append("subject_uz", formData.subject_uz);
    if (formData.subject_ru) data.append("subject_ru", formData.subject_ru);
    if (formData.bio_uz) data.append("bio_uz", formData.bio_uz);
    if (formData.bio_ru) data.append("bio_ru", formData.bio_ru);
    if (formData.achievements_uz) data.append("achievements_uz", formData.achievements_uz);
    if (formData.achievements_ru) data.append("achievements_ru", formData.achievements_ru);
    
    if (formData.department && formData.department !== "") {
      data.append("department", String(formData.department));
    }

    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    }

    try {
      const url = editingTeacher
        ? `${API_BASE_URL}/teachers/${editingTeacher.slug}/`
        : `${API_BASE_URL}/teachers/`;
      const method = editingTeacher ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success(editingTeacher ? "O'qituvchi tahrirlandi" : "O'qituvchi qo'shildi");
        setIsModalOpen(false);
        fetchTeachers();
      } else {
        const errData = await response.json();
        if (errData && typeof errData === 'object') {
          const errorMessages = Object.entries(errData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          toast.error(errorMessages || "Xatolik yuz berdi");
        } else {
          toast.error("Xatolik yuz berdi");
        }
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
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">O'qituvchilar</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">O'qituvchilar boshqaruvi</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi o'qituvchi qo'shish
        </button>
      </div>

      {/* Search and View Toggle */}
      <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] dark:text-gray-400" />
            <input
              type="text"
              placeholder="O'qituvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#f8fafc] dark:bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${
                viewMode === "table"
                  ? "bg-white dark:bg-gray-700 text-[#0d89b1] shadow-sm"
                  : "text-[#64748b] dark:text-gray-400"
              } transition-all`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 text-[#0d89b1] shadow-sm"
                  : "text-[#64748b] dark:text-gray-400"
              } transition-all`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Display */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 text-[#0d89b1] animate-spin" />
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8fafc] dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    F.I.O
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    Lavozim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    Ilmiy daraja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    Toifa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-[#f8fafc] dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <ImageWithFallback
                        src={getImageUrl(teacher.photo)}
                        alt={teacher.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#1f2937] dark:text-gray-100">
                        {teacher.full_name}
                      </div>
                      <div className="text-xs text-[#64748b] dark:text-gray-400 mt-1">
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748b] dark:text-gray-400">
                        {teacher.translations?.uz?.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748b] dark:text-gray-400">
                        {teacher.academic_degree}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          teacher.category === "highest"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : teacher.category === "first"
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                            : teacher.category === "second"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {teacher.category === "highest" ? "Oliy" : teacher.category === "first" ? "Birinchi" : teacher.category === "second" ? "Ikkinchi" : "Yo'q"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="p-2 text-[#0d89b1] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={getImageUrl(teacher.photo)}
                    alt={teacher.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#1f2937] dark:text-gray-100 truncate">
                      {teacher.full_name}
                    </h3>
                    <p className="text-sm text-[#64748b] dark:text-gray-400 mt-1">
                      {teacher.translations?.uz?.position}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                        teacher.category === "highest"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : teacher.category === "first"
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          : teacher.category === "second"
                          ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {teacher.category === "highest" ? "Oliy" : teacher.category === "first" ? "Birinchi" : teacher.category === "second" ? "Ikkinchi" : "Yo'q"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-[#64748b] dark:text-gray-400">Ilmiy daraja:</span>
                    <p className="text-[#1f2937] dark:text-gray-200 mt-1">{teacher.academic_degree}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#64748b] dark:text-gray-400">Fan:</span>
                    <p className="text-[#1f2937] dark:text-gray-200 mt-1">{teacher.translations?.uz?.subject}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[#0d89b1] bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.slug)}
                    className="px-3 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                  {editingTeacher
                    ? "O'qituvchini tahrirlash"
                    : "Yangi o'qituvchi qo'shish"}
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
                      placeholder="O'qituvchi fotosuratini yuklash uchun bosing"
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

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Ilmiy unvon *
                        </label>
                        <input
                          type="text"
                          value={formData.academic_rank}
                          onChange={(e) => setFormData({ ...formData, academic_rank: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Toifa
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        >
                          <option value="none">Yo'q</option>
                          <option value="highest">Oliy</option>
                          <option value="first">Birinchi</option>
                          <option value="second">Ikkinchi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                          Tajriba (yil)
                        </label>
                        <input
                          type="number"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
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
                          Kafedra ID
                        </label>
                        <input
                          type="number"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        />
                      </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Lavozimi</h3>
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
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Fanlar</h3>
                    <input
                      type="text"
                      placeholder="Fan (UZ)"
                      value={formData.subject_uz}
                      onChange={(e) => setFormData({ ...formData, subject_uz: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Fan (RU)"
                      value={formData.subject_ru}
                      onChange={(e) => setFormData({ ...formData, subject_ru: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Tarjimai hol</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      placeholder="Tarjimai hol (UZ)"
                      value={formData.bio_uz}
                      onChange={(e) => setFormData({ ...formData, bio_uz: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                    <textarea
                      placeholder="Tarjimai hol (RU)"
                      value={formData.bio_ru}
                      onChange={(e) => setFormData({ ...formData, bio_ru: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Yutuqlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      placeholder="Yutuqlar (UZ)"
                      value={formData.achievements_uz}
                      onChange={(e) => setFormData({ ...formData, achievements_uz: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                    <textarea
                      placeholder="Yutuqlar (RU)"
                      value={formData.achievements_ru}
                      onChange={(e) => setFormData({ ...formData, achievements_ru: e.target.value })}
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
                    {editingTeacher ? "Saqlash" : "Qo'shish"}
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
