import { useState } from "react";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token in localStorage
        localStorage.setItem("auth_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            username: username,
            role: data.role || "Administrator",
          })
        );
        onLogin();
      } else {
        setError(data.detail || "Login yoki parol noto'g'ri!");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik yuz berdi.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d89b1] to-[#095a75] dark:from-[#095a75] dark:to-[#063a4d] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg flex items-center justify-center p-4 transition-colors">
              <img
                src="/logoicon.png"
                alt="FDTU AL Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FDTU AL</h1>
          <p className="text-white/80">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-2xl p-8 transition-colors border dark:border-gray-700">
          <h2 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100 mb-6 text-center">
            Tizimga kirish
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                Login
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] dark:text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] focus:ring-2 focus:ring-[#0d89b1]/20 transition-all dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="Loginni kiriting"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] dark:text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] focus:ring-2 focus:ring-[#0d89b1]/20 transition-all dark:text-gray-100 dark:placeholder-gray-500"
                  placeholder="Parolni kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0d89b1] transition-colors dark:text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d89b1] text-white rounded-lg hover:bg-[#0a6d8f] transition-colors disabled:opacity-50 font-medium shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kirilmoqda...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Kirish
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-[#f8fafc] dark:bg-gray-800/50 rounded-lg text-center transition-colors">
            <p className="text-sm text-[#64748b] dark:text-gray-400">
              Tizimga kirish uchun:
            </p>
            <p className="text-sm font-medium text-[#1f2937] dark:text-gray-100 mt-1">
              Login: <span className="text-[#0d89b1]">superadmin</span> | Parol:{" "}
              <span className="text-[#0d89b1]">superadmin</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          © 2026 FDTU AL. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
