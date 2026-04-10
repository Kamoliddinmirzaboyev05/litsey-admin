import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Phone, Mail, MapPin, Share2, Building, Calendar } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { toast } from "sonner";
import { API_BASE_URL, getImageUrl } from "../../config/api";

interface Settings {
  id: number;
  established_year: number;
  phone: string;
  email: string;
  website: string;
  logo: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  translations: {
    uz: {
      short_name: string;
      full_name: string;
      address: string;
    };
    ru: {
      short_name: string;
      full_name: string;
      address: string;
    };
    en: {
      short_name: string;
      full_name: string;
      address: string;
    };
  };
}

export default function Sozlamalar() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [formData, setFormData] = useState({
    short_name_uz: "",
    short_name_ru: "",
    short_name_en: "",
    full_name_uz: "",
    full_name_ru: "",
    full_name_en: "",
    address_uz: "",
    address_ru: "",
    established_year: 0,
    phone: "",
    email: "",
    website: "",
    logo: null as File | string | null,
    telegram: "",
    instagram: "",
    facebook: "",
    youtube: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings/`);
      const data = await response.json();
      if (response.ok) {
        // If it's a list, take the first one
        const settingsData = Array.isArray(data) ? data[0] : data.results ? data.results[0] : data;
        if (settingsData) {
          setSettings(settingsData);
          setFormData({
            short_name_uz: settingsData.translations?.uz?.short_name || "",
            short_name_ru: settingsData.translations?.ru?.short_name || "",
            short_name_en: settingsData.translations?.en?.short_name || "",
            full_name_uz: settingsData.translations?.uz?.full_name || "",
            full_name_ru: settingsData.translations?.ru?.full_name || "",
            full_name_en: settingsData.translations?.en?.full_name || "",
            address_uz: settingsData.translations?.uz?.address || "",
            address_ru: settingsData.translations?.ru?.address || "",
            established_year: settingsData.established_year || 0,
            phone: settingsData.phone || "",
            email: settingsData.email || "",
            website: settingsData.website || "",
            logo: getImageUrl(settingsData.logo),
            telegram: settingsData.telegram || "",
            instagram: settingsData.instagram || "",
            facebook: settingsData.facebook || "",
            youtube: settingsData.youtube || "",
          });
        }
      } else {
        toast.error("Sozlamalarni yuklashda xatolik");
      }
    } catch (error) {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem("auth_token");
    const data = new FormData();

    // Required fields
    data.append("short_name_uz", formData.short_name_uz);
    data.append("full_name_uz", formData.full_name_uz);

    // Optional translation fields
    if (formData.short_name_ru) data.append("short_name_ru", formData.short_name_ru);
    if (formData.short_name_en) data.append("short_name_en", formData.short_name_en);
    if (formData.full_name_ru) data.append("full_name_ru", formData.full_name_ru);
    if (formData.full_name_en) data.append("full_name_en", formData.full_name_en);
    if (formData.address_uz) data.append("address_uz", formData.address_uz);
    if (formData.address_ru) data.append("address_ru", formData.address_ru);

    // Other fields
    data.append("established_year", String(formData.established_year || 0));
    data.append("phone", formData.phone || "");
    data.append("email", formData.email || "");
    data.append("website", formData.website || "");
    data.append("telegram", formData.telegram || "");
    data.append("instagram", formData.instagram || "");
    data.append("facebook", formData.facebook || "");
    data.append("youtube", formData.youtube || "");

    if (formData.logo instanceof File) {
      data.append("logo", formData.logo);
    }

    try {
      // Based on documentation, PATCH /settings/ is for partial update
      // and it's a singleton-like collection
      const url = `${API_BASE_URL}/settings/`;
      const method = settings ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        toast.success("Sozlamalar muvaffaqiyatli saqlandi");
        fetchSettings();
      } else {
        const errData = await response.json();
        // Handle validation errors from backend
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
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#0d89b1] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-[#0d89b1]" />
            Sozlamalar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Litseyning umumiy ma'lumotlari va ijtimoiy tarmoqlarini boshqaring
          </p>
        </div>
        <button
          type="submit"
          form="settings-form"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0d89b1] text-white rounded-xl hover:bg-[#0a6d8f] transition-all shadow-lg hover:shadow-[#0d89b1]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-semibold text-lg"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Left Column: General & Logo */}
        <div className="lg:col-span-8 space-y-8">
          {/* Brand Identity */}
          <section className="bg-white dark:bg-[#1f2937] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <Globe className="w-6 h-6 text-[#0d89b1]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Brend ma'lumotlari</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Litsey logotipini yuklash</label>
                <ImageUpload
                  label="Logo"
                  value={formData.logo}
                  onChange={(value) => setFormData({ ...formData, logo: value })}
                  placeholder="Yuklash"
                />
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Qisqa nomi (UZ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.short_name_uz}
                      onChange={(e) => setFormData({ ...formData, short_name_uz: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                      placeholder="Masalan: AT-Termiz"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Tashkil etilgan yil
                    </label>
                    <input
                      type="number"
                      value={formData.established_year}
                      onChange={(e) => setFormData({ ...formData, established_year: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    To'liq nomi (UZ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name_uz}
                    onChange={(e) => setFormData({ ...formData, full_name_uz: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white font-medium"
                    placeholder="Litseyning to'liq nomi..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Other Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0d89b1] rounded-full"></span> Rus tili
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Qisqa nomi (RU)</label>
                    <input
                      type="text"
                      value={formData.short_name_ru}
                      onChange={(e) => setFormData({ ...formData, short_name_ru: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">To'liq nomi (RU)</label>
                    <input
                      type="text"
                      value={formData.full_name_ru}
                      onChange={(e) => setFormData({ ...formData, full_name_ru: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-[#0d89b1] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0d89b1] rounded-full"></span> Ingliz tili
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Qisqa nomi (EN)</label>
                    <input
                      type="text"
                      value={formData.short_name_en}
                      onChange={(e) => setFormData({ ...formData, short_name_en: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">To'liq nomi (EN)</label>
                    <input
                      type="text"
                      value={formData.full_name_en}
                      onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white dark:bg-[#1f2937] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <Phone className="w-6 h-6 text-[#0d89b1]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aloqa ma'lumotlari</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Manzil (UZ)
                  </label>
                  <input
                    type="text"
                    value={formData.address_uz}
                    onChange={(e) => setFormData({ ...formData, address_uz: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Manzil (RU)
                  </label>
                  <input
                    type="text"
                    value={formData.address_ru}
                    onChange={(e) => setFormData({ ...formData, address_ru: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Telefon raqami
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email manzili
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="info@litsey.uz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Veb-sayt
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0d89b1]/20 focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="www.litsey.uz"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Social Networks */}
        <div className="lg:col-span-4">
          <section className="bg-white dark:bg-[#1f2937] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md sticky top-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <Share2 className="w-6 h-6 text-[#0d89b1]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ijtimoiy tarmoqlar</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telegram</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="t.me/litsey"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instagram</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="instagram.com/litsey"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Facebook</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="facebook.com/litsey"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">YouTube</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#0d89b1] outline-none transition-all dark:text-white"
                    placeholder="youtube.com/@litsey"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed font-medium">
                Ijtimoiy tarmoqlar saytning footer (pastki) qismida va aloqa sahifasida ko'rinadi. URL manzillarni to'liq ko'rinishda kiritishingiz tavsiya etiladi.
              </p>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
