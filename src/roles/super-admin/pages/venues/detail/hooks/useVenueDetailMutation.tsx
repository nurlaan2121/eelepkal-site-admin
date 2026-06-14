import {
  superAdminVenueService,
  VenueContactData,
  VenueDetailsData,
  VenueWorkingHours,
} from "@/features/super-admin/venue";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useVenueDetailMutations = (
  id: number,
  setDeletedFeedbackIds: React.Dispatch<React.SetStateAction<Set<number>>>,
  onClose: () => void,
) => {
  const queryClient = useQueryClient();

  // Image mutations
  const addImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const url = await superAdminVenueService.uploadFileToS3(file);
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

  // Feedback mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: ({feedbackId}: {feedbackId: number}) =>
      superAdminVenueService.deleteFeedback(id, feedbackId),
    onSuccess: (_, {feedbackId}) => {
      toast.success("Отзыв успешно удален");
      setDeletedFeedbackIds((prev) => new Set(prev).add(feedbackId));
      queryClient.invalidateQueries({queryKey: ["venue-feedbacks", id]});
    },
    onError: () => toast.error("Ошибка при удалении отзыва"),
  });

  // Hours mutation
  const updateHoursMutation = useMutation({
    mutationFn: (hours: VenueWorkingHours) =>
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
    deleteFeedbackMutation,
    updateHoursMutation,
    updateAmenitiesMutation,
    updateContactsMutation,
    updateDescMutation,
    updateDetailsMutation,
  };
};
