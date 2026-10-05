import React from 'react';
import { ArrowDown, MessageCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onExploreMenu: () => void;
  onOpenCart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onExploreMenu, onOpenCart }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappRaw || '258847849629'}?text=${encodeURIComponent(
    'Olá BON GOÛT café! Gostaria de consultar o menu e fazer um pedido para entrega.'
  )}`;

  return (
    <section id="inicio" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1D1210]">
      {/* Cinematic Looping Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          src={settings.heroVideoUrl || 'https://res.cloudinary.com/c7zjsyeu/video/upload/v1790963159/gemini_generated_video_90f51a7f.mp4'}
        />
        {/* Measured Scrim Overlay - Clear in the center for maximum video visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D1210]/75 via-[#1D1210]/25 to-[#1D1210]/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 text-center text-white flex flex-col items-center justify-between min-h-[85vh] sm:min-h-[80vh]">
        {/* Unboxed Status Kicker - Fixed at top */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium text-[#E7D6C4] tracking-wide bg-[#1D1210]/50 px-4 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
          <span className="flex items-center gap-1.5 text-[#D97724]">
            <Clock className="w-3.5 h-3.5" />
            Terça a Domingo: 08h - 19h
          </span>
          <span className="text-[#A48F82]" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 text-[#86A88D]">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Halal Certificado
          </span>
          <span className="text-[#A48F82]" aria-hidden="true">·</span>
          <span>Maputo, Moçambique</span>
        </div>

        {/* Espaço Vazio para Exibir o Vídeo de Fundo com Clareza no Mobile */}
        <div className="w-full h-[28vh] sm:h-[18vh] md:h-[14vh] flex items-center justify-center pointer-events-none select-none" aria-hidden="true" />

        {/* Hero Lower Content */}
        <div className="w-full flex flex-col items-center">
          {/* Hero Title - Smaller and elegant */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-white/95 tracking-wide mb-6 sm:mb-8 max-w-2xl mx-auto leading-snug text-balance drop-shadow-md">
            Cafés, Sobremesas Artesanais &amp; Sandes Deliciosas
          </h1>

          {/* Dual Primary CTAs - Rounded-full (mais arredondados) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto mb-8 sm:mb-10 w-full sm:w-auto">
            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-[#2B1B17] bg-[#F9F6F0] hover:bg-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explorar Menu Digital</span>
              <ArrowDown className="w-4 h-4 text-[#D97724] group-hover:translate-y-0.5 transition-transform" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#4A5D4E] hover:bg-[#3D4D40] border border-[#5C7261] rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#8CD19D]" />
              <span>Encomendar no WhatsApp</span>
            </a>
          </div>

          {/* Value Points Strip */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-left w-full">
          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-[#D97724] tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Exclusividade
            </span>
            <p className="text-sm font-serif font-bold text-white">Dubai Chocolate Latte</p>
            <p className="text-xs text-[#C4B5A6]">Crocante kataifi &amp; pistácio puro</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-[#86A88D] tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Rigor &amp; Confiança
            </span>
            <p className="text-sm font-serif font-bold text-white">Certificação Halal</p>
            <p className="text-xs text-[#C4B5A6]">Ingredientes e preparo 100% seguros</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-[#D97724] tracking-wider">Artesanal</span>
            <p className="text-sm font-serif font-bold text-white">Doces &amp; Pães Diários</p>
            <p className="text-xs text-[#C4B5A6]">Receitas preparadas no próprio café</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-medium text-[#86A88D] tracking-wider">Conveniência</span>
            <p className="text-sm font-serif font-bold text-white">Delivery Rápido</p>
            <p className="text-xs text-[#C4B5A6]">Entregas na grande Maputo</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
