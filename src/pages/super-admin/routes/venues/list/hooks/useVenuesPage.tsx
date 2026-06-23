import {superAdminVenueService} from "@/api/super-admin/venue";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {toast} from "sonner";

export const useVenuesPage = () => {
  const queryClient = useQueryClient();
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useInfiniteQuery({
      queryKey: ["super-admin-venues"],
      queryFn: ({pageParam = 0}) =>
        superAdminVenueService.getAllVenues(pageParam, 10),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 10 ? allPages.length * 10 : undefined,
      initialPageParam: 0,
    });

  const venues = data?.pages.flatMap((page) => page || []) || [];
  const deleteMutation = useMutation({
    mutationFn: (id: number) => superAdminVenueService.deleteVenue(id),
    onSuccess: () => {
      toast.success("Заведение удалено");
      queryClient.invalidateQueries({queryKey: ["super-admin-venues"]});
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка удаления"),
  });

  return {
    venues,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    deleteMutation,
  };
};
