import {Building2, AlertCircle} from "lucide-react";
import {Button} from "@/shared/ui";
import {MyVenuePageSkeleton} from "./ui/MyVenuePageSkeleton";
import {useAdminVenuePage} from "./hooks/useVenuePage";
import {
  AmenitySectionCard,
  ContactsSectionCard,
  DescriptionSectionCard,
  FeedbackSectionCard,
  VenueAdminCard,
  VenueDetailLayout,
  VenueDetailsSectionCard,
  VenueHeroSection,
  VenuePromoSection,
} from "@/features/venue-detail";
import {WorkingHoursSectionCard} from "@/features/venue-detail/ui/WorkingHoursSectionCard";
import {CuisinesSectionCard} from "@/features/venue-detail/ui/CuisinesSectionCard";
import {CapacitiesSectionCard} from "../../../../features/venue-detail/ui/CapacitiesSectionCard";
import {getImageData} from "@/api/super-admin/venue";

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
    amenitiesData,
    capacitiesList,
  } = useAdminVenuePage();

  const venueId = basicData?.venueId;
  const images = getImageData(basicData?.images);
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
    <div className="space-y-6">
      <VenueDetailLayout
        title="Моё заведение"
        description="Управление информацией о заведении"
        className="max-w-7xl mx-auto"
        heroSection={<VenueHeroSection basicData={basicData} images={images} />}
        promoSection={
          <VenuePromoSection
            basicData={basicData}
            imageUrl={images[0].url}
            delay={0.03}
          />
        }
        detailSection={
          <VenueDetailsSectionCard delay={0.05} basicData={basicData} />
        }
        capacitiesCard={
          <CapacitiesSectionCard capacities={capacitiesList} delay={0.1} />
        }
        adminCard={<VenueAdminCard adminData={publicAdminData} delay={0.15} />}
        descriptionCard={
          <DescriptionSectionCard
            descriptionText={descriptionText}
            delay={0.2}
          />
        }
        hoursCard={<WorkingHoursSectionCard hours={hoursData} delay={0.25} />}
        cuisinesCard={
          <CuisinesSectionCard detailsData={detailsData} delay={0.3} />
        }
        amenitiesCard={
          <AmenitySectionCard amenities={amenitiesData} delay={0.35} />
        }
        contactsCard={
          <ContactsSectionCard contactsData={contactsData} delay={0.5} />
        }
        feedbackSection={
          <FeedbackSectionCard delay={0.6} venueId={venueId} service="ADMIN" />
        }
      />
      {/* Image Gallery
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
            {images.slice(1).map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <img
                  src={img.url}
                  alt={`Фото ${img.id + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </VenueSectionCard>
      )} */}
    </div>
  );
};
