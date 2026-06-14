import {useEffect, useState} from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {useInView} from "react-intersection-observer";
import {Plus, Search, Store} from "lucide-react";
import {Button, Input} from "@/shared/ui";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {superAdminVenueService} from "@/features/super-admin/venue";
import {PageLayout} from "@/shared/layouts";
import {VenueSkeleton, VenueCard} from "./ui/card";

// ─────────── Main Page ───────────
export const SuperAdminVenuesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {ref, inView} = useInView({threshold: 0.1});
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => superAdminVenueService.deleteVenue(id),
    onSuccess: () => {
      toast.success("Заведение удалено");
      queryClient.invalidateQueries({queryKey: ["super-admin-venues"]});
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка удаления"),
  });

  const filteredVenues = venues.filter(
    (v) =>
      (v.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (v.address?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  return (
    <PageLayout
      title="Заведения"
      description={`${venues.length} заведений в системе`}
      actions={
        <Button
          onClick={() => navigate("/super-admin/venues/create")}
          variant="gradient"
          className="rounded-2xl gap-2 min-w-[220px]"
        >
          <Plus size={20} />
          <span>Добавить заведение</span>
        </Button>
      }
    >
      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <Input
          size="md"
          variant="outline"
          icon={<Search size={18} />}
          type="text"
          name="search-venue"
          placeholder="Поиск по названию или адресу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          Array.from({length: 4}).map((_, i) => <VenueSkeleton key={i} />)
        ) : filteredVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Store size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Заведения не найдены</p>
            {searchTerm && (
              <p className="text-xs text-slate-300 mt-1">
                Попробуйте изменить запрос
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredVenues.map((venue) => (
              <VenueCard
                key={venue.venueId}
                venue={venue}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
                onClick={() => navigate(`/super-admin/venues/${venue.venueId}`)}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={ref} className="py-6 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          )}
          {!hasNextPage && venues.length > 0 && !isLoading && (
            <p className="text-slate-200 text-xs font-bold uppercase tracking-widest">
              Все заведения загружены
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
