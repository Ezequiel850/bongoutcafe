import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface AnnouncementBannerProps {
  message: string;
  isActive: boolean;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ message, isActive }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!isActive || dismissed || !message) return null;

  return (
    <aside aria-label="Aviso do café" className="bg-[#180E0C] text-[#F9F6F0] text-xs py-2.5 px-4 border-b border-[#2E1D19] relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden mx-auto">
          <span className="flex items-center gap-1.5 text-[#D97724] font-semibold uppercase tracking-wider text-[11px] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            Novidade
          </span>
          <span className="text-[#8E7B73] shrink-0" aria-hidden="true">·</span>
          <p className="truncate text-center text-sm/relaxed font-medium">
            {message}
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-[#4A5D4E] font-medium text-[11px] shrink-0 bg-[#4A5D4E]/20 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-[#79987F]" />
            100% Halal
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#B39E8A] hover:text-white transition-colors p-1 shrink-0 rounded"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
