import React, {useState, useEffect} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Image as ImageIcon, Loader2, Save} from "lucide-react";
import {
  adminTableService,
  TableDetail,
  UpdateTableBasicRequest,
} from "@/api/admin/table";
import {Button, ImageUploader, Input, Modal, TextArea} from "@/shared/ui";
import {toast} from "sonner";
import {s3Service} from "@/api/s3";

interface EditTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: number | null;
  selectedDate: string;
}

// `file.type.startsWith("image/")` also matches image/x-icon (.ico),
// image/svg+xml, image/tiff, etc. - use an explicit allow-list instead.
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const EditTableModal: React.FC<EditTableModalProps> = ({
  isOpen,
  onClose,
  tableId,
  selectedDate,
}) => {
  if (!tableId) return null;

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateTableBasicRequest | null>(
    null,
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pendingImageUrls, setPendingImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch table details
  const {data: tableDetail, isLoading: isLoadingTable} = useQuery({
    queryKey: ["table-detail", tableId],
    queryFn: () => adminTableService.getTableById(tableId!),
    enabled: isOpen && !!tableId,
  });

  // Initialize form when tableDetail is loaded
  useEffect(() => {
    if (!tableDetail) return;

    const [capacityMin, capacityMax] = tableDetail.capacity.split("-");

    setFormData({
      inFloor: tableDetail.inFloor,
      title: tableDetail.title,
      capacityMin: parseInt(capacityMin) || 1,
      capacityMax: parseInt(capacityMax || capacityMin) || 1,
      deposit: tableDetail.price,
      description: tableDetail.description,
    });
    setImagePreviews(Object.values(tableDetail.images));
    setPendingImageUrls([]);
  }, [tableDetail]);

  const updateField = <K extends keyof UpdateTableBasicRequest>(
    field: K,
    value: UpdateTableBasicRequest[K],
  ) => {
    setFormData((prev) => (prev ? {...prev, [field]: value} : prev));
  };

  const handleSave = async () => {
    if (!formData || !tableId) return;

    setIsSaving(true);
    try {
      await adminTableService.updateTableBasic(tableId, formData);

      if (pendingImageUrls.length > 0) {
        for (const url of pendingImageUrls) {
          await adminTableService.addTableImage(tableId, url);
        }
      }

      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Столик успешно обновлен");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка обновления";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Можно загружать только JPG, PNG, WEBP или GIF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Размер файла не должен превышать 5MB");
        return;
      }
    }

    setIsUploading(true);
    try {
      const imageUrls = await Promise.all(
        files.map((file) => s3Service.uploadFile(file)),
      );

      setPendingImageUrls((prev) => [...prev, ...imageUrls]);
      setImagePreviews((prev) => [...prev, ...imageUrls]);
      toast.success(`Загружено ${files.length} фото`);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка загрузки изображений";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = imagePreviews[index];
    if (!imageUrl) return;

    // Pending image (uploaded but not yet registered on the backend) - just drop it locally
    if (pendingImageUrls.includes(imageUrl)) {
      setPendingImageUrls((prev) => prev.filter((url) => url !== imageUrl));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // Existing image - find its id from the originally loaded table data and delete via API
    if (!tableDetail) return;

    const entry = Object.entries(tableDetail.images).find(
      ([, url]) => url === imageUrl,
    );
    const imageId = entry ? parseInt(entry[0]) : NaN;

    if (!entry || isNaN(imageId) || imageId <= 0) {
      toast.error("Не удалось определить ID изображения");
      return;
    }

    try {
      await adminTableService.deleteTableImage(tableId, imageId);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      toast.success("Фото удалено");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка удаления изображения";
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      header={{
        icon: <ImageIcon size={20} />,
        title: "Редактировать столик",
        description: `Дата: ${new Date(selectedDate).toLocaleDateString("ru-RU")}`,
      }}
      isShaded
      isLoading={isLoadingTable || !formData}
      open={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-bold"
            disabled={isSaving}
          >
            Закрыть
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-12 rounded-xl font-bold flex gap-2 tracking-wider disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Сохранить</span>
              </>
            )}
          </Button>
        </div>
      }
    >
      {formData && (
        <div className="flex-1 overflow-y-auto space-y-5 px-0.5">
          <ImageUploader
            label="Фотографии"
            images={imagePreviews}
            isUploading={isUploading}
            onUpload={handleFileSelect}
            onRemove={removeImage}
          />

          <Input
            label="Название"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            name="title"
            placeholder="Введите название столика"
          />

          {/* Floor and Type */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Этаж"
              name="inFloor"
              type="number"
              value={formData.inFloor}
              onChange={(e) =>
                updateField("inFloor", parseInt(e.target.value) || 0)
              }
            />
            <Input
              label="Тип стола"
              name="etableType"
              type="text"
              value={tableDetail?.etableType ?? ""}
              readOnly
              disabled
            />
          </div>

          {/* Capacity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Вместимость
              </label>
              <div className="flex items-center gap-2">
                <Input
                  name="capacityMin"
                  type="number"
                  value={formData.capacityMin}
                  onChange={(e) =>
                    updateField("capacityMin", parseInt(e.target.value) || 1)
                  }
                />
                <span className="text-slate-400">–</span>
                <Input
                  name="capacityMax"
                  type="number"
                  value={formData.capacityMax}
                  onChange={(e) =>
                    updateField("capacityMax", parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>
            <Input
              label="Цена"
              name="deposit"
              type="text"
              value={formData.deposit}
              onChange={(e) => updateField("deposit", e.target.value)}
            />
          </div>

          {/* Description */}
          <TextArea
            className="min-h-[120px]"
            label="Описание"
            name="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />
        </div>
      )}
    </Modal>
  );
};
