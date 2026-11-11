import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';

interface AccordionItemProps {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  key?: React.Key;
}

export default function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
  className = "bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all",
  headerClassName = "w-full min-h-[48px] flex items-center justify-between p-5 text-left font-heading text-xl font-bold text-[#0a0a0c] hover:bg-slate-50 transition-colors cursor-pointer",
  contentClassName = "px-5 pb-5 pt-2 border-t border-slate-200 bg-slate-50",
}: AccordionItemProps) {
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={headerClassName}
      >
        <span>{title}</span>
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown
            className={`w-6 h-6 transition-colors ${isOpen ? 'text-[#dc2626]' : 'text-slate-600'}`}
            aria-hidden="true"
          />
        </m.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={panelId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className={contentClassName}>
              {children}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
