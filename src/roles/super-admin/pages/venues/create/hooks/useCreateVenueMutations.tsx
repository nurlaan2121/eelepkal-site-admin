import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {superAdminVenueService} from "@/features/super-admin/venue";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useCreateVenueMutations = (onComplete: () => void) => {
  const queryClient = useQueryClient();

  const {
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
      //   setLocalVenueId(data.idVenue); // Save to local state immediately
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
      onComplete();
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Ошибка сохранения"),
  });
  return {
    step1Mutation,
    step2Mutation,
    step3Mutation,
    step4Mutation,
    step5Mutation,
    step6Mutation,
    step7Mutation,
  };
};
