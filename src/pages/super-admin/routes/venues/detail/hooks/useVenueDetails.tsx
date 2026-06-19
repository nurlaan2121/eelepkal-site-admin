import {devService} from "@/api/dev";
import {
  GetAdminForVenue,
  GetBasicInfoData,
  superAdminVenueService,
} from "@/api/super-admin/venue";
import {
  AmenitiesDataType,
  ContactsDataType,
  GetVenueWorkingHours,
  VenueDetailsType,
} from "@/features/venue";
import {Amenity, City} from "@/shared/types";
import {useQueries} from "@tanstack/react-query";
import {useMemo} from "react";

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
        queryKey: ["all-amenities"],
        queryFn: () => devService.getAllAmenities(),
      },
      {
        queryKey: ["all-cities"],
        queryFn: () => devService.getAllCities(),
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
    allAmenities,
    allCities,
  ] = results;

  const data = useMemo(() => {
    // Если любой из запросов еще не загрузился, можно возвращать null или частичные данные
    if (results.some((r) => r.isLoading)) return null;

    return {
      basicData: basic.data as GetBasicInfoData,
      detailsData: details.data as VenueDetailsType,
      hoursData: hours.data as GetVenueWorkingHours,
      amenitiesData: amenities.data as AmenitiesDataType,
      contactsData: contacts.data as ContactsDataType,
      publicAdminData: publicAdmin.data as GetAdminForVenue,
      descriptionData: description.data as any,
      allAmenitiesData: allAmenities.data as Amenity[],
      allCitiesData: allCities.data as City[],
    };
  }, [results]); // useMemo пересчитается только если изменится массив results

  return {
    ...data,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
};
