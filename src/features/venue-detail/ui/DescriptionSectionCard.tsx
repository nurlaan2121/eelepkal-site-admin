import {InitialSecitonCardProps, VenueSectionCard} from "./VenueSectionCard";
import {Building2} from "lucide-react";

interface Props extends InitialSecitonCardProps {
  descriptionText?: string;
}

export const DescriptionSectionCard = ({
  size,
  variant,
  actions,
  delay,
  descriptionText,
}: Props) => {
  return (
    <VenueSectionCard
      size={size}
      title="О заведении"
      icon={Building2}
      variant={variant}
      actions={actions}
      transition={{delay}}
    >
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
        {descriptionText || "О заведении нечего не написано"}
      </p>
    </VenueSectionCard>
  );
};
