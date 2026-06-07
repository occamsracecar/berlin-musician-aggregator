import type { ReactNode } from "react";

type FaqItemProps = {
  question: string;
  children: ReactNode;
};

/**
 * Single question-and-answer block on the FAQ page.
 */
export function FaqItem({ question, children }: FaqItemProps) {
  return (
    <div className="border-b border-zinc-100 pb-5 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-semibold text-zinc-900">{question}</h3>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700">
        {children}
      </div>
    </div>
  );
}
