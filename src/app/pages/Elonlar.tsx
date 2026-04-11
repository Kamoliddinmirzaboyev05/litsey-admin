import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "../components/ImageUpload";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface AnnouncementTranslation {
  title: string;
  short_description: string;
  content: string;
}

interface Announcement {
  id: number;
  slug: string;
  translations: {
    uz: AnnouncementTranslation;
    uz_cyrl: AnnouncementTranslation;
    ru: AnnouncementTranslation;
  };
  image: string;
  status: "draft" | "published" | "archived";
  status_display: string;
  is_important: boolean;
  expires_at: string | null;
  published_at: string;
  created_at: string;
}

export default function Elonlar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    status: "draft",
    is_important: false,
    published_at: new Date().toISOString().split("T")[0],
    expires_at: "",
    title_uz: "",
    title_ru: "",
    title_uz_cyrl: "",
    short_description_uz: "",
    short_description_ru: "",
    content_uz: "",
    content_ru: "",
    image: null as File | string | null,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/`);
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(Array.isArray(data) ? data : data.results || []);
      } else {
        toast.error("E'lonlarni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = Array.isArray(announcements)
    ? announcements.filter((item) =>
        item.translations?.uz?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      status: "draft",
      is_important: false,
      published_at: new Date().toISOString().split("T")[0],
      expires_at: "",
      title_uz: "",
      title_ru: "",
      title_uz_cyrl: "",
      short_description_uz: "",
      short_description_ru: "",
      content_uz: "",
      content_ru: "",
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      status: item.status,
      is_important: item.is_important,
      published_at: item.published_at ? item.published_at.split("T")[0] : new Date().toISOString().split("T")[0],
      expires_at: item.expires_at ? item.expires_at.split("T")[0] : "",
      title_uz: item.translations?.uz?.title || "",
      title_ru: item.translations?.ru?.title || "",
      title_uz_cyrl: item.translations?.uz_cyrl?.title || "",
      short_description_uz: item.translations?.uz?.short_description || "",
      short_description_ru: item.translations?.ru?.short_description || "",
      content_uz: item.translations?.uz?.content || "",
      content_ru: item.translations?.ru?.content || "",
      image: getImageUrl(item.image),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Ushbu e'lonni o'chirmoqchimisiz?")) {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}/announcements/${slug}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          toast.success("E'lon o'chirildi");
          fetchAnnouncements();
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

    data.append("status", formData.status);
    data.append("is_important", formData.is_important ? "true" : "false");
    
    const publishedAt = new Date(formData.published_at);
    if (!isNaN(publishedAt.getTime())) {
      data.append("published_at", publishedAt.toISOString());
    }

    if (formData.expires_at) {
      const expiresAt = new Date(formData.expires_at);
      if (!isNaN(expiresAt.getTime())) {
        data.append("expires_at", expiresAt.toISOString());
      }
    }

    if (formData.title_uz) data.append("title_uz", formData.title_uz);
    if (formData.title_ru) data.append("title_ru", formData.title_ru);
    if (formData.title_uz_cyrl) data.append("title_uz_cyrl", formData.title_uz_cyrl);
    
    if (formData.short_description_uz) data.append("short_description_uz", formData.short_description_uz);
    if (formData.short_description_ru) data.append("short_description_ru", formData.short_description_ru);
    
    if (formData.content_uz) data.append("content_uz", formData.content_uz);
    if (formData.content_ru) data.append("content_ru", formData.content_ru);

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      const url = editingItem
        ? `${API_BASE_URL}/announcements/${editingItem.slug}/`
        : `${API_BASE_URL}/announcements/`;
      const method = editingItem ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success(editingItem ? "E'lon tahrirlandi" : "E'lon qo'shildi");
        setIsModalOpen(false);
        fetchAnnouncements();
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
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">E'lonlar</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">E'lonlar boshqaruvi</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi e'lon qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] dark:text-gray-400" />
          <input
            type="text"
            placeholder="E'lon qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Rasm
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Sarlavha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Muhimlik
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 text-[#0d89b1] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredAnnouncements.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <ImageWithFallback
                      src={getImageUrl(item.image)}
                      alt={item.translations?.uz?.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.is_important && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-[#1f2937] dark:text-gray-100">
                        {item.translations?.uz?.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#64748b] dark:text-gray-400">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.is_important ? (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                        Muhim
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs rounded">
                        Oddiy
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === "published"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {item.status_display}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-[#0d89b1] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug)}
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

      {/* Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1f2937] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border dark:border-gray-700 shadow-xl transition-colors">
              <div className="sticky top-0 bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10 transition-colors">
                <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100">
                  {editingItem ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-[#64748b] dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    >
                      <option value="draft">Qoralama</option>
                      <option value="published">Nashr etilgan</option>
                      <option value="archived">Arxivlangan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                      Muhimlik
                    </label>
                    <select
                      value={String(formData.is_important)}
                      onChange={(e) => setFormData({ ...formData, is_important: e.target.value === "true" })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    >
                      <option value="false">Oddiy</option>
                      <option value="true">Muhim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                      Nashr sanasi
                    </label>
                    <input
                      type="date"
                      value={formData.published_at}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                      Tugash sanasi
                    </label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Titles */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Sarlavhalar</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">UZ *</label>
                      <input
                        type="text"
                        value={formData.title_uz}
                        onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">RU</label>
                      <input
                        type="text"
                        value={formData.title_ru}
                        onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">Qisqa tavsiflar</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">UZ</label>
                      <textarea
                        value={formData.short_description_uz}
                        onChange={(e) => setFormData({ ...formData, short_description_uz: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">RU</label>
                      <textarea
                        value={formData.short_description_ru}
                        onChange={(e) => setFormData({ ...formData, short_description_ru: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-[#0d89b1] border-b dark:border-gray-700 pb-1">To'liq matnlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">UZ *</label>
                      <textarea
                        value={formData.content_uz}
                        onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                        rows={5}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-1">RU</label>
                      <textarea
                        value={formData.content_ru}
                        onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                        rows={5}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <ImageUpload
                  label="Asosiy rasm"
                  value={formData.image}
                  onChange={(file) => setFormData({ ...formData, image: file })}
                  placeholder="E'lon rasmini yuklash uchun bosing"
                />

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
                    {editingItem ? "Saqlash" : "Qo'shish"}
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
