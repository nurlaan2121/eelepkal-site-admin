import React from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {UserPlus, Search, Shield} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "sonner";
import {AddAdminModal} from "./ui/AddAdminModal";
import {Button, Input} from "@/shared/ui";
import {superAdminManageOfAdminsService} from "@/features/super-admin/admin";
import {AdminsSkeleton} from "./ui/AdminsSkeleton";
import {AdminCard} from "./ui/AdminCard";
import {PageLayout} from "@/shared/layouts";

// ─── Main Page ───
export const SuperAdminAdminsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const {data: admins = [], isLoading} = useQuery({
    queryKey: ["super-admin-admins"],
    queryFn: superAdminManageOfAdminsService.getAdmins,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => superAdminManageOfAdminsService.deleteAdmin(id),
    onSuccess: () => {
      toast.success("Администратор удалён");
      queryClient.invalidateQueries({queryKey: ["super-admin-admins"]});
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка удаления"),
  });

  const filtered = admins.filter(
    (a) =>
      (a.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (a.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (a.workAddress?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  return (
    <PageLayout
      title="Администраторы"
      description={`${admins.length} администраторов в системе`}
      actions={
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          className="w-full md:w-auto rounded-2xl gap-2 min-w-[220px]"
        >
          <UserPlus size={18} />
          <span>Добавить администратора</span>
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
          name="search-admin"
          placeholder="Поиск по имени, email или адресу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-50">
            {Array.from({length: 4}).map((_, i) => (
              <AdminsSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">
              Администраторы не найдены
            </p>
            {searchTerm ? (
              <p className="text-xs text-slate-300 mt-1">
                Попробуйте изменить запрос
              </p>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 flex items-center justify-center gap-2 h-11 px-6 bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-600 hover:to-brand-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-900/30 active:scale-95 transition-all border-2 border-brand-600"
              >
                <UserPlus size={16} />
                <span>Добавить администратора</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((admin) => (
                <motion.div
                  key={admin.id}
                  initial={{opacity: 0, x: -8}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: 8}}
                  transition={{duration: 0.2}}
                >
                  <AdminCard
                    admin={admin}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isDeleting={deleteMutation.isPending}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({queryKey: ["super-admin-admins"]});
        }}
      />
    </PageLayout>
  );
};
