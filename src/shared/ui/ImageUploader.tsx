import {Loader2, Upload, X} from "lucide-react";

interface ImageUploaderProps {
  label: string;
  images: string[];
  required?: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export const ImageUploader = ({
  label,
  images,
  required,
  onUpload,
  onRemove,
  isUploading,
}: ImageUploaderProps) => {
  return (
    <div>
      <label className="flex gap-1 text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-full object-cover"  
            />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
          {isUploading ? (
            <Loader2 size={24} className="text-slate-400 animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-slate-400" />
              <span className="text-xs text-slate-500 mt-2">Добавить</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};
