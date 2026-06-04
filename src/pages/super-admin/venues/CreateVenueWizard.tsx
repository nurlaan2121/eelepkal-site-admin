import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Store,
  Info,
  Clock,
  UtensilsCrossed,
  ConciergeBell,
  Phone,
  FileText,
  PartyPopper,
  Upload,
  X,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import {toast} from "sonner";
import {Button} from "@/components/ui/Button";
import {Input} from "@/components/ui/Input";
import {superAdminVenueService} from "@/api/venue/superAdminVenueService";
import {useVenueCreationStore} from "@/store/venueCreationStore";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {DayOfWeek, VenueWorkingHours} from "@/types/venue";

const STEPS = [
  {id: 1, title: "Основная информация", icon: Store},
  {id: 2, title: "Детали", icon: Info},
  {id: 3, title: "Время работы", icon: Clock},
  {id: 4, title: "Тип кухни", icon: UtensilsCrossed},
  {id: 5, title: "Услуги", icon: ConciergeBell},
  {id: 6, title: "Контакты", icon: Phone},
  {id: 7, title: "Условия", icon: FileText},
];

// ─────────── Step 1: Basic Info ───────────
const Step1BasicInfo: React.FC = () => {
  const {basicInfo, setBasicInfo} = useVenueCreationStore();
  const [images, setImages] = useState<string[]>(basicInfo.imageUrls || []);
  const [schemaImages, setSchemaImages] = useState<string[]>(
    basicInfo.schemaImageUrls || [],
  );
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "schema",
  ) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
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
    setUploading(false);
  };

  const removeImage = (index: number, type: "main" | "schema") => {
    if (type === "main") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSchemaImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Update store when images or form data change
  React.useEffect(() => {
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
        <label className="block text-sm font-bold text-slate-700 mb-3">
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
            {uploading ? (
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
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Schema Images */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">
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
            <Upload size={24} className="text-slate-400" />
            <span className="text-xs text-slate-500 mt-2">Добавить</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, "schema")}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Название заведения *
        </label>
        <Input
          value={basicInfo.nameVenue || ""}
          onChange={(e) =>
            setBasicInfo({...basicInfo, nameVenue: e.target.value})
          }
          placeholder="Например: Ресторан Белладжио"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Описание
        </label>
        <textarea
          value={basicInfo.description || ""}
          onChange={(e) =>
            setBasicInfo({...basicInfo, description: e.target.value})
          }
          className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          placeholder="Опишите заведение, атмосферу, кухню..."
        />
      </div>
    </div>
  );
};

// ─────────── Step 2: Details ───────────
const Step2Details: React.FC = () => {
  const {details, setDetails} = useVenueCreationStore();

  const {data: cities = [], isLoading} = useQuery({
    queryKey: ["cities"],
    queryFn: superAdminVenueService.getAllCities,
  });

  const capacities = details.capacities || [];

  const addCapacity = () => {
    setDetails({
      ...details,
      capacities: [...capacities, {title: "", value: 0}],
    });
  };

  const removeCapacity = (index: number) => {
    setDetails({
      ...details,
      capacities: capacities.filter((_, i) => i !== index),
    });
  };

  const updateCapacity = (
    index: number,
    field: "title" | "value",
    value: string | number,
  ) => {
    const newCapacities = [...capacities];
    newCapacities[index] = {...newCapacities[index], [field]: value};
    setDetails({...details, capacities: newCapacities});
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Город *
        </label>
        <select
          value={details.cityId || ""}
          onChange={(e) =>
            setDetails({...details, cityId: Number(e.target.value)})
          }
          className="w-full h-12 px-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          disabled={isLoading}
        >
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.title}
            </option>
          ))}
        </select>
        {isLoading && (
          <p className="text-xs text-slate-400 mt-2">Загрузка городов...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Адрес *
        </label>
        <Input
          value={details.address || ""}
          onChange={(e) => setDetails({...details, address: e.target.value})}
          placeholder="г. Бишкек, ул. Ибраимова 115"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Средний чек (сом)
        </label>
        <Input
          type="number"
          value={details.averageCheck || ""}
          onChange={(e) =>
            setDetails({...details, averageCheck: Number(e.target.value)})
          }
          placeholder="1500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-700">
            Вместимость
          </label>
          <Button
            variant="ghost"
            onClick={addCapacity}
            className="gap-2 h-9 px-4"
          >
            <Plus size={16} />
            <span>Добавить</span>
          </Button>
        </div>
        <div className="space-y-3">
          {capacities.map((cap, idx) => (
            <div key={idx} className="flex gap-3">
              <Input
                value={cap.title}
                onChange={(e) => updateCapacity(idx, "title", e.target.value)}
                placeholder="Тип (напр: Банкетный зал)"
                className="flex-1"
              />
              <Input
                type="number"
                value={cap.value}
                onChange={(e) =>
                  updateCapacity(idx, "value", Number(e.target.value))
                }
                placeholder="Кол-во"
                className="w-32"
              />
              <button
                onClick={() => removeCapacity(idx)}
                className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────── Step 3: Working Hours ───────────
const Step3Hours: React.FC = () => {
  const {hours, setHours} = useVenueCreationStore();
  const defaultWorkingHours: VenueWorkingHours = {
    mondayOpen: "09:00",
    mondayClose: "23:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "23:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "23:00",
    thursdayOpen: "09:00",
    thursdayClose: "23:00",
    fridayOpen: "09:00",
    fridayClose: "23:00",
    saturdayOpen: "09:00",
    saturdayClose: "23:00",
    sundayOpen: "09:00",
    sundayClose: "23:00",
  };
  const hoursData = hours.hours || defaultWorkingHours;
  const isDayOff = hours.isDayOff || {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  const days: {
    key: DayOfWeek;
    label: string;
    openField: keyof VenueWorkingHours;
    closeField: keyof VenueWorkingHours;
  }[] = [
    {
      key: "monday",
      label: "Понедельник",
      openField: "mondayOpen",
      closeField: "mondayClose",
    },
    {
      key: "tuesday",
      label: "Вторник",
      openField: "tuesdayOpen",
      closeField: "tuesdayClose",
    },
    {
      key: "wednesday",
      label: "Среда",
      openField: "wednesdayOpen",
      closeField: "wednesdayClose",
    },
    {
      key: "thursday",
      label: "Четверг",
      openField: "thursdayOpen",
      closeField: "thursdayClose",
    },
    {
      key: "friday",
      label: "Пятница",
      openField: "fridayOpen",
      closeField: "fridayClose",
    },
    {
      key: "saturday",
      label: "Суббота",
      openField: "saturdayOpen",
      closeField: "saturdayClose",
    },
    {
      key: "sunday",
      label: "Воскресенье",
      openField: "sundayOpen",
      closeField: "sundayClose",
    },
  ];

  const toggleDayOff = (day: DayOfWeek) => {
    const newIsDayOff = {...isDayOff, [day]: !isDayOff[day]};
    setHours({isDayOff: newIsDayOff});

    const dayConfig = days.find((d) => d.key === day)!;
    if (!newIsDayOff[day]) {
      setHours({
        hours: {
          ...hoursData,
          [dayConfig.openField]: "09:00",
          [dayConfig.closeField]: "23:00",
        },
      });
    } else {
      setHours({
        hours: {
          ...hoursData,
          [dayConfig.openField]: "00:00",
          [dayConfig.closeField]: "00:00",
        },
      });
    }
  };

  const updateHour = (field: keyof VenueWorkingHours, value: string) => {
    setHours({hours: {...hoursData, [field]: value}});
  };

  return (
    <div className="space-y-4">
      {days.map(({key, label, openField, closeField}) => (
        <div key={key} className="bg-slate-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <button
              onClick={() => toggleDayOff(key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDayOff[key] ? "bg-slate-300" : "bg-brand-primary"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isDayOff[key] ? "left-1" : "left-7"}`}
              />
            </button>
          </div>
          {!isDayOff[key] && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">
                  Открытие
                </label>
                <input
                  type="time"
                  value={hoursData[openField] || "09:00"}
                  onChange={(e) => updateHour(openField, e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">
                  Закрытие
                </label>
                <input
                  type="time"
                  value={hoursData[closeField] || "23:00"}
                  onChange={(e) => updateHour(closeField, e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
          )}
          {isDayOff[key] && (
            <p className="text-xs text-slate-400 font-medium">Выходной день</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────── Step 4: Cuisines ───────────
const Step4Cuisines: React.FC = () => {
  const {cuisines, setCuisines} = useVenueCreationStore();
  const selectedIds = cuisines.cuisinesIds || [];

  const {data: allCuisines = []} = useQuery({
    queryKey: ["cuisines"],
    queryFn: () => superAdminVenueService.getAllCuisines(0, 100),
  });

  const toggleCuisine = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setCuisines({cuisinesIds: newIds});
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-700 mb-4">
        Выберите типы кухни
      </p>
      <div className="grid grid-cols-2 gap-3">
        {allCuisines.map((cuisine) => (
          <button
            key={cuisine.id}
            onClick={() => toggleCuisine(cuisine.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedIds.includes(cuisine.id)
                ? "border-brand-primary bg-brand-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                  selectedIds.includes(cuisine.id)
                    ? "border-brand-primary bg-brand-primary"
                    : "border-slate-300"
                }`}
              >
                {selectedIds.includes(cuisine.id) && (
                  <Check size={14} className="text-white" />
                )}
              </div>
              <span className="text-sm font-bold text-slate-700">
                {cuisine.name}
              </span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Выбрано: {selectedIds.length}
      </p>
    </div>
  );
};

// ─────────── Step 5: Amenities ───────────
const Step5Amenities: React.FC = () => {
  const {amenities, setAmenities} = useVenueCreationStore();
  const selectedIds = amenities.amenitiesId || [];

  const {data: allAmenities = []} = useQuery({
    queryKey: ["amenities"],
    queryFn: superAdminVenueService.getAllAmenities,
  });

  const toggleAmenity = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setAmenities({amenitiesId: newIds});
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-700 mb-4">
        Выберите услуги и удобства
      </p>
      <div className="flex flex-wrap gap-3">
        {allAmenities.map((amenity) => (
          <button
            key={amenity.id}
            onClick={() => toggleAmenity(amenity.id)}
            className={`px-5 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
              selectedIds.includes(amenity.id)
                ? "border-brand-primary bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {amenity.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Выбрано: {selectedIds.length}
      </p>
    </div>
  );
};

// ─────────── Step 6: Contacts ───────────
const Step6Contacts: React.FC = () => {
  const {contacts, setContacts} = useVenueCreationStore();
  const social = contacts.linksSocial || {};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Телефон
        </label>
        <Input
          value={contacts.phoneNumber || ""}
          onChange={(e) => setContacts({phoneNumber: e.target.value})}
          placeholder="+996 555 01 23 45"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Email
        </label>
        <Input
          type="email"
          value={contacts.email || ""}
          onChange={(e) => setContacts({email: e.target.value})}
          placeholder="info@venue.ru"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Социальные сети
        </label>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Instagram</label>
          <Input
            value={social.instagram || ""}
            onChange={(e) =>
              setContacts({linksSocial: {...social, instagram: e.target.value}})
            }
            placeholder="@venue_ru"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">WhatsApp</label>
          <Input
            value={social.whatsapp || ""}
            onChange={(e) =>
              setContacts({linksSocial: {...social, whatsapp: e.target.value}})
            }
            placeholder="+996 555 01 23 45"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Telegram</label>
          <Input
            value={social.telegram || ""}
            onChange={(e) =>
              setContacts({linksSocial: {...social, telegram: e.target.value}})
            }
            placeholder="@venue_ru"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Facebook</label>
          <Input
            value={social.facebook || ""}
            onChange={(e) =>
              setContacts({linksSocial: {...social, facebook: e.target.value}})
            }
            placeholder="https://facebook.com/venue.ru"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Website</label>
          <Input
            value={social.website || ""}
            onChange={(e) =>
              setContacts({linksSocial: {...social, website: e.target.value}})
            }
            placeholder="https://venue.ru"
          />
        </div>
      </div>
    </div>
  );
};

// ─────────── Step 7: Conditions ───────────
const Step7Conditions: React.FC = () => {
  const {conditions, setConditions} = useVenueCreationStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Депозит (сом)
        </label>
        <div className="flex gap-2 mb-3">
          {[0, 500, 1000, 2000].map((amt) => (
            <button
              key={amt}
              onClick={() => setConditions({deposit: amt})}
              className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${
                conditions.deposit === amt
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {amt === 0 ? "Без депозита" : `${amt}`}
            </button>
          ))}
        </div>
        <Input
          type="number"
          value={conditions.deposit || ""}
          onChange={(e) => setConditions({deposit: Number(e.target.value)})}
          placeholder="Или введите сумму"
        />
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Можно отменить?
          </span>
          <button
            onClick={() =>
              setConditions({
                cancelAllowed: !conditions.cancelAllowed,
                cancellationDeadline: !conditions.cancelAllowed
                  ? "03:00"
                  : "00:00",
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${conditions.cancelAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${conditions.cancelAllowed ? "left-7" : "left-1"}`}
            />
          </button>
        </div>
        {conditions.cancelAllowed && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              За сколько часов до визита
            </label>
            <input
              type="time"
              value={conditions.cancellationDeadline || "03:00"}
              onChange={(e) =>
                setConditions({cancellationDeadline: e.target.value})
              }
              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Можно редактировать?
          </span>
          <button
            onClick={() =>
              setConditions({
                editAllowed: !conditions.editAllowed,
                editingDeadline: !conditions.editAllowed ? "05:00" : "00:00",
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${conditions.editAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${conditions.editAllowed ? "left-7" : "left-1"}`}
            />
          </button>
        </div>
        {conditions.editAllowed && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              За сколько часов до визита
            </label>
            <input
              type="time"
              value={conditions.editingDeadline || "05:00"}
              onChange={(e) => setConditions({editingDeadline: e.target.value})}
              className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────── Success Screen ───────────
interface SuccessScreenProps {
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({onReset}) => {
  const navigate = useNavigate();
  const {resetCreation} = useVenueCreationStore();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <motion.div
        initial={{scale: 0}}
        animate={{scale: 1}}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
      >
        <PartyPopper size={48} className="text-white" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Заведение успешно добавлено!
        </h2>
        <p className="text-slate-500">Все данные сохранены</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button
          onClick={() => {
            onReset();
            navigate("/super-admin/venues");
          }}
          className="w-full h-12"
        >
          Перейти к списку
        </Button>
        <Button variant="ghost" onClick={onReset} className="w-full h-12">
          Добавить ещё
        </Button>
      </div>
    </div>
  );
};

// ─────────── Main Wizard ───────────
export const CreateVenueWizard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    currentStep,
    setCurrentStep,
    venueId,
    setVenueId,
    resetCreation,
    basicInfo,
    details,
    hours,
    cuisines,
    amenities,
    contacts,
    conditions,
  } = useVenueCreationStore();
  const [isComplete, setIsComplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [localVenueId, setLocalVenueId] = useState<number | null>(null);

  // Check if form has any data
  const hasFormData =
    (basicInfo.nameVenue && basicInfo.nameVenue.trim() !== "") ||
    (basicInfo.description && basicInfo.description.trim() !== "") ||
    (basicInfo.imageUrls && basicInfo.imageUrls.length > 0) ||
    details.cityId ||
    (details.address && details.address.trim() !== "") ||
    venueId;

  // Handle browser back/forward buttons and page refresh
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormData && !isComplete) {
        e.preventDefault();
        e.returnValue =
          "У вас есть несохраненные данные. Вы уверены, что хотите выйти?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasFormData, isComplete]);

  const resetAndNavigate = () => {
    resetCreation();
    setShowConfirmDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate("/super-admin/venues");
    }
  };

  const handleCancel = () => {
    if (hasFormData) {
      setShowConfirmDialog(true);
    } else {
      resetAndNavigate();
    }
  };

  // Mutations for each step
  const step1Mutation = useMutation({
    mutationFn: () =>
      superAdminVenueService.addBasicInfo({
        imageUrls: basicInfo.imageUrls || [],
        schemaImageUrls: basicInfo.schemaImageUrls || [],
        nameVenue: basicInfo.nameVenue || "",
        description: basicInfo.description || "",
      }),
    onSuccess: (data) => {
      setVenueId(data.idVenue);
      setLocalVenueId(data.idVenue); // Save to local state immediately
      toast.success("Основная информация сохранена");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка сохранения");
    },
  });

  const step2Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueDetails(vid, {
        cityId: details.cityId || 0,
        address: details.address || "",
        averageCheck: details.averageCheck || 0,
        capacities: details.capacities || [],
      }),
    onSuccess: () => toast.success("Детали сохранены"),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const step3Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueHours(vid, hours.hours!),
    onSuccess: () => toast.success("Время работы сохранено"),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const step4Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueCuisines(vid, {
        cuisinesIds: cuisines.cuisinesIds || [],
      }),
    onSuccess: () => toast.success("Типы кухни сохранены"),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const step5Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueAmenities(vid, {
        amenitiesId: amenities.amenitiesId || [],
      }),
    onSuccess: () => toast.success("Услуги сохранены"),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const step6Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueContacts(vid, {
        phoneNumber: contacts.phoneNumber || "",
        email: contacts.email || "",
        linksSocial: contacts.linksSocial || {},
      }),
    onSuccess: () => toast.success("Контакты сохранены"),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const step7Mutation = useMutation({
    mutationFn: (vid: number) =>
      superAdminVenueService.addVenueConditions(vid, {
        deposit: conditions.deposit || 0,
        cancelAllowed: conditions.cancelAllowed || false,
        cancellationDeadline: conditions.cancellationDeadline || "00:00",
        editAllowed: conditions.editAllowed || false,
        editingDeadline: conditions.editingDeadline || "00:00",
      }),
    onSuccess: () => {
      toast.success("Заведение успешно создано!");
      queryClient.invalidateQueries({queryKey: ["super-admin-venues"]});
      resetCreation(); // Reset state but keep isComplete=true locally if needed
      setIsComplete(true);
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });

  const handleNext = async () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !basicInfo.nameVenue) {
      toast.error("Введите название заведения");
      return;
    }
    if (currentStep === 2 && (!details.cityId || !details.address)) {
      toast.error("Заполните город и адрес");
      return;
    }

    // For steps 2-7, we need venueId
    if (currentStep > 1 && !localVenueId) {
      toast.error("Ошибка: ID заведения не найден. Начните сначала.");
      return;
    }

    try {
      // Execute mutation for current step
      switch (currentStep) {
        case 1:
          await step1Mutation.mutateAsync();
          break;
        case 2:
          await step2Mutation.mutateAsync(localVenueId!);
          break;
        case 3:
          await step3Mutation.mutateAsync(localVenueId!);
          break;
        case 4:
          await step4Mutation.mutateAsync(localVenueId!);
          break;
        case 5:
          await step5Mutation.mutateAsync(localVenueId!);
          break;
        case 6:
          await step6Mutation.mutateAsync(localVenueId!);
          break;
        case 7:
          await step7Mutation.mutateAsync(localVenueId!);
          return; // Don't go to next step, stay on success screen
      }

      // Move to next step
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Step error:", error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepLoading = [
    step1Mutation.isPending,
    step2Mutation.isPending,
    step3Mutation.isPending,
    step4Mutation.isPending,
    step5Mutation.isPending,
    step6Mutation.isPending,
    step7Mutation.isPending,
  ][currentStep - 1];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Details />;
      case 3:
        return <Step3Hours />;
      case 4:
        return <Step4Cuisines />;
      case 5:
        return <Step5Amenities />;
      case 6:
        return <Step6Contacts />;
      case 7:
        return <Step7Conditions />;
      default:
        return <Step1BasicInfo />;
    }
  };

  if (isComplete) {
    return (
      <SuccessScreen
        onReset={() => {
          resetCreation();
          setIsComplete(false);
          setLocalVenueId(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          Создание заведения
        </h1>
        <p className="text-slate-500 text-sm">
          Заполните данные для регистрации нового ресторана
        </p>
      </div>

      {/* Stepper - Fixed position */}
      <div className="sticky top-4 z-10 mb-6 bg-white/80 backdrop-blur-lg p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      currentStep >= step.id
                        ? "bg-brand-primary text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Шаг {step.id}
                    </p>
                    <p
                      className={`text-sm font-bold ${currentStep >= step.id ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 lg:w-12 h-0.5 ${currentStep > step.id ? "bg-brand-primary" : "bg-slate-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{x: 20, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: -20, opacity: 0}}
              transition={{duration: 0.2}}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Actions Bar */}
        <div className="px-6 md:px-8 py-5 bg-white border-t border-slate-100 flex justify-between sticky bottom-0 z-10">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? handleCancel : handlePrev}
            className="gap-2"
            disabled={isStepLoading}
          >
            <ChevronLeft size={18} />
            {currentStep === 1 ? "Отмена" : "Назад"}
          </Button>

          <Button
            onClick={handleNext}
            className="gap-2"
            disabled={isStepLoading}
          >
            {isStepLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : currentStep === 7 ? (
              <>
                <span>Создать заведение</span>
                <Check size={18} />
              </>
            ) : (
              <>
                <span>Продолжить</span>
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowConfirmDialog(false)}
            />
            <motion.div
              initial={{scale: 0.95, opacity: 0, y: 20}}
              animate={{scale: 1, opacity: 1, y: 0}}
              exit={{scale: 0.95, opacity: 0, y: 20}}
              transition={{type: "spring", damping: 25, stiffness: 300}}
              className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    Выйти из создания?
                  </h3>
                  <p className="text-sm text-slate-500">
                    У вас есть несохраненные данные. Все введенные данные будут
                    потеряны.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 h-12"
                >
                  Продолжить создание
                </Button>
                <Button
                  onClick={resetAndNavigate}
                  className="flex-1 h-12 bg-red-500 hover:bg-red-600"
                >
                  Выйти и сбросить
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
