import {
  superAdminVenueService,
  VenueListItem,
} from "@/features/super-admin/venue";
import {Button, Modal} from "@/shared/ui";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Check, Users, X} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {motion} from "framer-motion";

export const ReplaceAdminModal = ({
  venue,
  onClose,
}: {
  venue: VenueListItem;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  const {data: admins = [], isLoading} = useQuery({
    queryKey: ["admins-for-replace"],
    queryFn: superAdminVenueService.getAdminsForReplace,
  });

  const mutation = useMutation({
    mutationFn: (newAdminId: number) =>
      superAdminVenueService.replaceAdmin(venue.venueId, newAdminId),
    onSuccess: () => {
      toast.success("Администратор успешно заменён!");
      queryClient.invalidateQueries({queryKey: ["super-admin-venues"]});
      onClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка при замене"),
  });

  return (
    <Modal
      onClose={onClose}
      open={true}
      isShaded={true}
      header={{
        title: "Заменить администратора",
        description: venue.name,
        icon: <Users size={20} />,
      }}
      footer={
        <Button
          onClick={() => selectedAdminId && mutation.mutate(selectedAdminId)}
          disabled={!selectedAdminId || mutation.isPending}
          className="w-full h-12 font-black text-sm"
        >
          {mutation.isPending ? "Сохранение..." : "Назначить администратора"}
        </Button>
      }
    >
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))
        ) : admins.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm font-medium">
            Доступных администраторов нет
          </div>
        ) : (
          admins.map((admin) => (
            <button
              key={admin.adminId}
              onClick={() => setSelectedAdminId(admin.adminId)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                selectedAdminId === admin.adminId
                  ? "border-brand-primary bg-brand-50"
                  : "border-slate-100 hover:border-slate-200 bg-white"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-black text-sm flex-shrink-0">
                {admin.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 text-sm truncate">
                  {admin.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">{admin.email}</p>
              </div>
              {selectedAdminId === admin.adminId && (
                <div className="ml-auto w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </Modal>
  );
};
