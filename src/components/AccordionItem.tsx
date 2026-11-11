import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

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
  className = 'bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-colors',
  headerClassName = 'w-full min-h-[48px] flex items-center justify-between p-5 text-left font-heading text-xl font-bold text-[#0a0a0c] hover:bg-slate-50 transition-colors cursor-pointer',
  contentClassName = 'px-5 pb-5 pt-2 border-t border-slate-200 bg-slate-50',
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
        <span
          className={`flex-shrink-0 ml-2 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <ChevronDown
            className={`w-6 h-6 transition-colors ${isOpen ? 'text-[#dc2626]' : 'text-slate-600'}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        id={panelId}
        data-open={isOpen ? 'true' : 'false'}
        aria-hidden={!isOpen}
        {...(!isOpen ? { inert: true } : {})}
        className="accordion-grid"
      >
        <div className="accordion-inner">
          <div className={`accordion-content ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
