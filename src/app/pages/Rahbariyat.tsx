import { useState } from "react";
import { Edit, X } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUpload } from "../components/ImageUpload";

interface Leader {
  id: number;
  photo: string;
  fullName: string;
  position: string;
  degree: string;
  reception: string;
  phone: string;
  email: string;
  bio: string;
}

const initialLeaders: Leader[] = [
  {
    id: 1,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    fullName: "Rahmonov Sanjar Abdurahmonovich",
    position: "Litsey direktori",
    degree: "Pedagogika fanlari doktori",
    reception: "Har kuni 14:00-16:00",
    phone: "+998 71 123 45 67",
    email: "s.rahmonov@fdtual.uz",
    bio: "20 yildan ortiq pedagogik tajribaga ega. Respublika miqyosida taniqli ta'lim sohasidagi mutaxassis.",
  },
  {
    id: 2,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    fullName: "Usmanova Nodira Karimovna",
    position: "O'quv ishlari bo'yicha direktor o'rinbosari",
    degree: "Pedagogika fanlari nomzodi",
    reception: "Dushanba, Chorshanba, Juma 15:00-17:00",
    phone: "+998 71 234 56 78",
    email: "n.usmanova@fdtual.uz",
    bio: "15 yillik pedagogik faoliyat. O'quv jarayonini tashkil etish bo'yicha tajribali mutaxassis.",
  },
  {
    id: 3,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    fullName: "Tursunov Otabek Shavkatovich",
    position: "Ma'naviy-ma'rifiy ishlar bo'yicha direktor o'rinbosari",
    degree: "Falsafa fanlari magistri",
    reception: "Seshanba, Payshanba 14:00-16:00",
    phone: "+998 71 345 67 89",
    email: "o.tursunov@fdtual.uz",
    bio: "O'quvchilar bilan ishlash va tarbiyaviy tadbirlarni tashkil etishda katta tajribaga ega.",
  },
];

export default function Rahbariyat() {
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [formData, setFormData] = useState<Partial<Leader>>({});

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData(leader);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeader) {
      setLeaders(
        leaders.map((leader) =>
          leader.id === editingLeader.id ? { ...leader, ...formData } : leader
        )
      );
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Rahbariyat</h1>
        <p className="text-[#64748b] mt-1">Litsey rahbariyati</p>
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Photo and basic info */}
              <div className="flex flex-col items-center text-center">
                <ImageWithFallback
                  src={leader.photo}
                  alt={leader.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0d89b1]/10"
                />
                <h3 className="text-lg font-semibold text-[#1f2937] mt-4">
                  {leader.fullName}
                </h3>
                <p className="text-sm text-[#0d89b1] font-medium mt-1">
                  {leader.position}
                </p>
                <p className="text-xs text-[#64748b] mt-1">{leader.degree}</p>
              </div>

              {/* Bio */}
              <div className="mt-4 p-4 bg-[#f8fafc] rounded-lg">
                <p className="text-sm text-[#64748b] leading-relaxed">
                  {leader.bio}
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-[#64748b] font-medium min-w-[80px]">
                    Qabul:
                  </span>
                  <span className="text-[#1f2937]">{leader.reception}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-[#64748b] font-medium min-w-[80px]">
                    Telefon:
                  </span>
                  <span className="text-[#1f2937]">{leader.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-[#64748b] font-medium min-w-[80px]">
                    Email:
                  </span>
                  <span className="text-[#1f2937]">{leader.email}</span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => handleEdit(leader)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
              >
                <Edit className="w-4 h-4" />
                Tahrirlash
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1f2937]">
                  Rahbar ma'lumotlarini tahrirlash
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <ImageUpload
                  label="Foto"
                  value={formData.photo || ""}
                  onChange={(value) => setFormData({ ...formData, photo: value })}
                  placeholder="Rahbar fotosuratini yuklash uchun bosing"
                />

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    To'liq ismi
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Lavozim
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Ilmiy daraja
                    </label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) =>
                        setFormData({ ...formData, degree: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Biografiya
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Qabul vaqti
                  </label>
                  <input
                    type="text"
                    value={formData.reception}
                    onChange={(e) =>
                      setFormData({ ...formData, reception: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    placeholder="Masalan: Har kuni 14:00-16:00"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-[#1f2937] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
                  >
                    Saqlash
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
