import {
  BasicInfoData,
  superAdminVenueService,
  VenueContactData,
  VenueDetailsData,
  VenueWorkingHours,
} from "@/features/super-admin/venue";
import {Amenity, City} from "@/shared/types";
import {useQueries} from "@tanstack/react-query";

export const useVenueDetails = (id: number) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["venue-basic", id],
        queryFn: () => superAdminVenueService.getBasic(id),
      },
      {
        queryKey: ["venue-details", id],
        queryFn: () => superAdminVenueService.getDetails(id),
      },
      {
        queryKey: ["venue-hours", id],
        queryFn: () => superAdminVenueService.getHours(id),
      },
      {
        queryKey: ["venue-amenities", id],
        queryFn: () => superAdminVenueService.getAmenities(id),
      },
      {
        queryKey: ["venue-contacts", id],
        queryFn: () => superAdminVenueService.getContacts(id),
      },
      {
        queryKey: ["venue-public-admin", id],
        queryFn: () => superAdminVenueService.getPublicAdmin(id),
      },
      {
        queryKey: ["venue-description", id],
        queryFn: () => superAdminVenueService.getDescription(id),
      },
      {
        queryKey: ["venue-feedbacks", id],
        queryFn: () => superAdminVenueService.getFeedbacks(id),
      },
      {
        queryKey: ["all-amenities"],
        queryFn: () => superAdminVenueService.getAllAmenities(),
      },
      {
        queryKey: ["all-cities"],
        queryFn: () => superAdminVenueService.getAllCities(),
      },
    ],
  });

  const [
    basic,
    details,
    hours,
    amenities,
    contacts,
    publicAdmin,
    description,
    feedbacks,
    allAmenities,
    allCities,
  ] = results;

  const basicData = basic.data as BasicInfoData;
  const detailsData = details.data as VenueDetailsData;
  const hoursData = hours.data as VenueWorkingHours;
  const amenitiesData = amenities.data as number[];
  const contactsData = contacts.data as VenueContactData;
  const publicAdminData = publicAdmin.data as any;
  const descriptionData = description.data as any;
  const feedbacksData = feedbacks.data as any[];
  const allAmenitiesData = allAmenities.data as Amenity[];
  const allCitiesData = allCities.data as City[];

  console.log(results);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  return {
    basicData,
    detailsData,
    hoursData,
    amenitiesData,
    contactsData,
    publicAdminData,
    descriptionData,
    feedbacksData,
    allAmenitiesData,
    allCitiesData,
    isLoading,
    isError,
  };
};
