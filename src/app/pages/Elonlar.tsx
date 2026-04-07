import { useState } from "react";
import { Plus, Search, Edit, Trash2, X, AlertCircle } from "lucide-react";
import { Dialog } from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  important: boolean;
  status: "Aktiv" | "Nofaol";
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Imtihon jadvali e'lon qilindi",
    content: "2026-yil bahorgi imtihonlar jadvali rasmiy ravishda e'lon qilindi...",
    date: "2026-04-06",
    important: true,
    status: "Aktiv",
  },
  {
    id: 2,
    title: "Bayram taqvimi",
    content: "Yaqinlashib kelayotgan bayramlar munosabati bilan dars jadvali...",
    date: "2026-04-04",
    important: false,
    status: "Aktiv",
  },
  {
    id: 3,
    title: "Kutubxona ish vaqti o'zgarishi",
    content: "Bugundan boshlab kutubxona yangi tartibda ishlaydi...",
    date: "2026-04-02",
    important: false,
    status: "Aktiv",
  },
];

export default function Elonlar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    date: "",
    important: false,
    status: "Aktiv",
  });

  const filteredAnnouncements = announcements.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      important: false,
      status: "Aktiv",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu e'lonni o'chirmoqchimisiz?")) {
      setAnnouncements(announcements.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setAnnouncements(
        announcements.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newItem: Announcement = {
        id: Math.max(...announcements.map((a) => a.id)) + 1,
        ...formData as Announcement,
      };
      setAnnouncements([newItem, ...announcements]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">E'lonlar</h1>
          <p className="text-[#64748b] mt-1">E'lonlar boshqaruvi</p>
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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="E'lon qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1]"
          />
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Sarlavha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Mazmuni
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Muhimlik
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
              {filteredAnnouncements.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.important && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-[#1f2937]">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#64748b] line-clamp-2 max-w-md">
                      {item.content}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#64748b]">{item.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.important ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Muhim
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        Oddiy
                      </span>
                    )}
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
                  {editingItem ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
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

                <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-[#1f2937]">
                      Muhim e'lon
                    </label>
                    <p className="text-xs text-[#64748b] mt-1">
                      Muhim e'lonlar alohida ajratiladi
                    </p>
                  </div>
                  <Switch
                    checked={formData.important}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, important: checked })
                    }
                  />
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
