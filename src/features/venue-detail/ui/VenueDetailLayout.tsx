import {PageLayout} from "@/shared/layouts";

// shared/ui/VenueDetailLayout.tsx
interface VenueDetailLayoutProps {
  className?: string;
  title?: string;
  description?: string;
  heroSection: React.ReactNode;
  promoSection: React.ReactNode;
  detailSection: React.ReactNode;
  adminCard: React.ReactNode;
  capacitiesCard: React.ReactNode;
  descriptionCard: React.ReactNode;
  hoursCard: React.ReactNode;
  cuisinesCard: React.ReactNode;
  amenitiesCard: React.ReactNode;
  contactsCard: React.ReactNode;
  feedbackSection: React.ReactNode;
}

export const VenueDetailLayout = ({
  className,
  title,
  description,
  heroSection,
  promoSection,
  detailSection,
  hoursCard,
  adminCard,
  capacitiesCard,
  descriptionCard,
  cuisinesCard,
  amenitiesCard,
  contactsCard,
  feedbackSection,
}: VenueDetailLayoutProps) => {
  return (
    <PageLayout className={className} title={title} description={description}>
      {heroSection}
      {promoSection}
      {detailSection}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {capacitiesCard}
        {adminCard}
      </div>
      {descriptionCard}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hoursCard}
        {cuisinesCard}
      </div>
      {amenitiesCard}
      {contactsCard}
      {feedbackSection}
    </PageLayout>
  );
};
