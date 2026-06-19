import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  FileText,
  UserCog,
  Star,
  Users,
  Wallet,
  AlertCircle,
  Layers,
  Sofa,
  LayoutGrid,
  Edit3,
} from "lucide-react";
import {Button} from "@/shared/ui";
import {useVenueDetailMutations} from "./hooks/useVenueDetailMutation";
import {
  getImageData,
  getTodayStatus,
  WorkingHoursSchema,
} from "@/features/venue/utils/venueParsers";
import {useVenueDetails} from "./hooks/useVenueDetails";
import {VenueHero} from "./ui/VenueHero";
import {VenueInfoCard} from "./ui/VenueInfoCard";
import {VenueSkeleton} from "./ui/VenueSkeletons";
import {VenueHoursModal} from "./ui/modals/VenueHoursModal";
import {VenueDetailsModal} from "./ui/modals/VenueDetailsModal";
import {VenueAmenitiesModal} from "./ui/modals/VenueAmenitiesModal";
import {VenueContactsModal} from "./ui/modals/VenueContactsModal";
import {VenueDescriptionModal} from "./ui/modals/VenueDescriptionModal";
import {
  WorkingHoursSectionCard,
  CuisinesSectionCard,
  AmenitySectionCard,
  ContactsSectionCard,
  FeedbackSectionCard,
} from "@/features/venue";

type ModalType =
  | null
  | "hours"
  | "details"
  | "amenities"
  | "cuisines"
  | "contacts"
  | "description";

const EditButton = ({onClick}: {onClick: () => void}) => {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-slate-50 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all"
    >
      <Edit3 size={16} />
    </button>
  );
};

export const VenueDetailPage = () => {
  const {venueId} = useParams<{venueId: string}>();
  const navigate = useNavigate();
  const id = Number(venueId);

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const onClose = () => {
    setActiveModal(null);
  };

  const {
    addImageMutation,
    deleteImageMutation,
    updateHoursMutation,
    updateAmenitiesMutation,
    updateContactsMutation,
    updateDescMutation,
    updateDetailsMutation,
  } = useVenueDetailMutations(id, onClose);

  const {
    basicData,
    detailsData,
    hoursData: hoursDataRaw,
    amenitiesData,
    contactsData,
    publicAdminData,
    descriptionData,
    allAmenitiesData,
    allCitiesData,
    isLoading,
    isError,
  } = useVenueDetails(id);

  if (isLoading)
    return (
      <div className="max-w-md mx-auto sm:max-w-7xl px-4 py-8">
        <VenueSkeleton />
      </div>
    );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Ошибка загрузки
          </h2>
          <p className="text-slate-500 font-medium">
            Не удалось получить данные о заведении
          </p>
        </div>
        <Button
          onClick={() => navigate("/super-admin/venues")}
          variant="ghost"
          className="h-12 px-6 rounded-2xl font-black border border-slate-100"
        >
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const descriptionText =
    typeof descriptionData === "string"
      ? descriptionData
      : descriptionData?.description || "";

  const venueHours = WorkingHoursSchema.parse(hoursDataRaw);

  const today = getTodayStatus(venueHours);
  const imageData = getImageData(basicData);

  const isEmpty = publicAdminData && Object.keys(publicAdminData).length === 0;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/super-admin/venues")}
            className="p-2 -ml-2 text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-black text-slate-900 truncate px-4">
            {basicData?.name || "Заведение"}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="space-y-6 sm:pt-8 overflow-x-hidden">
        <VenueHero
          images={imageData}
          onDeleteImage={(id) => deleteImageMutation.mutate(id)}
          onAddImage={(file) => addImageMutation.mutate(file)}
          isProcessing={
            addImageMutation.isPending || deleteImageMutation.isPending
          }
        />

        <div className="space-y-6">
          <VenueInfoCard
            onEdit={() => setActiveModal("details")}
            title={
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {basicData?.name || "Без названия"}
              </h1>
            }
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      График:
                    </p>
                    <p className="font-bold text-sm tracking-tight">
                      {today.isOff ? "Выходной" : today.hours}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Адрес:
                    </p>
                    <p className="font-bold text-sm tracking-tight">
                      {basicData?.address || "Адрес не указан"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Средний чек:
                    </p>
                    <p className="font-bold text-sm tracking-tight">
                      {basicData?.averageCheck || 0}
                      сом
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-orange-500">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Рейтинг:
                    </p>
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      {basicData?.rating || 5.0}
                      <Star
                        size={14}
                        className="fill-orange-500 text-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VenueInfoCard>

          {Array.isArray(basicData?.promosRes) &&
            basicData.promosRes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 px-2">
                  Акции и скидки
                </h3>
                {basicData.promosRes.map((promo: any, idx: number) => (
                  <VenueInfoCard
                    key={idx}
                    onEdit={() => console.log("Edit Promo")}
                    noPadding
                    className={"border-orange-100 bg-orange-50/20"}
                  >
                    <div className="flex h-32">
                      <div className="w-32 bg-slate-100 relative overflow-hidden">
                        <img
                          src={imageData[0]?.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg">
                          -{promo.discount || 20}%
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <h4 className="font-black text-slate-900 leading-tight mb-1">
                          {promo.title || "Специальное предложение"}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {promo.description ||
                            "Успейте воспользоваться выгодным предложением от нашего заведения"}
                        </p>
                      </div>
                    </div>
                  </VenueInfoCard>
                ))}
              </div>
            )}

          <VenueInfoCard
            title={<h2>Детали заведения</h2>}
            icon={<LayoutGrid size={20} />}
            onEdit={() => setActiveModal("details")}
          >
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Layers size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Этаж
                  </p>
                  <p className="font-bold text-sm">1 этаж</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Sofa size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Кабины
                  </p>
                  <p className="font-bold text-sm">Есть VIP</p>
                </div>
              </div>
              {detailsData?.capacities &&
                typeof detailsData.capacities === "object" &&
                !Array.isArray(detailsData.capacities) &&
                Object.entries(detailsData.capacities).map(
                  ([title, value], i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">
                          {title}
                        </p>
                        <p className="font-bold text-sm">
                          {String(value)} чел.
                        </p>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </VenueInfoCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <WorkingHoursSectionCard
              className="p-8"
              variant="orange"
              hours={venueHours}
              delay={0.2}
              actions={<EditButton onClick={() => setActiveModal("hours")} />}
            />
            <CuisinesSectionCard
              variant="orange"
              className="p-8"
              detailsData={detailsData}
              actions={
                <EditButton onClick={() => setActiveModal("cuisines")} />
              }
              delay={0.25}
            />
          </div>

          <AmenitySectionCard
            variant="orange"
            className="p-8"
            delay={0.25}
            amenities={amenitiesData}
            actions={<EditButton onClick={() => setActiveModal("amenities")} />}
          />

          <ContactsSectionCard
            variant="orange"
            className="p-8"
            contactsData={contactsData}
            delay={0.3}
            actions={<EditButton onClick={() => setActiveModal("contacts")} />}
          />

          <VenueInfoCard
            title={<h2>Администратор</h2>}
            icon={<UserCog size={20} />}
            onEdit={() => navigate("/super-admin/venues")}
          >
            {!isEmpty && publicAdminData ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">
                  {(publicAdminData.fullName || "A").charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">
                    {publicAdminData.fullName || "Имя не указано"}
                  </h4>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-sm text-slate-400 font-medium italic">
                  Администратор не назначен
                </p>
              </div>
            )}
          </VenueInfoCard>

          <VenueInfoCard
            title={<h2>Описание</h2>}
            icon={<FileText size={20} />}
            onEdit={() => setActiveModal("description")}
          >
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {descriptionText ||
                  "Описание пока не заполнено владельцем заведения"}
              </p>
            </div>
          </VenueInfoCard>

          <FeedbackSectionCard
            variant="orange"
            className="p-8"
            venueId={id}
            service="SUPER_ADMIN"
            delay={0.6}
          />
        </div>
      </div>

      <VenueHoursModal
        isOpen={activeModal === "hours"}
        onClose={onClose}
        initialHours={venueHours}
        onSave={(hours) => updateHoursMutation.mutate(hours)}
        isSaving={updateHoursMutation.isPending}
      />

      <VenueDetailsModal
        isOpen={activeModal === "details"}
        onClose={onClose}
        initialDetails={{
          cityId: 0,
          address: "",
          averageCheck: 0,
          capacities: [],
        }}
        basicInfo={{
          address: basicData?.address || "",
          averageCheck: basicData?.averageCheck || 0,
        }}
        cities={allCitiesData || []}
        onSave={(details) => updateDetailsMutation.mutate(details)}
        isSaving={updateDetailsMutation.isPending}
      />

      <VenueAmenitiesModal
        isOpen={activeModal === "amenities"}
        onClose={onClose}
        initialAmenities={amenitiesData || {}}
        allAmenities={allAmenitiesData || []}
        onSave={(ids) => updateAmenitiesMutation.mutate(ids)}
        isSaving={updateAmenitiesMutation.isPending}
      />

      <VenueContactsModal
        isOpen={activeModal === "contacts"}
        onClose={onClose}
        initialContacts={contactsData || {}}
        onSave={(data) => updateContactsMutation.mutate(data)}
        isSaving={updateContactsMutation.isPending}
      />

      <VenueDescriptionModal
        isOpen={activeModal === "description"}
        onClose={onClose}
        initialName={basicData?.name || ""}
        initialDescription={descriptionText}
        onSave={(data) => updateDescMutation.mutate(data)}
        isSaving={updateDescMutation.isPending}
      />
    </div>
  );
};
