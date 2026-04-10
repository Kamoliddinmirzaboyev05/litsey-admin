import { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string | File | null;
  onChange: (value: File | null) => void;
  label: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Rasm yuklash uchun bosing yoki torting",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview("");
    }
  }, [value]);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview("");
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1f2937] dark:text-gray-200">{label}</label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-[#0d89b1] bg-[#0d89b1]/5 dark:bg-[#0d89b1]/10"
              : "border-gray-200 dark:border-gray-700 hover:border-[#0d89b1] dark:hover:border-[#0d89b1] bg-[#f8fafc] dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
          }`}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            accept="image/*"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white dark:bg-[#1f2937] rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <Upload className="w-6 h-6 text-[#0d89b1]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1f2937] dark:text-gray-200">
                {placeholder}
              </p>
              <p className="text-xs text-[#64748b] dark:text-gray-400 mt-1">
                PNG, JPG, WEBP (Maks. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
