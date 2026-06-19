import {Button, DashboardCard} from "@/shared/ui";
import {MessageSquare, Star} from "lucide-react";

export const Reviews = () => {
  return (
    <DashboardCard title="Свежие отзывы">
      <div className="p-5 space-y-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="space-y-3 relative pl-4 border-l-2 border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                Вчера
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium italic">
              "Прекрасное обслуживание и вкусная еда. Очень уютная атмосфера!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-[10px] flex items-center justify-center font-black text-white shadow-lg shadow-brand-100">
                AK
              </div>
              <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">
                Айсулуу К.
              </span>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-2xl gap-2 font-black uppercase tracking-widest border-2"
        >
          <MessageSquare size={18} />
          Все отзывы
        </Button>
      </div>
    </DashboardCard>
  );
};
