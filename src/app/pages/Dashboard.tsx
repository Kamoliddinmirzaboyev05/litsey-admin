import { Users, UserCog, Newspaper, Bell, Plus, Eye } from "lucide-react";

const stats = [
  { label: "O'quvchilar", value: "1,234", icon: Users, color: "#0d89b1" },
  { label: "O'qituvchilar", value: "87", icon: UserCog, color: "#0d89b1" },
  { label: "Yangiliklar", value: "156", icon: Newspaper, color: "#0d89b1" },
  { label: "E'lonlar", value: "42", icon: Bell, color: "#0d89b1" },
];

const recentNews = [
  {
    id: 1,
    title: "Yangi o'quv yili boshlanishi",
    date: "2026-04-05",
    status: "Aktiv",
  },
  {
    id: 2,
    title: "Olimpiada g'oliblari e'lon qilindi",
    date: "2026-04-03",
    status: "Aktiv",
  },
  {
    id: 3,
    title: "Ochiq eshiklar kuni",
    date: "2026-04-01",
    status: "Aktiv",
  },
];

const recentAnnouncements = [
  {
    id: 1,
    title: "Imtihon jadvali e'lon qilindi",
    date: "2026-04-06",
    important: true,
  },
  {
    id: 2,
    title: "Bayram taqvimi",
    date: "2026-04-04",
    important: false,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Dashboard</h1>
        <p className="text-[#64748b] mt-1">
          FDTU AL boshqaruv paneliga xush kelibsiz
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#64748b] text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1f2937] mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
          Tez harakatlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 px-4 py-3 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Yangilik qo'shish</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">E'lon qo'shish</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">O'qituvchi qo'shish</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-[#1f2937] rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Saytni ko'rish</span>
          </button>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
            So'ngi yangiliklar
          </h2>
          <div className="space-y-3">
            {recentNews.map((news) => (
              <div
                key={news.id}
                className="flex items-start justify-between p-3 bg-[#f8fafc] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#1f2937]">
                    {news.title}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1">{news.date}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  {news.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#1f2937] mb-4">
            So'ngi e'lonlar
          </h2>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start justify-between p-3 bg-[#f8fafc] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#1f2937]">
                    {announcement.title}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1">
                    {announcement.date}
                  </p>
                </div>
                {announcement.important && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    Muhim
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
