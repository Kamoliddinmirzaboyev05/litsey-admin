import { useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUpload } from "../components/ImageUpload";

interface News {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
  status: "Aktiv" | "Nofaol";
}

const initialNews: News[] = [
  {
    id: 1,
    title: "Yangi o'quv yili boshlanishi",
    content: "2026-2027 o'quv yili rasmiy ravishda boshlandi...",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop",
    date: "2026-04-05",
    category: "Ta'lim",
    status: "Aktiv",
  },
  {
    id: 2,
    title: "Olimpiada g'oliblari e'lon qilindi",
    content: "Respublika olimpiadasida litseyimiz o'quvchilari yuqori...",
    image: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=300&h=200&fit=crop",
    date: "2026-04-03",
    category: "Yutuqlar",
    status: "Aktiv",
  },
  {
    id: 3,
    title: "Ochiq eshiklar kuni",
    content: "Litseyda ochiq eshiklar kuni bo'lib o'tdi...",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop",
    date: "2026-04-01",
    category: "Tadbirlar",
    status: "Aktiv",
  },
];

export default function Yangiliklar() {
  const [news, setNews] = useState<News[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<Partial<News>>({
    title: "",
    content: "",
    image: "",
    date: "",
    category: "",
    status: "Aktiv",
  });

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      content: "",
      image: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      status: "Aktiv",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu yangilikni o'chirmoqchimisiz?")) {
      setNews(news.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      setNews(
        news.map((item) =>
          item.id === editingNews.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newItem: News = {
        id: Math.max(...news.map((n) => n.id)) + 1,
        ...formData as News,
      };
      setNews([newItem, ...news]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Yangiliklar</h1>
          <p className="text-[#64748b] mt-1">Yangiliklar boshqaruvi</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi yangilik qo'shish
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Yangilik qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1]"
            />
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Rasm
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Sarlavha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Kategoriya
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#1f2937]">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#64748b] mt-1 line-clamp-1">
                      {item.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#64748b]">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#64748b]">{item.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === "Aktiv"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-[#0d89b1] hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1f2937]">
                  {editingNews ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Sarlavha
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Mazmuni
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                    required
                  />
                </div>

                <ImageUpload
                  label="Rasm"
                  value={formData.image || ""}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  placeholder="Yangilik rasmini yuklash uchun bosing"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Kategoriya
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1f2937] mb-2">
                      Sana
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1f2937] mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Aktiv" | "Nofaol",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d89b1]"
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Nofaol">Nofaol</option>
                  </select>
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
                    {editingNews ? "Saqlash" : "Qo'shish"}
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
