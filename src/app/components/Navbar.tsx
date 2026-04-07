import { Search, Bell, Globe } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [language, setLanguage] = useState("UZ");

  return (
    <nav className="h-[60px] bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between fixed lg:static top-0 left-0 right-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md ml-14 lg:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d89b1]"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === "UZ" ? "RU" : "UZ")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Globe className="w-5 h-5 text-[#64748b]" />
          <span className="text-sm font-medium text-[#1f2937]">{language}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-[#64748b]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-gray-200">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-[#1f2937]">Admin</p>
            <p className="text-xs text-[#64748b]">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0d89b1]/20">
            <img
              src="/logoicon.png"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}