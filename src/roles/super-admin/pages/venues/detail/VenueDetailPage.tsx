import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Globe,
  Instagram,
  MessageCircle,
  Send,
  Facebook,
  Clock,
  ConciergeBell,
  FileText,
  UserCog,
  Star,
  Users,
  Wallet,
  AlertCircle,
  Layers,
  Sofa,
  LayoutGrid,
  UtensilsCrossed,
  Trash2,
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {Button} from "@/shared/ui";
import {useVenueDetailMutations} from "./hooks/useVenueDetailMutation";
import {
  getImageData,
  getTodayStatus,
  parseAmenities,
  parseContacts,
  parseWorkingHours,
} from "@/features/super-admin/venue/utils/venueParsers";
import {useVenueDetails} from "./hooks/useVenueDetails";
import {VenueHero} from "./ui/VenueHero";
import {VenueInfoCard} from "./ui/VenueInfoCard";
import {VenueSkeleton} from "./ui/VenueSkeletons";
import {VenueHoursModal} from "./ui/VenueHoursModal";
import {VenueDetailsModal} from "./ui/VenueDetailsModal";
import {VenueAmenitiesModal, VenueAmenityGrid} from "./ui/amenities";
import {VenueContactsModal} from "./ui/VenueContactsModal";
import {VenueDescriptionModal} from "./ui/VenueDescriptionModal";

type ModalType =
  | null
  | "hours"
  | "details"
  | "amenities"
  | "contacts"
  | "description";

export const VenueDetailPage = () => {
  const {venueId} = useParams<{venueId: string}>();
  const navigate = useNavigate();
  const id = Number(venueId);

  const [deletedFeedbackIds, setDeletedFeedbackIds] = useState<Set<number>>(
    new Set(),
  );
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const onClose = () => {
    setActiveModal(null);
  };

  const {
    addImageMutation,
    deleteImageMutation,
    deleteFeedbackMutation,
    updateHoursMutation,
    updateAmenitiesMutation,
    updateContactsMutation,
    updateDescMutation,
    updateDetailsMutation,
  } = useVenueDetailMutations(id, setDeletedFeedbackIds, onClose);

  const {
    basicData,
    detailsData,
    hoursData: hoursDataRaw,
    amenitiesData: amenitiesDataRaw,
    contactsData: contactsDataRaw,
    publicAdminData,
    descriptionData,
    feedbacksData,
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

  const visibleFeedbacks =
    feedbacksData?.filter((f: any) => !deletedFeedbackIds.has(f.id)) || [];

  const descriptionText =
    typeof descriptionData === "string"
      ? descriptionData
      : descriptionData?.description || "";

  const venueHours = parseWorkingHours(hoursDataRaw);
  const amenitiesData = parseAmenities(amenitiesDataRaw);
  const contactsData = parseContacts(contactsDataRaw);
  const today = getTodayStatus(venueHours);
  const imageData = getImageData(basicData);

  const handleDeleteFeedback = (feedbackId: number, feedbackAuthor: string) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить отзыв от "${feedbackAuthor}"?`,
      )
    ) {
      deleteFeedbackMutation.mutate({feedbackId});
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/super-admin/venues")}
            className="p-2 -ml-2 text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-black text-slate-900 truncate px-4">
            {(basicData as any)?.name || basicData?.nameVenue || "Заведение"}
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
            className={{container: "!p-0"}}
            title={
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {(basicData as any)?.name ||
                  basicData?.nameVenue ||
                  "Без названия"}
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
                      {`${allCitiesData?.find((c) => c.id === detailsData?.cityId)?.title || ""} ${(basicData as any)?.address || detailsData?.address || ""}`.trim() ||
                        "Адрес не указан"}
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
                      {(basicData as any)?.averageCheck ||
                        detailsData?.averageCheck ||
                        0}{" "}
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
                      {(basicData as any)?.rating || 5.0}{" "}
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

          {Array.isArray((basicData as any)?.promosRes) &&
            (basicData as any).promosRes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 px-2">
                  Акции и скидки
                </h3>
                {(basicData as any).promosRes.map((promo: any, idx: number) => (
                  <VenueInfoCard
                    key={idx}
                    onEdit={() => console.log("Edit Promo")}
                    noPadding
                    className={{container: "border-orange-100 bg-orange-50/20"}}
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
                Object.entries(
                  detailsData.capacities as Record<string, any>,
                ).map(([title, value], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        {title}
                      </p>
                      <p className="font-bold text-sm">{String(value)} чел.</p>
                    </div>
                  </div>
                ))}
            </div>
          </VenueInfoCard>

          {(detailsData as any)?.typesOfCuisines && (
            <VenueInfoCard
              title="Типы кухни"
              icon={<UtensilsCrossed size={20} />}
              onEdit={() => console.log("Edit Cuisines")}
            >
              <div className="flex flex-wrap gap-2">
                {(detailsData as any).typesOfCuisines
                  .split(",")
                  .map((cuisine: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black border border-orange-100 uppercase tracking-wider"
                    >
                      {cuisine.trim()}
                    </span>
                  ))}
              </div>
            </VenueInfoCard>
          )}

          <VenueInfoCard
            title={<h2>График работы</h2>}
            icon={<Clock size={20} />}
            onEdit={() => setActiveModal("hours")}
          >
            <div className="space-y-4">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => {
                const open = (venueHours as any)?.[`${day}Open`];
                const close = (venueHours as any)?.[`${day}Close`];
                const labels: any = {
                  monday: "Понедельник",
                  tuesday: "Вторник",
                  wednesday: "Среда",
                  thursday: "Четверг",
                  friday: "Пятница",
                  saturday: "Суббота",
                  sunday: "Воскресенье",
                };
                const isDayOff = open === "00:00" && close === "00:00";
                const isToday = day === today.dayName;
                const hasData = open && close;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between transition-all ${isToday ? "text-orange-600" : "text-slate-600"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${isToday ? "font-black" : ""}`}
                      >
                        {labels[day]}
                      </span>
                      {isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-1" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold ${isDayOff ? "text-rose-500" : ""}`}
                    >
                      {!hasData
                        ? "Нет данных"
                        : isDayOff
                          ? "Выходной"
                          : `${open} — ${close}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </VenueInfoCard>

          <VenueInfoCard
            title={<h2>Удобства</h2>}
            icon={<ConciergeBell size={20} />}
            onEdit={() => setActiveModal("amenities")}
          >
            <VenueAmenityGrid
              amenities={amenitiesData}
              allAmenities={allAmenitiesData}
            />
          </VenueInfoCard>

          <VenueInfoCard
            title={<h2>Контакты</h2>}
            icon={<Phone size={20} />}
            onEdit={() => setActiveModal("contacts")}
          >
            <div className="space-y-4">
              {contactsData?.phoneNumber && (
                <a
                  href={`tel:${contactsData.phoneNumber}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Phone size={20} />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight">
                    {contactsData.phoneNumber}
                  </span>
                </a>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                {Object.entries(contactsData?.linksSocial || {}).map(
                  ([key, val]) => {
                    if (!val || val.trim() === "") return null;
                    const icons: any = {
                      instagram: <Instagram size={18} />,
                      whatsapp: <MessageCircle size={18} />,
                      telegram: <Send size={18} />,
                      facebook: <Facebook size={18} />,
                      website: <Globe size={18} />,
                    };
                    const labels: any = {
                      instagram: "Instagram",
                      whatsapp: "WhatsApp",
                      telegram: "Telegram",
                      facebook: "Facebook",
                      website: "Сайт",
                    };
                    return (
                      <a
                        key={key}
                        href={val.startsWith("http") ? val : `https://${val}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group"
                      >
                        <div className="text-slate-400 group-hover:text-white">
                          {icons[key] || <Globe size={18} />}
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">
                          {labels[key]}
                        </span>
                      </a>
                    );
                  },
                )}
              </div>
            </div>
          </VenueInfoCard>

          <VenueInfoCard
            title={<h2>Администратор</h2>}
            icon={<UserCog size={20} />}
            onEdit={() => navigate("/super-admin/venues")}
          >
            {publicAdminData ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">
                  {(publicAdminData.fullName || "A").charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">
                    {publicAdminData.fullName || "Имя не указано"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {publicAdminData.email}
                  </p>
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
                  basicData?.description ||
                  "Описание пока не заполнено владельцем заведения"}
              </p>
            </div>
          </VenueInfoCard>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-slate-900">
                Отзывы ({visibleFeedbacks?.length || 0})
              </h3>
              {visibleFeedbacks?.length > 0 && (
                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                  <Star size={14} className="fill-orange-500" />
                  {(
                    visibleFeedbacks.reduce((acc, f) => acc + f.rating, 0) /
                    visibleFeedbacks.length
                  ).toFixed(1)}
                </div>
              )}
            </div>
            {visibleFeedbacks && visibleFeedbacks.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {visibleFeedbacks.slice(0, 5).map((feedback: any) => (
                    <motion.div
                      key={feedback.id}
                      layout
                      initial={{opacity: 1, height: "auto"}}
                      exit={{opacity: 0, height: 0}}
                      transition={{duration: 0.3}}
                    >
                      <VenueInfoCard
                        noPadding
                        className={{container: "overflow-visible"}}
                      >
                        <div className="p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                {feedback.client?.image ? (
                                  <img
                                    src={feedback.client.image}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                ) : (
                                  <span className="text-sm font-black text-slate-400">
                                    {(feedback.client?.fullName || "U")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-800">
                                  {feedback.client?.fullName || "Аноним"}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                  {feedback.createdAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-black">
                                {feedback.rating}{" "}
                                <Star size={10} className="fill-orange-500" />
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteFeedback(
                                    feedback.id,
                                    feedback.client?.fullName || "Аноним",
                                  )
                                }
                                disabled={deleteFeedbackMutation.isPending}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Удалить отзыв"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {feedback.text}
                          </p>
                        </div>
                      </VenueInfoCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {visibleFeedbacks.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full h-14 rounded-[24px] border border-slate-100 font-black text-slate-500 hover:text-orange-500 uppercase tracking-widest text-xs"
                  >
                    Смотреть все отзывы
                  </Button>
                )}
              </div>
            ) : (
              <VenueInfoCard
                className={{container: "text-center py-10 opacity-60"}}
              >
                <MessageCircle
                  size={32}
                  className="mx-auto text-slate-300 mb-3"
                />
                <p className="text-sm text-slate-400 font-medium italic">
                  Отзывов пока нет
                </p>
              </VenueInfoCard>
            )}
          </div>
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
        initialDetails={
          detailsData || {
            cityId: 0,
            address: "",
            averageCheck: 0,
            capacities: [],
          }
        }
        basicInfo={{
          address: (basicData as any)?.address || detailsData?.address || "",
          averageCheck:
            (basicData as any)?.averageCheck || detailsData?.averageCheck || 0,
        }}
        cities={allCitiesData || []}
        onSave={(details) => updateDetailsMutation.mutate(details)}
        isSaving={updateDetailsMutation.isPending}
      />

      <VenueAmenitiesModal
        isOpen={activeModal === "amenities"}
        onClose={onClose}
        initialAmenities={amenitiesData}
        allAmenities={allAmenitiesData || []}
        onSave={(ids) => updateAmenitiesMutation.mutate(ids)}
        isSaving={updateAmenitiesMutation.isPending}
      />

      <VenueContactsModal
        isOpen={activeModal === "contacts"}
        onClose={onClose}
        initialContacts={contactsData}
        onSave={(data) => updateContactsMutation.mutate(data)}
        isSaving={updateContactsMutation.isPending}
      />

      <VenueDescriptionModal
        isOpen={activeModal === "description"}
        onClose={onClose}
        initialName={(basicData as any)?.name || basicData?.nameVenue || ""}
        initialDescription={descriptionText}
        onSave={(data) => updateDescMutation.mutate(data)}
        isSaving={updateDescMutation.isPending}
      />
    </div>
  );
};
