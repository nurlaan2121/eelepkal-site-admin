import {Star, Trash2, User, UserStar} from "lucide-react";
import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {useEffect} from "react";
import {VenueFeedbackData} from "../model/feedback/types";
import {useVenueFeedbacks} from "../model/feedback/useVenueFeedbacks";
import {UserRole} from "@/api/auth";
import {useInView} from "react-intersection-observer";

interface FeedbackSectionCardProps extends InitialSecitonCardProps {
  venueId: number;
  service: UserRole;
}

export const FeedbackSectionCard = ({
  venueId,
  service,
  className,
  variant,
  delay,
  actions,
}: FeedbackSectionCardProps) => {
  const {ref, inView} = useInView({threshold: 0.1});
  const {
    isFetchingNextPage,
    isLoading,
    isPending,
    handleDeleteFeedback,
    hasNextPage,
    fetchNextPage,
    visibleFeedbacks,
  } = useVenueFeedbacks(venueId, service);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);
  if (isLoading)
    return (
      <div className="space-y-4">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-xl animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-full mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  if (visibleFeedbacks.length === 0)
    return (
      <div className="text-center py-12">
        <UserStar size={48} className="text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-bold">Отзывов пока нет</p>
        <p className="text-xs text-slate-300 mt-1">
          Отзывы клиентов появятся здесь
        </p>
      </div>
    );
  return (
    <VenueSectionCard
      title="Отзывы клиентов"
      icon={UserStar}
      transition={{delay}}
      actions={
        <span className="text-sm font-bold text-slate-400">
          {visibleFeedbacks.length} отзывов
        </span>
      }
      variant={variant}
      className={className}
    >
      <div className="space-y-4">
        {visibleFeedbacks.map((feedback: VenueFeedbackData) => (
          <div
            key={feedback.id}
            className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {/* Client Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  {feedback.client.image ? (
                    <img
                      src={feedback.client.image}
                      alt={feedback.client.fullName || "Клиент"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-brand-600" />
                  )}
                </div>

                {/* Feedback Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-black text-slate-900">
                      {feedback.client.fullName || "Анонимный клиент"}
                    </p>
                    <span className="text-xs text-slate-400">
                      {feedback.createdAt}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < feedback.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {feedback.text}
                  </p>
                </div>
              </div>
              {handleDeleteFeedback && (
                <button
                  onClick={() =>
                    handleDeleteFeedback(
                      feedback.id,
                      feedback.client?.fullName || "Аноним",
                    )
                  }
                  disabled={isPending}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Удалить отзыв"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Infinite Scroll Sentinel */}
        <div ref={ref} className="py-6 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          )}
          {!hasNextPage && visibleFeedbacks.length > 0 && (
            <p className="text-slate-200 text-xs font-bold uppercase tracking-widest">
              Все отзывы загружены
            </p>
          )}
        </div>
      </div>
    </VenueSectionCard>
  );
};
