import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ChevronLeft, FileText, UserCog, AlertCircle, Edit3} from "lucide-react";
import {Button} from "@/shared/ui";
import {useVenueDetailMutations} from "./hooks/useVenueDetailMutation";
import {
  getImageData,
  WorkingHoursSchema,
} from "@/features/venue-detail/utils/venueParsers";
import {useVenueDetails} from "./hooks/useVenueDetails";
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
  VenueSectionCard,
  VenueHeroSection,
  CapacitiesSectionCard,
  VenueDetailLayout,
  VenuePromoSection,
  DescriptionSectionCard,
  VenueAdminCard,
} from "@/features/venue-detail";
import {ReplaceAdminModal} from "../shared/ReplaceAdminModal";
import {CuisinesModal} from "../shared/CuisinesModal";
import {VenueDetailsSectionCard} from "../../../../../features/venue-detail/ui/VenueDetailsSectionCard";

type ModalType =
  | null
  | "hours"
  | "details"
  | "amenities"
  | "cuisines"
  | "contacts"
  | "description"
  | "replace-admin";

export const EditButton = ({onClick}: {onClick: () => void}) => {
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
  const capacities = detailsData ? Object.entries(detailsData?.capacities) : [];
  const imageData = getImageData(basicData?.images);

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
      <VenueDetailLayout
        heroSection={
          <VenueHeroSection
            basicData={basicData}
            images={imageData}
            onDeleteImage={(id) => deleteImageMutation.mutate(id)}
            onAddImage={(file) => addImageMutation.mutate(file)}
            isProcessing={
              addImageMutation.isPending || deleteImageMutation.isPending
            }
          />
        }
        promoSection={
          <VenuePromoSection
            actions={<EditButton onClick={() => console.log("hi")} />}
            imageUrl={imageData[0].url}
            basicData={basicData}
            delay={0.05}
          />
        }
        detailSection={
          <VenueDetailsSectionCard
            basicData={basicData}
            capacities={capacities}
            actions={<EditButton onClick={() => setActiveModal("details")} />}
            delay={0.1}
          />
        }
        capacitiesCard={
          <CapacitiesSectionCard
            size="lg"
            variant="orange"
            capacities={capacities}
            delay={0.15}
          />
        }
        adminCard={
          <VenueAdminCard
            size="lg"
            variant="orange"
            actions={
              <EditButton onClick={() => setActiveModal("replace-admin")} />
            }
            adminData={publicAdminData}
            delay={0.2}
          />
        }
        descriptionCard={
          <DescriptionSectionCard
            descriptionText={descriptionText}
            size="lg"
            variant="orange"
            actions={
              <EditButton onClick={() => setActiveModal("description")} />
            }
            delay={0.25}
          />
        }
        hoursCard={
          <WorkingHoursSectionCard
            size="lg"
            variant="orange"
            hours={venueHours}
            delay={0.2}
            actions={<EditButton onClick={() => setActiveModal("hours")} />}
          />
        }
        cuisinesCard={
          <CuisinesSectionCard
            variant="orange"
            size="lg"
            detailsData={detailsData}
            actions={<EditButton onClick={() => setActiveModal("cuisines")} />}
            delay={0.25}
          />
        }
        amenitiesCard={
          <AmenitySectionCard
            variant="orange"
            size="lg"
            delay={0.25}
            amenities={amenitiesData}
            actions={<EditButton onClick={() => setActiveModal("amenities")} />}
          />
        }
        contactsCard={
          <ContactsSectionCard
            variant="orange"
            size="lg"
            contactsData={contactsData}
            delay={0.3}
            actions={<EditButton onClick={() => setActiveModal("contacts")} />}
          />
        }
        feedbackSection={
          <FeedbackSectionCard
            variant="orange"
            size="lg"
            venueId={id}
            service="SUPER_ADMIN"
            delay={0.6}
          />
        }
      />

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
          address: basicData?.address || "",
          averageCheck: basicData?.averageCheck || 0,
          capacities: detailsData?.capacities || {},
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
      <ReplaceAdminModal
        isOpen={activeModal === "replace-admin"}
        onClose={onClose}
        venueId={id}
        description={basicData?.name ?? ""}
      />
      <CuisinesModal
        isOpen={activeModal === "cuisines"}
        onClose={onClose}
        venueId={id}
        description={basicData?.name ?? ""}
      />
    </div>
  );
};
