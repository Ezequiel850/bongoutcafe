import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Lock, Menu as MenuIcon, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
  onOpenAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        scrolled
          ? 'bg-[#1D1210]/95 backdrop-blur-md shadow-md border-b border-[#2E1D19]'
          : 'bg-[#1D1210] border-b border-[#2E1D19]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#F9F6F0] hover:text-[#D97724] transition-colors"
        >
          BON GOÛT café
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#D5C7B7]">
          <a href="#inicio" className="hover:text-[#D97724] transition-colors py-1">
            Início
          </a>
          <a href="#destaques" className="hover:text-[#D97724] transition-colors py-1">
            Destaques
          </a>
          <a href="#menu-digital" className="hover:text-[#D97724] transition-colors py-1">
            Menu Digital
          </a>
          <a href="#sobre-nos" className="hover:text-[#D97724] transition-colors py-1">
            Sobre Nós
          </a>
          <a href="#horario-local" className="hover:text-[#D97724] transition-colors py-1">
            Horário & Local
          </a>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          {/* Reservation Button */}
          <button
            onClick={onOpenReservation}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F9F6F0] bg-[#2E1E1A] hover:bg-[#3D2924] border border-[#4A352F] rounded-full transition-colors whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
            <span>Reservar Mesa</span>
          </button>

          {/* Cart / WhatsApp Order Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir sacola de pedidos"
            className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#D97724] hover:bg-[#B8621B] rounded-full transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center bg-white text-[#D97724] text-[10px] font-bold rounded-full w-4 h-4 tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* CMS Admin Link (o cadeado) */}
          <button
            onClick={onOpenAdmin}
            aria-label="Acesso ao Painel Administrativo / CMS"
            title="Área Administrativa / CMS"
            className="p-2 text-[#C4B5A6] hover:text-[#D97724] hover:bg-[#2B1B17] rounded-md transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle (os 3 risquinhos) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F9F6F0] hover:text-[#D97724] hover:bg-[#2B1B17] rounded-md transition-colors"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1D1210] border-b border-[#2E1D19] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-[#D5C7B7]">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#2B1B17] hover:text-[#F9F6F0]"
            >
              Início
            </a>
            <a
              href="#destaques"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#2B1B17] hover:text-[#F9F6F0]"
            >
              Destaques
            </a>
            <a
              href="#menu-digital"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#2B1B17] hover:text-[#F9F6F0]"
            >
              Menu Digital
            </a>
            <a
              href="#sobre-nos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#2B1B17] hover:text-[#F9F6F0]"
            >
              Sobre Nós
            </a>
            <a
              href="#horario-local"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#2B1B17] hover:text-[#F9F6F0]"
            >
              Horário & Local
            </a>
          </nav>
          <div className="pt-2 flex flex-col gap-2 border-t border-[#2E1D19]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-2.5 px-4 text-sm font-semibold text-[#F9F6F0] bg-[#2E1E1A] border border-[#4A352F] rounded-full flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D97724]" />
              Reservar Mesa
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-[#A6978B] flex items-center justify-center gap-1.5 hover:text-[#F9F6F0]"
            >
              <Lock className="w-3.5 h-3.5" />
              Painel de Gestão (Admin / CMS)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
