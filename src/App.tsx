import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { MenuItem, MenuCategory, SiteSettings, CartItem } from './types';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedHighlights } from './components/FeaturedHighlights';
import { MenuSection } from './components/MenuSection';
import { ItemModal } from './components/ItemModal';
import { CartDrawer } from './components/CartDrawer';
import { ReservationModal } from './components/ReservationModal';
import { AboutSection } from './components/AboutSection';
import { LocationHoursSection } from './components/LocationHoursSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';

const FALLBACK_SETTINGS: SiteSettings = {
  businessName: 'BON GOÛT café',
  tagline: 'Eat, Sip, Gather - Uma Experiência Gastronómica Inesquecível',
  phone: '+258 84 784 9629',
  whatsappRaw: '258847849629',
  whatsappLink: 'https://wa.me/message/M7A56MF7GPR',
  operatingHours: 'Terça-Feira a Domingo: 08:00 - 19:00 (Segunda-Feira: Encerrado)',
  address: 'Maputo, Moçambique',
  mapsUrl: 'https://maps.app.goo.gl/8bLVEGu2MqVgV3Hp7',
  announcement: '☕ Bem-vindo ao BON GOÛT café! Experimente o novo Dubai Chocolate Latte e o Strawberry Matcha Latte. 100% Halal Certificado.',
  announcementActive: true,
  deliveryAvailable: true,
  deliveryNotice: 'Entregas rápidas disponíveis em toda a grande Maputo via WhatsApp ou Telefone.',
  heroVideoUrl: 'https://res.cloudinary.com/c7zjsyeu/video/upload/v1790963159/gemini_generated_video_90f51a7f.mp4'
};

export default function App() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Panels State
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart State (stored in localStorage for convenience)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bon_gout_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bon_gout_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Load initial data from backend API
  const loadData = useCallback(async () => {
    try {
      const [menuRes, settingsRes] = await Promise.all([
        api.getMenu().catch(() => null),
        api.getSettings().catch(() => null),
      ]);

      if (menuRes) {
        setCategories(menuRes.categories || []);
        setItems(menuRes.items || []);
      }
      if (settingsRes) {
        setSettings((prev) => ({ ...prev, ...settingsRes }));
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check URL hash for admin route (/admin or #admin)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, quantity: number = 1, notes?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.item.id === item.id && ci.notes === notes);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { item, quantity, notes }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleExploreMenu = () => {
    const el = document.getElementById('menu-digital');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#D97724] animate-spin" />
        <p className="font-serif text-xl font-bold text-[#2B1B17]">BON GOÛT café</p>
        <p className="text-xs text-[#7A695F]">A preparar a melhor experiência gastronómica...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2B1B17]">
      {/* Top Announcement Banner */}
      <AnnouncementBanner
        message={settings.announcement}
        isActive={settings.announcementActive}
      />

      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section with Looping Background Video */}
        <Hero
          settings={settings}
          onExploreMenu={handleExploreMenu}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Featured Highlights (Dubai Chocolate Latte, Burger, Matcha, Chamussa) */}
        <FeaturedHighlights
          items={items}
          onSelectItem={(item) => setSelectedItemForModal(item)}
          onAddToCart={(item) => handleAddToCart(item, 1)}
        />

        {/* Complete Categorized Digital Menu */}
        <MenuSection
          categories={categories}
          items={items}
          onSelectItem={(item) => setSelectedItemForModal(item)}
          onAddToCart={(item) => handleAddToCart(item, 1)}
        />

        {/* About Us & Quality Signals */}
        <AboutSection />

        {/* Location, Hours & Delivery Information */}
        <LocationHoursSection
          settings={settings}
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Item Details Modal */}
      <ItemModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Bag / WhatsApp Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        settings={settings}
      />

      {/* Admin CMS Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        items={items}
        settings={settings}
        onMenuUpdated={loadData}
        onSettingsUpdated={loadData}
      />
    </div>
  );
}
