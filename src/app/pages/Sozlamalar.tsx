import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";

interface GeneralInfo {
  name: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  foundedYear: string;
  logo: string;
}

interface WhyUsFact {
  id: number;
  title: string;
  description: string;
}

const initialGeneralInfo: GeneralInfo = {
  name: "FDTU AL",
  fullName: "Ferghana Davlat Texnika Universiteti Akademik Litseyi",
  address: "Farg'ona viloyati, Farg'ona shahri, Mustaqillik ko'chasi 1",
  phone: "+998 73 244 12 34",
  email: "info@fdtual.uz",
  website: "www.fdtual.uz",
  foundedYear: "2010",
  logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
};

const initialWhyUsFacts: WhyUsFact[] = [
  {
    id: 1,
    title: "Yuqori malakali o'qituvchilar",
    description:
      "Litseyimizda faqat yuqori malakali va tajribali o'qituvchilar dars beradi",
  },
  {
    id: 2,
    title: "Zamonaviy jihozlar",
    description:
      "Laboratoriyalarimiz eng zamonaviy jihozlar bilan jihozlangan",
  },
  {
    id: 3,
    title: "100% universitet qabul ko'rsatkichi",
    description:
      "Barcha bitiruvchilarimiz nufuzli oliy o'quv yurtlariga o'qishga kiradi",
  },
  {
    id: 4,
    title: "Olimpiadalar g'oliblari",
    description:
      "O'quvchilarimiz har yili respublika va xalqaro olimpiadalardan yuqori o'rinlarni egallaydi",
  },
  {
    id: 5,
    title: "Qullay joylashuv",
    description:
      "Litsey shahar markazida joylashgan va barcha transport turlari yaqin",
  },
];

export default function Sozlamalar() {
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(initialGeneralInfo);
  const [whyUsFacts, setWhyUsFacts] = useState<WhyUsFact[]>(initialWhyUsFacts);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Sozlamalar muvaffaqiyatli saqlandi!");
    }, 1000);
  };

  const handleAddFact = () => {
    const newFact: WhyUsFact = {
      id: Math.max(...whyUsFacts.map((f) => f.id)) + 1,
      title: "",
      description: "",
    };
    setWhyUsFacts([...whyUsFacts, newFact]);
  };

  const handleUpdateFact = (id: number, field: keyof WhyUsFact, value: string) => {
    setWhyUsFacts(
      whyUsFacts.map((fact) =>
        fact.id === id ? { ...fact, [field]: value } : fact
      )
    );
  };

  const handleDeleteFact = (id: number) => {
    if (confirm("Ushbu faktni o'chirmoqchimisiz?")) {
      setWhyUsFacts(whyUsFacts.filter((fact) => fact.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Sozlamalar</h1>
        <p className="text-[#64748b] mt-1">Umumiy sozlamalar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
            Litsey haqida umumiy ma'lumot
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Qisqa nomi
                </label>
                <input
                  type="text"
                  value={generalInfo.name}
                  onChange={(e) =>
                    setGeneralInfo({ ...generalInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Tashkil etilgan yili
                </label>
                <input
                  type="text"
                  value={generalInfo.foundedYear}
                  onChange={(e) =>
                    setGeneralInfo({ ...generalInfo, foundedYear: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-2">
                To'liq nomi
              </label>
              <input
                type="text"
                value={generalInfo.fullName}
                onChange={(e) =>
                  setGeneralInfo({ ...generalInfo, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] mb-2">
                Manzil
              </label>
              <input
                type="text"
                value={generalInfo.address}
                onChange={(e) =>
                  setGeneralInfo({ ...generalInfo, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={generalInfo.phone}
                  onChange={(e) =>
                    setGeneralInfo({ ...generalInfo, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={generalInfo.email}
                  onChange={(e) =>
                    setGeneralInfo({ ...generalInfo, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Veb-sayt
                </label>
                <input
                  type="text"
                  value={generalInfo.website}
                  onChange={(e) =>
                    setGeneralInfo({ ...generalInfo, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  required
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="Logo"
                value={generalInfo.logo}
                onChange={(value) =>
                  setGeneralInfo({ ...generalInfo, logo: value })
                }
                placeholder="Litsey logotipini yuklash uchun bosing"
              />
            </div>
          </div>
        </div>

        {/* Why Us Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1f2937]">
              Nima uchun aynan biz?
            </h2>
            <button
              type="button"
              onClick={handleAddFact}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Qo'shish
            </button>
          </div>

          <div className="space-y-4">
            {whyUsFacts.map((fact, index) => (
              <div
                key={fact.id}
                className="p-4 bg-[#f8fafc] rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-[#64748b]">
                    Fakt {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFact(fact.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Sarlavha
                    </label>
                    <input
                      type="text"
                      value={fact.title}
                      onChange={(e) =>
                        handleUpdateFact(fact.id, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1] bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Tavsif
                    </label>
                    <textarea
                      value={fact.description}
                      onChange={(e) =>
                        handleUpdateFact(fact.id, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1] bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
