import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {GetBasicInfoData} from "../model/types";

interface Props extends InitialSecitonCardProps {
  basicData?: GetBasicInfoData;
  imageUrl?: string;
}

export const VenuePromoSection = ({
  actions,
  basicData,
  imageUrl,
  delay,
}: Props) => {
  if (!basicData || basicData.promosRes.length === 0 || !imageUrl) return null;
  return (
    Array.isArray(basicData?.promosRes) &&
    basicData.promosRes.length > 0 && (
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 px-2">
          Акции и скидки
        </h3>{" "}
        {basicData.promosRes.map((promo, idx) => (
          <VenueSectionCard
            title="Специальое предложение"
            key={idx}
            actions={actions}
            transition={{delay}}
            className={"border-orange-100 bg-orange-50/20"}
          >
            <div className="flex h-32">
              <div className="w-32 bg-slate-100  overflow-hidden">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover rounded-2xl"
                  alt={promo.title}
                />
              </div>
              <div className="flex-1 px-4 flex flex-col">
                <div className="w-12 h-8 flex items-center justify-center bg-rose-500 text-white text-sm font-black rounded-lg">
                  -{promo.discount || 20}%
                </div>
                <h4 className="font-black text-slate-900 leading-tight mb-1">
                  {promo.title || "Специальое предложение"}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {promo.description ||
                    "Успейте воспользоваться выгодным предложением от нашего заведения"}
                </p>
              </div>
            </div>
          </VenueSectionCard>
        ))}
      </div>
    )
  );
};
