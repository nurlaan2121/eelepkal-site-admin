import {adminVenueService} from "@/api/admin/venue";
import {UserRole} from "@/api/auth";
import {superAdminVenueService} from "@/api/super-admin/venue";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";

export const useVenueFeedbacks = (venueId: number, service: UserRole) => {
  const queryClient = useQueryClient();
  const isSuperAdmin = service === "SUPER_ADMIN";
  const {
    data: feedbacksData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["venue-feedbacks", venueId],
    queryFn: ({pageParam = 0}) =>
      isSuperAdmin
        ? superAdminVenueService.getFeedbacks(venueId!, pageParam, 12)
        : adminVenueService.getFeedbacks(venueId!, pageParam, 12),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length * 12 : undefined;
    },
    initialPageParam: 0,
    enabled: !!venueId,
  });

  const [deletedFeedbackIds, setDeletedFeedbackIds] = useState<Set<number>>(
    new Set(),
  );
  const allFeedbacks = feedbacksData?.pages.flatMap((page) => page || []) || [];
  const visibleFeedbacks = allFeedbacks.filter(
    (f) => !deletedFeedbackIds.has(f.id),
  );

  // Feedback mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: ({feedbackId}: {feedbackId: number}) =>
      superAdminVenueService.deleteFeedback(venueId, feedbackId),
    onSuccess: (_, {feedbackId}) => {
      toast.success("Отзыв успешно удален");
      setDeletedFeedbackIds((prev) => new Set(prev).add(feedbackId));
      queryClient.invalidateQueries({queryKey: ["venue-feedbacks", venueId]});
    },
    onError: () => toast.error("Ошибка при удалении отзыва"),
  });
  const handleDeleteFeedback = (feedbackId: number, feedbackAuthor: string) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить отзыв от "${feedbackAuthor}"?`,
      )
    ) {
      deleteFeedbackMutation.mutate({feedbackId});
    }
  };
  return {
    isLoading,
    isFetchingNextPage,
    visibleFeedbacks,
    handleDeleteFeedback: isSuperAdmin && handleDeleteFeedback,
    fetchNextPage,
    hasNextPage,
    isPending: isSuperAdmin && deleteFeedbackMutation.isPending,
  };
};
