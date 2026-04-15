import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Loader2, Image as ImageIcon, Save, Calendar, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";
import { ImageUpload } from "../components/ImageUpload";

interface Album {
  id: number;
  slug: string;
  title_uz: string;
  title_uz_cyrl?: string;
  title_ru?: string;
  title_en?: string;
  description_uz: string;
  description_uz_cyrl?: string;
  description_ru?: string;
  description_en?: string;
  event_date: string;
  cover_image: string;
  is_active: boolean;
  sort_order: number;
}

export default function Galereya() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"uz" | "ru">("uz");

  const [formData, setFormData] = useState({
    title_uz: "",
    title_ru: "",
    description_uz: "",
    description_ru: "",
    event_date: new Date().toISOString().split("T")[0],
    is_active: true,
    sort_order: 0,
    cover_image: null as File | string | null,
  });

  const languages = [
    { id: "uz", label: "O'zbekcha" },
    { id: "ru", label: "Русский" },
    // { id: "en", label: "English" },
    // { id: "uz_cyrl", label: "Криллча" },
  ] as const;

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/gallery/albums/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAlbums(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      toast.error("Albomlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const filteredAlbums = albums.filter((a) =>
    (a.title_uz || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAlbum(null);
    setFormData({
      title_uz: "",
      title_ru: "",
      description_uz: "",
      description_ru: "",
      event_date: new Date().toISOString().split("T")[0],
      is_active: true,
      sort_order: albums.length,
      cover_image: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title_uz: album.title_uz || "",
      title_ru: album.title_ru || "",
      description_uz: album.description_uz || "",
      description_ru: album.description_ru || "",
      event_date: album.event_date || new Date().toISOString().split("T")[0],
      is_active: album.is_active,
      sort_order: album.sort_order || 0,
      cover_image: getImageUrl(album.cover_image),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Ushbu albomni o'chirmoqchimisiz?")) return;
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/gallery/albums/${slug}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Albom o'chirildi");
        fetchAlbums();
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
    
    // Append all fields to FormData
    data.append("title_uz", formData.title_uz);
    data.append("title_ru", formData.title_ru);
    data.append("description_uz", formData.description_uz);
    data.append("description_ru", formData.description_ru);
    data.append("event_date", formData.event_date);
    data.append("is_active", String(formData.is_active));
    data.append("sort_order", String(formData.sort_order));

    if (formData.cover_image instanceof File) {
      data.append("cover_image", formData.cover_image);
    }

    try {
      const url = editingAlbum
        ? `${API_BASE_URL}/gallery/albums/${editingAlbum.slug}/`
        : `${API_BASE_URL}/gallery/albums/`;
      const method = editingAlbum ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        toast.success(editingAlbum ? "Albom tahrirlandi" : "Albom qo'shildi");
        setIsModalOpen(false);
        fetchAlbums();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d89b1]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">Galereya Albomlari</h1>
          <p className="text-[#64748b] dark:text-gray-400 mt-1">
            Tadbirlar va foto-lavhalarni albomlar orqali boshqarish
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#0d89b1] text-white font-bold rounded-xl hover:bg-[#0a6d8f] transition-all shadow-lg shadow-[#0d89b1]/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Yangi albom
        </button>
      </div>

      {/* Search */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0d89b1] transition-colors" />
        <input
          type="text"
          placeholder="Albomlarni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all shadow-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="group bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={getImageUrl(album.cover_image)}
                alt={album.title_uz}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(album)}
                  className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(album.slug)}
                  className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {album.event_date}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-[#1f2937] dark:text-gray-100 text-lg truncate flex-1">
                  {album.title_uz}
                </h3>
                <span className={`w-2.5 h-2.5 rounded-full ${album.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                {album.description_uz || "Tavsif berilmagan."}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Tartib: {album.sort_order}
                </span>
                <span className="text-[10px] text-[#0d89b1] font-bold uppercase tracking-wider">
                  {album.is_active ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredAlbums.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">Albomlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1f2937] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white/80 dark:bg-[#1f2937]/80 backdrop-blur-md px-10 py-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">
                {editingAlbum ? "Albomni tahrirlash" : "Yangi albom yaratish"}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveTab(lang.id as "uz" | "ru")}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
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
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              {/* Language Specific Fields */}
              <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-6">
                <h4 className="text-xs font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-[#0d89b1]" />
                  {languages.find(l => l.id === activeTab)?.label} tilidagi ma'lumotlar
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Albom nomi ({activeTab.toUpperCase()}) {activeTab === "uz" && "*"}
                    </label>
                    <input
                      type="text"
                      value={
                        activeTab === "uz" ? formData.title_uz : formData.title_ru
                      }
                      onChange={(e) => {
                        const field = `title_${activeTab}` as keyof typeof formData;
                        setFormData({ ...formData, [field]: e.target.value });
                      }}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all"
                      required={activeTab === "uz"}
                      placeholder={`${activeTab.toUpperCase()} tilida albom nomini kiriting...`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Tavsif ({activeTab.toUpperCase()})
                    </label>
                    <textarea
                      value={
                        activeTab === "uz" ? formData.description_uz : formData.description_ru
                      }
                      onChange={(e) => {
                        const field = `description_${activeTab}` as keyof typeof formData;
                        setFormData({ ...formData, [field]: e.target.value });
                      }}
                      rows={3}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all resize-none"
                      placeholder={`${activeTab.toUpperCase()} tilida tavsif kiriting...`}
                    />
                  </div>
                </div>
              </div>

              {/* Settings and Cover Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-300" />
                    Asosiy sozlamalar
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tadbir sanasi</label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-[#0d89b1]/10 focus:border-[#0d89b1] outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col justify-end">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 h-[60px]">
                          <input
                            type="checkbox"
                            id="is_active_album"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 rounded-md text-[#0d89b1] focus:ring-[#0d89b1]"
                          />
                          <label htmlFor="is_active_album" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                            Faol holatda
                          </label>
                        </div>
                      </div>
                    </div>

                    {!editingAlbum && (
                      <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          Eslatma
                        </div>
                        <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                          Albom yaratganingizdan so'ng, uning ichiga kirib rasmlar yuklashingiz mumkin bo'ladi.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gray-300" />
                    Muqova rasmi
                  </h4>
                  <ImageUpload
                    label="Albom muqovasi"
                    value={formData.cover_image}
                    onChange={(file) => setFormData({ ...formData, cover_image: file })}
                    placeholder="Muqova rasmini yuklash uchun bosing"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
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
