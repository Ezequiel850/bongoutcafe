export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isSpecial: boolean;
  isAvailable: boolean;
  isHalal: boolean;
  tags: string[];
  image?: string;
  prepTime?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappRaw: string;
  whatsappLink: string;
  operatingHours: string;
  address: string;
  mapsUrl: string;
  announcement: string;
  announcementActive: boolean;
  deliveryAvailable: boolean;
  deliveryNotice: string;
  heroVideoUrl: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Inquiry {
  id: string;
  type: 'reservation' | 'delivery' | 'contact';
  customerName: string;
  customerPhone: string;
  date?: string;
  time?: string;
  guests?: number;
  items?: OrderItem[];
  totalAmount?: number;
  deliveryAddress?: string;
  notes?: string;
  status: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';
  createdAt: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}
