import {s3Service} from "@/api/s3";
import {
  superAdminVenueService,
  VenueContactData,
  VenueDetailsData,
} from "@/api/super-admin/venue";
import { VenueWorkingHoursType } from "@/features/venue";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useVenueDetailMutations = (
  id: number,
  onClose: () => void,
) => {
  const queryClient = useQueryClient();

  // Image mutations
  const addImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const url = await s3Service.uploadFile(file);
      return superAdminVenueService.addVenueImage(id, url);
    },
    onSuccess: () => {
      toast.success("Фотография добавлена");
      queryClient.invalidateQueries({queryKey: ["venue-basic", id]});
    },
    onError: () => toast.error("Ошибка при загрузке фото"),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) =>
      superAdminVenueService.deleteVenueImage(id, imageId),
    onSuccess: () => {
      toast.success("Фотография удалена");
      queryClient.invalidateQueries({queryKey: ["venue-basic", id]});
    },
    onError: () => toast.error("Ошибка при удалении фото"),
  });


  // Hours mutation
  const updateHoursMutation = useMutation({
    mutationFn: (hours: VenueWorkingHoursType) =>
      superAdminVenueService.addVenueHours(id, hours),
    onSuccess: () => {
      toast.success("График работы обновлен");
      queryClient.invalidateQueries({queryKey: ["venue-hours", id]});
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка при обновлении графика";
      toast.error(message);
    },
  });

  const updateAmenitiesMutation = useMutation({
    mutationFn: (amenitiesId: number[]) =>
      superAdminVenueService.addVenueAmenities(id, {amenitiesId}),
    onSuccess: () => {
      toast.success("Удобства обновлены");
      queryClient.invalidateQueries({queryKey: ["venue-amenities", id]});
      onClose();
    },
    onError: () => toast.error("Ошибка при обновлении удобств"),
  });

  const updateContactsMutation = useMutation({
    mutationFn: (data: VenueContactData) =>
      superAdminVenueService.addVenueContacts(id, data),
    onSuccess: () => {
      toast.success("Контакты обновлены");
      queryClient.invalidateQueries({queryKey: ["venue-contacts", id]});
      onClose();
    },
    onError: () => toast.error("Ошибка при обновлении контактов"),
  });

  const updateDescMutation = useMutation({
    mutationFn: ({name, description}: {name: string; description: string}) =>
      superAdminVenueService.updateNameAndDescription(id, name, description),
    onSuccess: () => {
      toast.success("Информация обновлена");
      queryClient.invalidateQueries({queryKey: ["venue-basic", id]});
      queryClient.invalidateQueries({queryKey: ["venue-description", id]});
      onClose();
    },
    onError: () => toast.error("Ошибка при обновлении информации"),
  });

  const updateDetailsMutation = useMutation({
    mutationFn: (details: VenueDetailsData) =>
      superAdminVenueService.addVenueDetails(id, details),
    onSuccess: () => {
      toast.success("Детали заведения обновлены");
      queryClient.invalidateQueries({queryKey: ["venue-details", id]});
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка при обновлении деталей";
      toast.error(message);
    },
  });
  return {
    addImageMutation,
    deleteImageMutation,
    updateHoursMutation,
    updateAmenitiesMutation,
    updateContactsMutation,
    updateDescMutation,
    updateDetailsMutation,
  };
};
