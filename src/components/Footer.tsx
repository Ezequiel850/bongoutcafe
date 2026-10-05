import React from 'react';
import { Instagram, Phone, MessageCircle, ShieldCheck, Lock } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenReservation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenReservation }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#211512] text-[#E8DED1] border-t border-[#3B2822] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3D2923]">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-2xl font-serif font-bold text-white block">
              BON GOÛT café
            </span>
            <p className="text-xs text-[#B5A599] leading-relaxed">
              Cafés de especialidade, pastelaria fina artesanal, sumos prensados e sandes gourmet preparadas no dia com rigor e excelência.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#86A88D]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal Certificado em Maputo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs text-[#C5B7AC]">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#destaques" className="hover:text-white transition-colors">
                  Pratos em Destaque
                </a>
              </li>
              <li>
                <a href="#menu-digital" className="hover:text-white transition-colors">
                  Menu Digital Completo
                </a>
              </li>
              <li>
                <a href="#sobre-nos" className="hover:text-white transition-colors">
                  A Nossa História
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reservar Mesa Online
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Horário de Atendimento
            </h4>
            <div className="space-y-1.5 text-xs text-[#C5B7AC]">
              <p className="font-semibold text-white">Terça a Domingo:</p>
              <p className="font-mono tabular-nums text-[#D97724]">08:00 – 19:00</p>
              <p className="font-semibold text-white pt-1">Segunda-Feira:</p>
              <p className="text-[#8E7E74]">Encerrado</p>
            </div>
            <p className="text-[11px] text-[#A6978B] pt-1">
              {settings.deliveryNotice}
            </p>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Contactos &amp; Redes Sociais
            </h4>
            <div className="space-y-2 text-xs text-[#C5B7AC]">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors font-mono tabular-nums"
              >
                <Phone className="w-3.5 h-3.5 text-[#D97724]" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsappRaw || '258847849629'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors font-mono"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#4A5D4E]" />
                <span>WhatsApp: +258 84 784 9629</span>
              </a>
              <a
                href="https://instagram.com/bon_gout789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#D97724] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#D97724]" />
                <span>@bon_gout789</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#8C7B71] hover:text-[#E8DED1] transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Área de Gestão / Admin CMS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7B71]">
          <p>© {currentYear} BON GOÛT café. Todos os direitos reservados. Maputo, Moçambique.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#6D5D53]">Halal Certified Kitchen</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#6D5D53]">Eat, Sip, Gather</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
