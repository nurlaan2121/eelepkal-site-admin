import {
  superAdminVenueService,
  VenueCondition,
  VenueListItem,
} from "@/features/super-admin/venue";
import {Button, Input, Modal} from "@/shared/ui";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {Settings2, Wallet, X} from "lucide-react";

export const BookingConditionsModal = ({
  venue,
  onClose,
}: {
  venue: VenueListItem;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<VenueCondition>({
    venueId: venue.venueId,
    deposit: 0,
    cancelAllowed: true,
    cancellationDeadline: "03:00",
    editAllowed: true,
    editingDeadline: "05:00",
  });

  const {isLoading, isFetching} = useQuery({
    queryKey: ["venue-conditions", venue.venueId],
    queryFn: async () => {
      const data = await superAdminVenueService.getVenueConditions(
        venue.venueId,
      );

      const formatTimeArray = (arr: number[]) => {
        if (!arr || arr.length < 2) return "00:00";
        return `${String(arr[0]).padStart(2, "0")}:${String(arr[1]).padStart(2, "0")}`;
      };

      const mapped: VenueCondition = {
        venueId: venue.venueId,
        deposit: data.deposit || 0,
        cancelAllowed: data.cancellationAllowed,
        cancellationDeadline: formatTimeArray(data.cancellationDeadline),
        editAllowed: data.editingAllowed,
        editingDeadline: formatTimeArray(data.editingDeadline),
      };

      setForm(mapped);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: () => superAdminVenueService.updateVenueCondition(form),
    onSuccess: () => {
      toast.success("Условия бронирования обновлены!");
      onClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка сохранения"),
  });

  const loading = isLoading || isFetching || mutation.isPending;
  return (
    <Modal
      className=" md:max-w-2xl"
      onClose={onClose}
      open
      isShaded
      header={{
        title: "Условия бронирования",
        description: venue.name,
        icon: <Settings2 size={20} />,
      }}
      footer={
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || loading}
          className="w-full h-12 font-black text-sm"
        >
          {mutation.isPending ? "Сохранение..." : "Сохранить условия"}
        </Button>
      }
    >
      <div className="flex-1 overflow-y-auto space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400">
              Загрузка условий...
            </p>
          </div>
        ) : (
          <>
            {/* Deposit */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-brand-600" />
                <p className="font-black text-slate-800 text-sm uppercase tracking-widest">
                  Депозит
                </p>
              </div>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
                {[0, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setForm((f) => ({...f, deposit: amt}))}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black border-2 transition-all ${
                      form.deposit === amt
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {amt === 0 ? "Без депозита" : `${amt} сом`}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                min="0"
                value={form.deposit}
                onChange={(e) =>
                  setForm((f) => ({...f, deposit: Number(e.target.value)}))
                }
                placeholder="Или введите сумму"
                name="deposit"
                className="border-2"
              />
            </div>

            {/* Cancellation */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-800 text-sm uppercase tracking-widest">
                    Отмена бронирования
                  </p>
                </div>
                <button
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      cancelAllowed: !f.cancelAllowed,
                      cancellationDeadline: f.cancelAllowed ? "00:00" : "03:00",
                    }))
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.cancelAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.cancelAllowed ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
              {form.cancelAllowed && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    За сколько часов до визита
                  </p>
                  <input
                    type="time"
                    value={form.cancellationDeadline}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        cancellationDeadline: e.target.value,
                      }))
                    }
                    className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              )}
              {!form.cancelAllowed && (
                <p className="text-xs text-slate-400 font-medium">
                  Отмена не допускается (00:00)
                </p>
              )}
            </div>

            {/* Editing */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-800 text-sm uppercase tracking-widest">
                  Изменение бронирования
                </p>
                <button
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      editAllowed: !f.editAllowed,
                      editingDeadline: f.editAllowed ? "00:00" : "05:00",
                    }))
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.editAllowed ? "bg-brand-primary" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.editAllowed ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
              {form.editAllowed && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    За сколько часов до визита
                  </p>
                  <input
                    type="time"
                    value={form.editingDeadline}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        editingDeadline: e.target.value,
                      }))
                    }
                    className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              )}
              {!form.editAllowed && (
                <p className="text-xs text-slate-400 font-medium">
                  Изменение не допускается (00:00)
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
