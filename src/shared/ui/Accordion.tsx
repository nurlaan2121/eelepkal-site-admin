import React, {useState, createContext, useContext} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

// 1. Создаем контекст для передачи состояния
const AccordionContext = createContext<{
  isExpanded: boolean;
  toggle: () => void;
} | null>(null);

export const Accordion = ({children}: {children: React.ReactNode}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <AccordionContext.Provider
      value={{isExpanded, toggle: () => setIsExpanded(!isExpanded)}}
    >
      <div className="space-y-4">{children}</div>
    </AccordionContext.Provider>
  );
};

// 2. Блок, который всегда виден
export const AccordionContent = ({children, visibleCount, totalCount}: any) => {
  const {isExpanded} = useContext(AccordionContext)!;
  // Логика обрезания элементов теперь живет здесь
  return <>{children(isExpanded)}</>;
};

// 3. Кнопка управления
export const AccordionTrigger = ({
  total,
  visible,
}: {
  total: number;
  visible: number;
}) => {
  const {isExpanded, toggle} = useContext(AccordionContext)!;
  if (total <= visible) return null;

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center justify-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors"
    >
      {isExpanded ? (
        <>
          Скрыть <ChevronUp size={16} />
        </>
      ) : (
        <>
          Ещё {total - visible} <ChevronDown size={16} />
        </>
      )}
    </button>
  );
};
