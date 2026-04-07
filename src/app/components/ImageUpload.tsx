import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
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
  const [preview, setPreview] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
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
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1f2937]">{label}</label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
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
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-[#0d89b1] bg-[#0d89b1]/5"
              : "border-gray-300 hover:border-[#0d89b1] hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-gray-100 rounded-full">
              <ImageIcon className="w-6 h-6 text-[#64748b]" />
            </div>
            <p className="text-sm text-[#64748b]">{placeholder}</p>
            <p className="text-xs text-[#94a3b8]">
              JPG, PNG, GIF (maks. 10MB)
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Upload className="w-4 h-4 text-[#0d89b1]" />
              <span className="text-sm font-medium text-[#0d89b1]">
                Yuklash
              </span>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
}
