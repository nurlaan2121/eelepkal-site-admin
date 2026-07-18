import React, {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  X,
  Upload,
  Loader2,
  HandPlatter,
  PencilLine,
  ArrowUpDown,
} from "lucide-react";
import {adminTableService, CreateTableRequest} from "@/api/admin/table";
import {
  Button,
  ImageUploader,
  Input,
  Modal,
  Select,
  TextArea,
} from "@/shared/ui";
import {toast} from "sonner";
import {s3Service} from "@/api/s3";
import {devService} from "@/api/dev";

type ToggleChipItem = {
  id: number;
  label: string;
};

interface ToggleChipGroupProps {
  label: string;
  items: ToggleChipItem[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

const ToggleChipGroup: React.FC<ToggleChipGroupProps> = ({
  label,
  items,
  selectedIds,
  onToggle,
}) => (
  <div>
    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`p-3 rounded-xl border text-sm font-bold transition-all ${
              isSelected
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFloor?: number;
}

export const AddTableModal: React.FC<AddTableModalProps> = ({
  isOpen,
  onClose,
  defaultFloor = 1,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTableRequest>({
    inFloor: defaultFloor,
    tableTypeId: 0,
    imageUrls: [],
    title: "",
    capacityMin: 1,
    capacityMax: 1,
    deposit: "",
    description: "",
    tableAmenitiesIds: [],
    eventTypeIds: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch table types
  const {data: tableTypes} = useQuery({
    queryKey: ["table-types"],
    queryFn: devService.getTableTypes,
    enabled: isOpen,
  });

  // Fetch amenities
  const {data: amenities} = useQuery({
    queryKey: ["table-amenities"],
    queryFn: devService.getTableAmenities,
    enabled: isOpen,
  });

  // Fetch event types
  const {data: eventTypes} = useQuery({
    queryKey: ["event-types"],
    queryFn: devService.getEventTypes,
    enabled: isOpen,
  });

  const addMutation = useMutation({
    mutationFn: (data: CreateTableRequest) => adminTableService.addTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["admin-tables"]});
      toast.success("Столик успешно добавлен");
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      console.error("Add table error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка добавления";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      inFloor: defaultFloor,
      tableTypeId: 0,
      imageUrls: [],
      title: "",
      capacityMin: 1,
      capacityMax: 1,
      deposit: "",
      description: "",
      tableAmenitiesIds: [],
      eventTypeIds: [],
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setIsUploading(false);
  };

  const validate = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Название обязательно");
    }

    if (formData.tableTypeId === 0) {
      errors.push("Выберите тип стола");
    }

    if (
      formData.capacityMin < 1 ||
      formData.capacityMax < formData.capacityMin
    ) {
      errors.push("Проверьте вместимость");
    }

    if (formData.imageUrls.length === 0) {
      errors.push("Добавьте хотя бы одно фото");
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
    }

    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof CreateTableRequest, value: any) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Можно загружать только изображения");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Размер файла не должен превышать 5MB");
        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Auto upload to S3
    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => s3Service.uploadFile(file));
      const imageUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...imageUrls],
      }));
      toast.success(`Загружено ${files.length} фото`);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка загрузки изображений";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenityId: number) => {
    setFormData((prev) => ({
      ...prev,
      tableAmenitiesIds: prev.tableAmenitiesIds.includes(amenityId)
        ? prev.tableAmenitiesIds.filter((id) => id !== amenityId)
        : [...prev.tableAmenitiesIds, amenityId],
    }));
  };

  const toggleEventType = (eventTypeId: number) => {
    setFormData((prev) => ({
      ...prev,
      eventTypeIds: prev.eventTypeIds.includes(eventTypeId)
        ? prev.eventTypeIds.filter((id) => id !== eventTypeId)
        : [...prev.eventTypeIds, eventTypeId],
    }));
  };

  return (
    <Modal
      className="md:max-w-3xl w-full"
      isShaded
      open={isOpen}
      onClose={onClose}
      header={{title: "Добавить столик", icon: <HandPlatter />}}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={addMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="add-table-form"
            onClick={handleSubmit}
            isLoading={addMutation.isPending}
          >
            Добавить столик
          </Button>
        </div>
      }
    >
      <form
        id="add-table-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-1 space-y-5"
      >
        {/* Images */}
        <ImageUploader
          label="Фотографии"
          required
          images={imagePreviews}
          onRemove={(index) => removeImage(index)}
          onUpload={handleFileSelect}
          isUploading={isUploading}
        />

        {/* Title */}
        <Input
          label="Название"
          type="text"
          labelIcon={<PencilLine size={14} />}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="например, Стол №1"
          required
          name="title"
        />

        {/* Floor and Type */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Этаж"
            type="number"
            value={formData.inFloor}
            onChange={(e) => handleChange("inFloor", parseInt(e.target.value))}
            min={1}
            labelIcon={<ArrowUpDown size={14} />}
            placeholder="1 или 2"
            required
            name="inFloor"
          />
          <Select
            name="tableType"
            label="Тип стола"
            required
            value={formData.tableTypeId}
            onChange={(e) =>
              handleChange("tableTypeId", parseInt(e.target.value))
            }
          >
            <option value={0}>Выберите тип</option>
            {tableTypes &&
              Object.entries(tableTypes).map(([name, id]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </Select>
        </div>
        {/* Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Мин. вместимость"
            type="number"
            value={formData.capacityMin}
            onChange={(e) =>
              handleChange("capacityMin", parseInt(e.target.value))
            }
            min={1}
            placeholder="10 или 20"
            required
            name="capacityMin"
          />
          <Input
            label="Макс. вместимость"
            type="number"
            value={formData.capacityMax}
            onChange={(e) =>
              handleChange("capacityMax", parseInt(e.target.value))
            }
            min={formData.capacityMin}
            placeholder="10 или 20"
            required
            name="capacityMax"
          />
        </div>
        {/* Deposit */}
        <Input
          label="Депозит"
          type="text"
          value={formData.deposit}
          onChange={(e) => handleChange("deposit", e.target.value)}
          placeholder="например, 5000 сом"
          name="deposit"
        />

        {/* Description */}
        <TextArea
          className="min-h-[120px]"
          label="Описание"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Описание столика..."
          rows={3}
          name="description"
        />
        {/* Amenities */}
        <ToggleChipGroup
          label="Удобства"
          items={
            amenities?.map((amenity) => ({
              id: amenity.id,
              label: amenity.title,
            })) || []
          }
          selectedIds={formData.tableAmenitiesIds}
          onToggle={toggleAmenity}
        />

        {/* Event Types */}
        <ToggleChipGroup
          label="Типы мероприятий"
          items={
            eventTypes
              ? Object.entries(eventTypes).map(([name, id]) => ({
                  id,
                  label: name,
                }))
              : []
          }
          selectedIds={formData.eventTypeIds}
          onToggle={toggleEventType}
        />
      </form>

      {/* Footer */}
    </Modal>
  );
};
