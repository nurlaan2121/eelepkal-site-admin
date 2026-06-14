import {
  VenueListItem,
  superAdminVenueService,
  GetPaymentDetailResponse,
} from "@/features/super-admin/venue";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {toast} from "sonner";
import {CreditCard, Plus} from "lucide-react";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui";
import {PaymentList} from "./PaymentList";
import {PaymentContentState} from "./PaymentContentState";
import {PaymentForm} from "./PaymentForm";
import {usePaymentModal} from "./usePaymentModal";

type Mode = "view" | "edit" | "create";

export const PaymentModal = ({
  venue,
  onClose,
}: {
  venue: VenueListItem;
  onClose: () => void;
}) => {
  const [mode, setMode] = useState<Mode>("view");
  const [editingPayment, setEditingPayment] =
    useState<GetPaymentDetailResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrPreview, setQrPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {data: payments = [], isLoading} = useQuery<GetPaymentDetailResponse[]>(
    {
      queryKey: ["payment-details", venue.venueId],
      queryFn: () => superAdminVenueService.getPaymentDetails(venue.venueId),
    },
  );

  const {handleSubmit, updateMutation, deleteMutation} = usePaymentModal(
    venue,
    handleClose,
    qrCodeUrl,
    isUploading,
    editingPayment,
  );

  const handleEditPayment = (payment: GetPaymentDetailResponse) => {
    setEditingPayment(payment);
    setQrPreview(payment.qrcodeUrl || "");
    setMode("edit");
  };

  const handleDeletePayment = (paymentId: number) => {
    if (confirm("Удалить эти реквизиты?")) {
      deleteMutation.mutate(paymentId);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      toast.info("Загрузка QR кода...");
      const qrUrl = await superAdminVenueService.uploadFileToS3(file);
      setQrCodeUrl(qrUrl);
      toast.success("QR код загружен");
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка загрузки файла";
      toast.error(errorMessage);
      setQrPreview("");
    } finally {
      setIsUploading(false);
    }
  };
  function handleClose() {
    setMode("view");
    setEditingPayment(null);
    setQrPreview("");
    setQrCodeUrl("");
    onClose();
  }
  const headerTitle = {
    create: "Добавить реквизиты",
    view: "Реквизиты для оплаты",
    edit: "Изменить реквизиты",
  };
  const isForm = mode === "edit" || mode === "create";

  return (
    <Modal
      className="w-full"
      isShaded
      open
      onClose={handleClose}
      header={{
        title: headerTitle[mode],
        description: venue.name,
        icon: <CreditCard size={20} />,
      }}
      footer={
        isForm ? (
          <div className="space-y-3">
            <Button
              type="submit"
              form="payment-form"
              disabled={isUploading || updateMutation.isPending}
              className="w-full h-12 font-black text-sm"
            >
              {isUploading
                ? "Загрузка QR кода..."
                : editingPayment
                  ? "Сохранить изменения"
                  : "Добавить реквизиты"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setEditingPayment(null);
                setQrPreview("");
                setMode("view");
              }}
              disabled={isUploading}
              className="w-full h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setMode("create")}
            className="w-full h-12 font-black text-sm"
          >
            <Plus size={18} className="mr-2" />
            Добавить реквизиты
          </Button>
        )
      }
    >
      <PaymentContentState
        isLoading={isLoading}
        isEmpty={payments.length === 0}
      >
        {isForm ? (
          <PaymentForm
            editingPayment={editingPayment}
            onSubmit={handleSubmit}
            handleFileChange={handleFileChange}
            isUploading={isUploading}
            qrPreview={qrPreview}
          />
        ) : (
          <PaymentList
            payments={payments}
            isDeleting={deleteMutation.isPending}
            onDelete={handleDeletePayment}
            onEdit={handleEditPayment}
          />
        )}
      </PaymentContentState>
    </Modal>
  );
};
