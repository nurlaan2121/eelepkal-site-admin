import {
  GetPaymentDetailResponse,
  PaymentDetail,
  superAdminVenueService,
  VenueListItem,
} from "@/features/super-admin/venue";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const usePaymentModal = (
  venue: VenueListItem,
  handleClose: () => void,
  qrCodeUrl: string,
  isUploading: boolean,
  editingPayment: GetPaymentDetailResponse | null,
) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (paymentId: number) =>
      superAdminVenueService.deletePaymentDetail(paymentId),
    onSuccess: () => {
      toast.success("Реквизиты удалены");
      queryClient.invalidateQueries({
        queryKey: ["payment-details", venue.venueId],
      });
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка удаления"),
  });
    
  const addMutation = useMutation({
    mutationFn: (newPayment: PaymentDetail) =>
      superAdminVenueService.addPaymentDetail(venue.venueId, newPayment),
    onSuccess: () => {
      toast.success("Реквизиты успешно добавлены!");
      queryClient.invalidateQueries({
        queryKey: ["payment-details", venue.venueId],
      });
      handleClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка сохранения"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      updatedPayment,
      paymentId,
    }: {
      updatedPayment: PaymentDetail;
      paymentId: number;
    }) => superAdminVenueService.updatePaymentDetail(paymentId, updatedPayment),
    onSuccess: () => {
      toast.success("Реквизиты успешно обновлены!");
      queryClient.invalidateQueries({
        queryKey: ["payment-details", venue.venueId],
      });
      handleClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Ошибка обновления"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const bankName = formData.get("bankName")?.toString() || "";
    const bankAccountNumber =
      formData.get("bankAccountNumber")?.toString() || "";
    const taxIdentificationNumber =
      formData.get("taxIdentificationNumber")?.toString() || "";

    if (!bankName || !bankAccountNumber || !taxIdentificationNumber) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (isUploading) {
      toast.info("Дождитесь загрузки QR кода");
      return;
    }

    try {
      const paymentObject: PaymentDetail = {
        venueTitle: venue.name,
        bankAccountNumber,
        bankName,
        taxIdentificationNumber,
        qrCodeUrl,
      };
      if (editingPayment) {
        await updateMutation.mutateAsync({
          updatedPayment: paymentObject,
          paymentId: editingPayment.id,
        });
      } else {
        await addMutation.mutateAsync(paymentObject);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Ошибка сохранения";
      toast.error(errorMessage);
    }
  };
  return {deleteMutation, updateMutation, handleSubmit};
};
