import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Input, TextArea} from "@/shared/ui";
import {superAdminVenueService} from "@/features/super-admin/venue";
import {Loader2, Upload, X} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export const Step1BasicInfo = () => {
  const {basicInfo, setBasicInfo} = useVenueCreationStore();
  const [images, setImages] = useState<string[]>(basicInfo.imageUrls || []);
  const [schemaImages, setSchemaImages] = useState<string[]>(
    basicInfo.schemaImageUrls || [],
  );
  const [uploading, setUploading] = useState({main: false, schema: false});

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "schema",
  ) => {
    const files = e.target.files;
    if (!files) return;

    // Включаем лоадер только для конкретного типа
    setUploading((prev) => ({...prev, [type]: true}));

    for (const file of Array.from(files)) {
      try {
        const url = await superAdminVenueService.uploadFileToS3(file);
        if (type === "main") {
          setImages((prev) => [...prev, url]);
        } else {
          setSchemaImages((prev) => [...prev, url]);
        }
        toast.success("Изображение загружено");
      } catch (error) {
        toast.error("Ошибка загрузки изображения");
      }
    }
    // Выключаем лоадер только для конкретного типа
    setUploading((prev) => ({...prev, [type]: false}));
  };
  const removeImage = (index: number, type: "main" | "schema") => {
    if (type === "main") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSchemaImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Update store when images or form data change
  useEffect(() => {
    // Only update if values actually changed to prevent infinite loop
    const currentImages = basicInfo.imageUrls || [];
    const currentSchemaImages = basicInfo.schemaImageUrls || [];

    if (
      JSON.stringify(currentImages) !== JSON.stringify(images) ||
      JSON.stringify(currentSchemaImages) !== JSON.stringify(schemaImages)
    ) {
      setBasicInfo({
        nameVenue: basicInfo.nameVenue || "",
        description: basicInfo.description || "",
        imageUrls: images,
        schemaImageUrls: schemaImages,
      });
    }
  }, [images, schemaImages]);

  return (
    <div className="space-y-6">
      {/* Main Images */}
      <div>
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider  mb-3">
          Фото заведения
        </label>
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx, "main")}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
            {uploading.main ? (
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
              onChange={(e) => handleImageUpload(e, "main")}
              className="hidden"
              disabled={uploading.main}
            />
          </label>
        </div>
      </div>

      {/* Schema Images */}
      <div>
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
          Схема заведения
        </label>
        <div className="grid grid-cols-3 gap-3">
          {schemaImages.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx, "schema")}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
            {uploading.schema ? (
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
              onChange={(e) => handleImageUpload(e, "schema")}
              className="hidden"
              disabled={uploading.schema}
            />
          </label>
        </div>
      </div>

      {/* Name */}
      <Input
        label="Название банка"
        required
        value={basicInfo.nameVenue || ""}
        onChange={(e) =>
          setBasicInfo({...basicInfo, nameVenue: e.target.value})
        }
        placeholder="Например: Ресторан Белладжио"
        type="text"
        name="venueName"
      />

      <TextArea
        className="min-h-[120px]"
        label="Описание"
        required
        value={basicInfo.description || ""}
        onChange={(e) =>
          setBasicInfo({...basicInfo, description: e.target.value})
        }
        placeholder="Опишите заведение, атмосферу, кухню..."
        name="description"
      />
    </div>
  );
};
