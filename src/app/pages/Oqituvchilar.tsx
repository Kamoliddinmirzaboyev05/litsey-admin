import { useState } from "react";
import { Plus, Search, Edit, Trash2, X, Grid3x3, List } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUpload } from "../components/ImageUpload";

interface Teacher {
  id: number;
  photo: string;
  fullName: string;
  position: string;
  degree: string;
  category: string;
  achievements: string;
  subjects: string;
  phone: string;
  email: string;
}

const initialTeachers: Teacher[] = [
  {
    id: 1,
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    fullName: "Aliyev Akmal Azizovich",
    position: "Matematika fani o'qituvchisi",
    degree: "Pedagogika fanlari nomzodi",
    category: "Oliy",
    achievements: "Respublika olimpiadasi g'olibi ustozi, O'zbekiston xalq o'qituvchisi",
    subjects: "Matematika, Algebra, Geometriya",
    phone: "+998 90 123 45 67",
    email: "a.aliyev@fdtual.uz",
  },
  {
    id: 2,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    fullName: "Karimova Madina Rustamovna",
    position: "Fizika fani o'qituvchisi",
    degree: "Fizika-matematika fanlari nomzodi",
    category: "Oliy",
    achievements: "Xalqaro olimpiada ishtirokchisi ustozi, 15 yillik pedagogik staj",
    subjects: "Fizika, Astronomiya",
    phone: "+998 91 234 56 78",
    email: "m.karimova@fdtual.uz",
  },
  {
    id: 3,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    fullName: "Normatov Javohir Shavkatovich",
    position: "Kimyo fani o'qituvchisi",
    degree: "Kimyo fanlari nomzodi",
    category: "Birinchi",
    achievements: "Respublika tanlovining g'olibi, Innovatsion metodikalar muallifi",
    subjects: "Kimyo, Ekologiya",
    phone: "+998 93 345 67 89",
    email: "j.normatov@fdtual.uz",
  },
  {
    id: 4,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    fullName: "Tosheva Gulnoza Bahodir qizi",
    position: "Ingliz tili fani o'qituvchisi",
    degree: "Filologiya fanlari magistri",
    category: "Ikkinchi",
    achievements: "CELTA sertifikati egasi, 10 yillik pedagogik tajriba",
    subjects: "Ingliz tili, Adabiyot",
    phone: "+998 94 456 78 90",
    email: "g.tosheva@fdtual.uz",
  },
];

export default function Oqituvchilar() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [formData, setFormData] = useState<Partial<Teacher>>({
    photo: "",
    fullName: "",
    position: "",
    degree: "",
    category: "",
    achievements: "",
    subjects: "",
    phone: "",
    email: "",
  });

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingTeacher(null);
    setFormData({
      photo: "",
      fullName: "",
      position: "",
      degree: "",
      category: "",
      achievements: "",
      subjects: "",
      phone: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu o'qituvchini o'chirmoqchimisiz?")) {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id ? { ...teacher, ...formData } : teacher
        )
      );
    } else {
      const newTeacher: Teacher = {
        id: Math.max(...teachers.map((t) => t.id)) + 1,
        ...formData as Teacher,
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">O'qituvchilar</h1>
          <p className="text-[#64748b] mt-1">O'qituvchilar boshqaruvi</p>
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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="O'qituvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1]"
            />
          </div>
          <div className="flex items-center gap-1 bg-[#f8fafc] rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${
                viewMode === "table"
                  ? "bg-white text-[#0d89b1] shadow-sm"
                  : "text-[#64748b]"
              } transition-colors`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-white text-[#0d89b1] shadow-sm"
                  : "text-[#64748b]"
              } transition-colors`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Display */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    F.I.O
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Lavozim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Ilmiy daraja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Toifa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <ImageWithFallback
                        src={teacher.photo}
                        alt={teacher.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#1f2937]">
                        {teacher.fullName}
                      </div>
                      <div className="text-xs text-[#64748b] mt-1">
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748b]">
                        {teacher.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#64748b]">
                        {teacher.degree}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          teacher.category === "Oliy"
                            ? "bg-green-100 text-green-700"
                            : teacher.category === "Birinchi"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {teacher.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="p-2 text-[#0d89b1] hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={teacher.photo}
                    alt={teacher.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#1f2937] truncate">
                      {teacher.fullName}
                    </h3>
                    <p className="text-sm text-[#64748b] mt-1">
                      {teacher.position}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                        teacher.category === "Oliy"
                          ? "bg-green-100 text-green-700"
                          : teacher.category === "Birinchi"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {teacher.category}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-[#64748b]">Ilmiy daraja:</span>
                    <p className="text-[#1f2937] mt-1">{teacher.degree}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#64748b]">Fanlar:</span>
                    <p className="text-[#1f2937] mt-1">{teacher.subjects}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[#0d89b1] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1f2937]">
                  {editingTeacher
                    ? "O'qituvchini tahrirlash"
                    : "Yangi o'qituvchi qo'shish"}
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
                  placeholder="O'qituvchi fotosuratini yuklash uchun bosing"
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
                    placeholder="Familiya Ism Otasining ismi"
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
                      Toifa
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    >
                      <option value="">Tanlang</option>
                      <option value="Oliy">Oliy</option>
                      <option value="Birinchi">Birinchi</option>
                      <option value="Ikkinchi">Ikkinchi</option>
                    </select>
                  </div>
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
                    placeholder="Masalan: Pedagogika fanlari nomzodi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Fanlar
                  </label>
                  <input
                    type="text"
                    value={formData.subjects}
                    onChange={(e) =>
                      setFormData({ ...formData, subjects: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    placeholder="Masalan: Matematika, Algebra, Geometriya"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Yutuqlar va mukofotlar
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) =>
                      setFormData({ ...formData, achievements: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    placeholder="O'qituvchining yutuqlari va mukofotlarini kiriting"
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
                      placeholder="+998 90 123 45 67"
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
                      placeholder="teacher@fdtual.uz"
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
