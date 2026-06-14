import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Store,
  Info,
  Clock,
  UtensilsCrossed,
  ConciergeBell,
  Phone,
  FileText,
  X,
  Loader2,
  Undo2,
} from "lucide-react";
import {toast} from "sonner";
import {Button, Modal} from "@/shared/ui";
import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Step1BasicInfo} from "./ui/Step1BasicInfo";
import {Step2Details} from "./ui/Step2Details";
import {Step3Hours} from "./ui/Step3Hours";
import {Step4Cuisines} from "./ui/Step4Cuisines";
import {Step5Amenities} from "./ui/Step5Amenities";
import {Step6Contacts} from "./ui/Step6Contacts";
import {Step7Conditions} from "./ui/Step7Conditions";
import {SuccessScreen} from "./ui/SuccessScreen";
import {useCreateVenueMutations} from "./hooks/useCreateVenueMutations";
import {PageLayout} from "@/shared/layouts";

const STEPS = [
  {id: 1, title: "Основная информация", icon: Store},
  {id: 2, title: "Детали", icon: Info},
  {id: 3, title: "Время работы", icon: Clock},
  {id: 4, title: "Тип кухни", icon: UtensilsCrossed},
  {id: 5, title: "Услуги", icon: ConciergeBell},
  {id: 6, title: "Контакты", icon: Phone},
  {id: 7, title: "Условия", icon: FileText},
];
// ─────────── Main Wizard ───────────
export const CreateVenueWizard = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    venueId,
    resetCreation,
    basicInfo,
    details,
  } = useVenueCreationStore();
  const [isComplete, setIsComplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );

  const {
    step1Mutation,
    step2Mutation,
    step3Mutation,
    step4Mutation,
    step5Mutation,
    step6Mutation,
    step7Mutation,
  } = useCreateVenueMutations(() => setIsComplete(true));
  // Check if form has any data
  const hasFormData =
    (basicInfo.nameVenue && basicInfo.nameVenue.trim() !== "") ||
    (basicInfo.description && basicInfo.description.trim() !== "") ||
    (basicInfo.imageUrls && basicInfo.imageUrls.length > 0) ||
    details.cityId ||
    (details.address && details.address.trim() !== "") ||
    venueId;

  // Handle browser back/forward buttons and page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormData && !isComplete) {
        e.preventDefault();
        e.returnValue =
          "У вас есть несохраненные данные. Вы уверены, что хотите выйти?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasFormData, isComplete]);

  const resetAndNavigate = () => {
    resetCreation();
    setShowConfirmDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate("/super-admin/venues");
    }
  };

  const handleCancel = () => {
    if (hasFormData) {
      setShowConfirmDialog(true);
    } else {
      resetAndNavigate();
    }
  };

  const stepMutations: Record<number, any> = {
    1: step1Mutation,
    2: step2Mutation,
    3: step3Mutation,
    4: step4Mutation,
    5: step5Mutation,
    6: step6Mutation,
    7: step7Mutation,
  };
  const handleNext = async () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !basicInfo.nameVenue) {
      toast.error("Введите название заведения");
      return;
    }
    if (currentStep === 2 && (!details.cityId || !details.address)) {
      toast.error("Заполните город и адрес");
      return;
    }

    // For steps 2-7, we need venueId
    if (currentStep > 1 && !venueId) {
      toast.error("Ошибка: ID заведения не найден. Начните сначала.");
      return;
    }

    try {
      const currentMutation = stepMutations[currentStep];

      if (currentMutation) {
        // Шаг 1 не требует аргументов, остальные требуют venueId
        if (currentStep === 1) {
          await currentMutation.mutateAsync();
        } else {
          await currentMutation.mutateAsync(venueId);
        }
      }

      // Если это последний шаг — стопаем (там внутри onSuccess всё сбросится)
      if (currentStep === 7) return;

      // Move to next step
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Step error:", error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepLoading = stepMutations[currentStep]?.isPending ?? false;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Details />;
      case 3:
        return <Step3Hours />;
      case 4:
        return <Step4Cuisines />;
      case 5:
        return <Step5Amenities />;
      case 6:
        return <Step6Contacts />;
      case 7:
        return <Step7Conditions />;
      default:
        return <Step1BasicInfo />;
    }
  };

  if (isComplete) {
    return (
      <SuccessScreen
        // Ситуация 1: Просто чистим черновик и улетаем. Никаких морганий формы!
        onNavigateToList={() => {
          resetCreation();
          navigate("/super-admin/venues");
        }}
        // Ситуация 2: Чистим черновик и откатываем экран назад к первому шагу
        onCreateMore={() => {
          resetCreation();
          setIsComplete(false);
        }}
      />
    );
  }

  return (
    <PageLayout
      className="max-w-5xl mx-auto"
      title="Создание заведения"
      description="Заполните данные для регистрации нового ресторана"
    >
      {/* Stepper - Fixed position */}
      <div className="sticky top-16 z-10 mb-6 bg-white/80 backdrop-blur-lg p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      currentStep >= step.id
                        ? "bg-brand-primary text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Шаг {step.id}
                    </p>
                    <p
                      className={`text-sm font-bold ${currentStep >= step.id ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 lg:w-12 h-0.5 ${currentStep > step.id ? "bg-brand-primary" : "bg-slate-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{x: 20, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: -20, opacity: 0}}
              transition={{duration: 0.2}}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Actions Bar */}
        <div className="flex-wrap gap-3 px-6 md:px-8 py-5 bg-white border-t border-slate-100 flex justify-between sticky bottom-0 z-10">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? handleCancel : handlePrev}
            className="gap-2"
            disabled={isStepLoading}
          >
            <ChevronLeft size={18} />
            {currentStep === 1 ? "Отмена" : "Назад"}
          </Button>

          <Button
            onClick={handleNext}
            className="gap-2"
            disabled={isStepLoading}
          >
            {isStepLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : currentStep === 7 ? (
              <>
                <span>Создать заведение</span>
                <Check size={18} />
              </>
            ) : (
              <>
                <span>Продолжить</span>
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Modal
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        header={{
          title: "Выйти из создания?",
          description:
            " У вас есть несохраненные данные. Все введенные данные будут потеряны.",
          icon: <Undo2 size={20} className="text-red-600" />,
          iconClassName: "bg-red-100 mb-3",
        }}
      >
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowConfirmDialog(false)}
            className="flex-1 h-12"
          >
            Продолжить создание
          </Button>
          <Button
            onClick={resetAndNavigate}
            className="flex-1 h-12 bg-red-500 hover:bg-red-600"
          >
            Выйти и сбросить
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};
