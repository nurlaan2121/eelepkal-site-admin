import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {ImageUploader, Input, TextArea} from "@/shared/ui";
import {s3Service} from "@/api/s3";
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
        const url = await s3Service.uploadFile(file);
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
      <ImageUploader
        label="Фото заведения"
        images={images}
        onRemove={(idx) => removeImage(idx, "main")}
        onUpload={(e) => handleImageUpload(e, "main")}
        isUploading={uploading.main}
      />

      {/* Schema Images */}
      <ImageUploader
        label="Схема заведения"
        images={schemaImages}
        onRemove={(idx) => removeImage(idx, "schema")}
        onUpload={(e) => handleImageUpload(e, "schema")}
        isUploading={uploading.schema}
      />

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
