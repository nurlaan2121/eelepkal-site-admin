import {CreditCard} from "lucide-react";
import {ReactNode} from "react";

export const PaymentContentState = ({
  children,
  isLoading,
  isEmpty,
}: {
  children: ReactNode;
  isLoading: boolean;
  isEmpty: boolean;
}) => {
  if (isLoading) {
    return Array.from({length: 2}).map((_, i) => (
      <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
    ));
  }
  if (isEmpty) {
    return (
      <div className="text-center py-10">
        <CreditCard size={40} className="text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 font-medium text-sm">
          Реквизиты не добавлены
        </p>
      </div>
    );
  }
  return <>{children}</>;
};
