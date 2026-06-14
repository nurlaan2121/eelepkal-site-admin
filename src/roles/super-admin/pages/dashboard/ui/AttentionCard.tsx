import {Button, DashboardCard, Input, Modal} from "@/shared/ui";
import {useMutation} from "@tanstack/react-query";
import {FormEvent, useState} from "react";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {AlertCircle, Link, Users} from "lucide-react";
import {superAdminManageOfAdminsService} from "@/features/super-admin/admin";

export const AttentionCard = () => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimUrl, setClaimUrl] = useState("");

  const claimMutation = useMutation({
    mutationFn: (url: string) =>
      superAdminManageOfAdminsService.claimVenueByLink({url}),
    onSuccess: (data) => {
      toast.success(data.message || "Запрос успешно отправлен");
      setIsClaimModalOpen(false);
      setClaimUrl("");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Ошибка при отправке запроса",
      );
    },
  });

  const handleSubmitClaim = (e: FormEvent) => {
    e.preventDefault();
    if (!claimUrl.trim()) {
      toast.error("Введите ссылку на заведение");
      return;
    }
    claimMutation.mutate(claimUrl);
  };

  return (
    <>
      {/* Notifications/Alerts */}
      <DashboardCard title="Внимание">
        <div className="space-y-4 p-5">
          <motion.div
            whileTap={{scale: 0.98}}
            className="flex gap-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-100/50"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-tight">
                Ошибки оплаты
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed font-medium">
                3 транзакции требуют ручного подтверждения
              </p>
            </div>
          </motion.div>

          <motion.div
            whileTap={{scale: 0.98}}
            className="flex gap-4 p-4 rounded-2xl bg-brand-50 border-2 border-brand-100/50"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-brand-900 uppercase tracking-tight">
                Новые отзывы
              </p>
              <p className="text-xs text-brand-700 mt-0.5 leading-relaxed font-medium">
                Получено 15 новых отзывов за последние 24ч
              </p>
            </div>
          </motion.div>
          <Button
            onClick={() => setIsClaimModalOpen(true)}
            variant="gradient"
            className="w-full"
          >
            Отправить запрос
          </Button>
        </div>
      </DashboardCard>

      {/* Claim Venue Modal */}
      <Modal
        open={isClaimModalOpen}
        className="max-w-md w-full"
        header={{
          title: "Отправить запрос",
          icon: <Link size={20} className="text-brand-700" />,
        }}
        onClose={() => setIsClaimModalOpen(false)}
      >
        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <Input
            labelIcon={<Link size={18} />}
            label="Ссылка на заведение"
            type="url"
            value={claimUrl}
            onChange={(e) => setClaimUrl(e.target.value)}
            placeholder="https://eelepkal.ru/venue/..."
            required
            name="link"
          />

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={claimMutation.isPending}
              className="w-full "
            >
              {claimMutation.isPending ? "Отправка..." : "Отправить запрос"}
            </Button>

            <Button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              variant="outline"
              className="w-full"
            >
              Отмена
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
