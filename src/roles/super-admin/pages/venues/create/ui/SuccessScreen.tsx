import {useVenueCreationStore} from "@/app/store/venueCreationStore";
import {Button} from "@/shared/ui";
import {motion} from "framer-motion";
import {PartyPopper} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface SuccessScreenProps {
  onNavigateToList: () => void;
  onCreateMore: () => void;
}

export const SuccessScreen = ({
  onNavigateToList,
  onCreateMore,
}: SuccessScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <motion.div
        initial={{scale: 0}}
        animate={{scale: 1}}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
      >
        <PartyPopper size={48} className="text-white" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Заведение успешно добавлено!
        </h2>
        <p className="text-slate-500">Все данные сохранены в систему</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button onClick={onNavigateToList} className="w-full h-12">
          Перейти к списку
        </Button>
        <Button variant="ghost" onClick={onCreateMore} className="w-full h-12">
          Добавить ещё
        </Button>
      </div>
    </div>
  );
};
