import {adminVenueService} from "@/api/admin/venue";
import {WorkingHoursSchema} from "@/features/venue/utils/venueParsers";
import {useQueries} from "@tanstack/react-query";
import {useMemo} from "react";

export const useAdminVenuePage = () => {
  const results = useQueries({
    queries: [
      {queryKey: ["admin-venue-basic"], queryFn: adminVenueService.getBasic},
      {
        queryKey: ["admin-venue-details"],
        queryFn: adminVenueService.getDetails,
      },
      {queryKey: ["admin-venue-hours"], queryFn: adminVenueService.getHours},
      {
        queryKey: ["admin-venue-amenities"],
        queryFn: adminVenueService.getAmenities,
      },
      {
        queryKey: ["admin-venue-contacts"],
        queryFn: adminVenueService.getContacts,
      },
      {
        queryKey: ["admin-venue-public-admin"],
        queryFn: adminVenueService.getPublicAdmin,
      },
      {
        queryKey: ["admin-venue-description"],
        queryFn: adminVenueService.getDescription,
      },
    ],
  });

  const [basic, details, hours, amenities, contacts, publicAdmin, description] =
    results;
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const data = useMemo(() => {
    // Если любой из запросов еще не загрузился, можно возвращать null или частичные данные
    if (
      isLoading ||
      isError ||
      !basic.data ||
      !details.data ||
      !amenities.data ||
      !contacts.data ||
      !publicAdmin.data
    )
      return null;

    const basicData = basic.data;
    const detailsData = details.data;
    const images = Object.values(basicData.images);
    const amenitiesData = amenities.data;
    const hoursData = WorkingHoursSchema.parse(hours.data);

    return {
      basicData,
      detailsData,
      hoursData,
      contactsData: contacts.data,
      publicAdminData: publicAdmin.data,
      descriptionText: description.data || "",
      amenitiesData,
      images,
      mainImage: images[0] || "",
      capacitiesList: Object.entries(detailsData.capacities),
    };
  }, [
    basic.data,
    details.data,
    hours.data,
    amenities.data,
    contacts.data,
    publicAdmin.data,
    description.data,
    isLoading,
    isError,
  ]);
  return {
    ...data,
    isLoading,
    isError,
  };
};
