import {Clock, Star, Wallet, Users, Building2, AlertCircle} from "lucide-react";
import {motion} from "framer-motion";
import {Button} from "@/shared/ui";
import {MyVenuePageSkeleton} from "./ui/MyVenuePageSkeleton";
import {useAdminVenuePage} from "./hooks/useVenuePage";
import {
  AmenitySectionCard,
  ContactsSectionCard,
  FeedbackSectionCard,
  VenueSectionCard,
} from "@/features/venue";
import {QuickInfoGrid} from "./ui/QuickInfoGrid";
import {WorkingHoursSectionCard} from "@/features/venue/ui/WorkingHoursSectionCard";
import {CuisinesSectionCard} from "@/features/venue/ui/CuisinesSectionCard";

// ─────────── Main Page ───────────
export const AdminMyVenuePage = () => {
  const {
    isLoading,
    isError,
    basicData,
    detailsData,
    hoursData,
    contactsData,
    publicAdminData,
    descriptionText,
    images,
    mainImage,
    amenitiesData,
    capacitiesList,
  } = useAdminVenuePage();

  const venueId = basicData?.venueId;

  if (isLoading) {
    return <MyVenuePageSkeleton />;
  }

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
        <Button variant="outline" className="h-12 px-6 rounded-2xl font-black">
          Обновить страницу
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Моё заведение
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Управление информацией о заведении
          </p>
        </div>
      </div>

      {/* Hero Image */}
      {mainImage && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-brand-100"
        >
          <img
            src={mainImage}
            alt={basicData?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-2">
              {basicData?.name}
            </h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-amber-400"
                />
                {basicData?.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Wallet size={16} />≈ {basicData?.averageCheck} сом
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Clock size={16} />
                {basicData?.todayWorkingHours}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Info Grid */}
      <QuickInfoGrid basicData={basicData} publicAdminData={publicAdminData} />
      {/* Description */}
      {descriptionText && (
        <VenueSectionCard
          title="О заведении"
          icon={Building2}
          transition={{delay: 0.3}}
        >
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {descriptionText}
          </p>
        </VenueSectionCard>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours */}
        <WorkingHoursSectionCard hours={hoursData} delay={0.35} />

        {/* Capacities & Cuisines */}
        <div className="flex flex-col gap-4">
          {/* Capacities */}
          <VenueSectionCard
            title="Вместимость"
            icon={Users}
            transition={{delay: 0.4, ease: "linear"}}
          >
            <div className="grid grid-cols-2 gap-3">
              {capacitiesList?.map(([title, value]) => (
                <div
                  key={title}
                  className="bg-gradient-to-br from-brand-50 to-white rounded-xl p-4 border border-brand-100"
                >
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    {title}
                  </p>
                  <p className="text-2xl font-black text-brand-700">
                    {String(value)}{" "}
                    <span className="text-sm font-bold text-slate-400">
                      мест
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </VenueSectionCard>

          {/* Cuisines */}
          <CuisinesSectionCard
            className="flex-1"
            detailsData={detailsData}
            delay={0.4}
          />
        </div>
      </div>

      {/* Amenities */}
      <AmenitySectionCard amenities={amenitiesData} delay={0.45} />

      {/* Contacts */}
      <ContactsSectionCard contactsData={contactsData} delay={0.5} />

      {/* Image Gallery */}
      {images && images.length > 1 && (
        <VenueSectionCard
          title="Фотогалерея"
          icon={Building2}
          transition={{delay: 0.55}}
          actions={
            <span className="text-sm font-bold text-slate-400">
              {images.length} фото
            </span>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.slice(1).map((img, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <img
                  src={img}
                  alt={`Фото ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </VenueSectionCard>
      )}

      {/* Feedbacks Section */}
      {venueId && (
        <FeedbackSectionCard delay={0.6} venueId={venueId} service="ADMIN" />
      )}
    </div>
  );
};
