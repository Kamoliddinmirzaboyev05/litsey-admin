import { useState } from "react";
import { Save } from "lucide-react";

interface AdmissionSettings {
  quota: number;
  minScore: number;
  examSubjects: string;
  requirements: string;
  examDate: string;
  applicationDeadline: string;
  documentsRequired: string;
  tuitionFee: string;
}

const initialSettings: AdmissionSettings = {
  quota: 120,
  minScore: 75,
  examSubjects: "Matematika, Fizika",
  requirements:
    "O'quvchi 9-sinfni muvaffaqiyatli tamomlagan bo'lishi kerak. Imtihonlarda minimal ball to'plagan bo'lishi shart.",
  examDate: "2026-08-15",
  applicationDeadline: "2026-07-31",
  documentsRequired:
    "Pasport nusxasi, Attestat nusxasi, 3x4 fotosurat (4 dona), Tibbiy ko'rik dalolatnomasi",
  tuitionFee: "Bepul (davlat granti asosida)",
};

export default function Qabul() {
  const [settings, setSettings] = useState<AdmissionSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Sozlamalar muvaffaqiyatli saqlandi!");
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937] dark:text-gray-100">Qabul</h1>
        <p className="text-[#64748b] dark:text-gray-400 mt-1">Qabul sozlamalari</p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mb-4">
            Asosiy ma'lumotlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                O'quvchilar kvotasi
              </label>
              <input
                type="number"
                value={settings.quota}
                onChange={(e) =>
                  setSettings({ ...settings, quota: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                Minimal ball
              </label>
              <input
                type="number"
                value={settings.minScore}
                onChange={(e) =>
                  setSettings({ ...settings, minScore: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                Imtihon sanasi
              </label>
              <input
                type="date"
                value={settings.examDate}
                onChange={(e) =>
                  setSettings({ ...settings, examDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
                Ariza topshirish muddati
              </label>
              <input
                type="date"
                value={settings.applicationDeadline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    applicationDeadline: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Exam Subjects */}
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mb-4">
            Imtihon fanlari
          </h2>
          <div>
            <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
              Fanlar ro'yxati (vergul bilan ajrating)
            </label>
            <input
              type="text"
              value={settings.examSubjects}
              onChange={(e) =>
                setSettings({ ...settings, examSubjects: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
              placeholder="Masalan: Matematika, Fizika"
              required
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mb-4">
            Talablar
          </h2>
          <div>
            <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
              Qabul uchun talablar
            </label>
            <textarea
              value={settings.requirements}
              onChange={(e) =>
                setSettings({ ...settings, requirements: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
              required
            />
          </div>
        </div>

        {/* Documents Required */}
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mb-4">
            Kerakli hujjatlar
          </h2>
          <div>
            <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
              Hujjatlar ro'yxati
            </label>
            <textarea
              value={settings.documentsRequired}
              onChange={(e) =>
                setSettings({ ...settings, documentsRequired: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
              placeholder="Har bir hujjatni yangi qatordan kiriting"
              required
            />
          </div>
        </div>

        {/* Tuition Fee */}
        <div className="bg-white dark:bg-[#1f2937] rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-gray-100 mb-4">
            O'qish to'lovi
          </h2>
          <div>
            <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200 mb-2">
              To'lov ma'lumotlari
            </label>
            <input
              type="text"
              value={settings.tuitionFee}
              onChange={(e) =>
                setSettings({ ...settings, tuitionFee: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#0d89b1] dark:text-gray-100 transition-colors"
              placeholder="Masalan: Bepul (davlat granti asosida)"
              required
            />
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
