import { MenuItem, MenuCategory, SiteSettings, Inquiry } from '../types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_ITEMS,
  DEFAULT_SETTINGS,
  DEFAULT_INQUIRIES,
} from '../data/initialData';

const STORAGE_KEYS = {
  MENU: 'bon_gout_menu_store',
  SETTINGS: 'bon_gout_settings_store',
  INQUIRIES: 'bon_gout_inquiries_store',
  ADMIN_PASS: 'bon_gout_admin_password',
};

// Helpers for localStorage fallback
function getLocalMenu(): { categories: MenuCategory[]; items: MenuItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local menu:', e);
  }
  return { categories: DEFAULT_CATEGORIES, items: DEFAULT_ITEMS };
}

function saveLocalMenu(data: { categories: MenuCategory[]; items: MenuItem[] }) {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving local menu:', e);
  }
}

function getLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading local settings:', e);
  }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving local settings:', e);
  }
}

function getLocalInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading local inquiries:', e);
  }
  return DEFAULT_INQUIRIES;
}

function saveLocalInquiries(inquiries: Inquiry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.warn('Error saving local inquiries:', e);
  }
}

export const api = {
  // Menu items & categories (Universal: Server + Vercel/Static Resilient)
  async getMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/menu', { signal: controller.signal });
      clearTimeout(timeoutId);

      // Verify that response is valid JSON and not an HTML SPA fallback page (like on Vercel)
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          saveLocalMenu(data);
          return data;
        }
      }
    } catch {
      // Backend not running (e.g. static host like Vercel)
    }

    // Seamless fallback to persistent localStorage or initial dataset
    return getLocalMenu();
  },

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const newItem: MenuItem = {
      id: 'item-' + Date.now(),
      name: item.name || 'Novo Prato',
      category: item.category || 'especialidades',
      price: Number(item.price) || 0,
      description: item.description || '',
      isSpecial: Boolean(item.isSpecial),
      isAvailable: item.isAvailable !== false,
      isHalal: item.isHalal !== false,
      tags: Array.isArray(item.tags) ? item.tags : [],
      image: item.image || '',
      prepTime: item.prepTime || '10 min',
    };

    // Update local store immediately
    const current = getLocalMenu();
    const updated = {
      categories: current.categories,
      items: [newItem, ...current.items],
    };
    saveLocalMenu(updated);

    // Also attempt remote API if available
    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch {
      // Offline/Vercel static
    }

    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const current = getLocalMenu();
    const index = current.items.findIndex((it) => it.id === id);
    let updatedItem: MenuItem;

    if (index !== -1) {
      updatedItem = {
        ...current.items[index],
        ...updates,
        price: updates.price !== undefined ? Number(updates.price) : current.items[index].price,
        id,
      };
      current.items[index] = updatedItem;
      saveLocalMenu(current);
    } else {
      updatedItem = { ...updates, id } as MenuItem;
    }

    // Also attempt remote API
    try {
      await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Offline/Vercel static
    }

    return updatedItem;
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean; id: string }> {
    const current = getLocalMenu();
    current.items = current.items.filter((it) => it.id !== id);
    saveLocalMenu(current);

    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    } catch {
      // Offline/Vercel static
    }

    return { success: true, id };
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/settings', { signal: controller.signal });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        saveLocalSettings(data);
        return data;
      }
    } catch {
      // Backend not running (e.g. Vercel)
    }

    return getLocalSettings();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = getLocalSettings();
    const updated = { ...current, ...settings };
    saveLocalSettings(updated);

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {
      // Offline/Vercel static
    }

    return updated;
  },

  // Inquiries & Reservations
  async getInquiries(): Promise<Inquiry[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/inquiries', { signal: controller.signal });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveLocalInquiries(data);
          return data;
        }
      }
    } catch {
      // Backend not running
    }

    return getLocalInquiries();
  },

  async createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
    const newInq: Inquiry = {
      id: 'inq-' + Date.now(),
      type: data.type || 'reservation',
      customerName: data.customerName || 'Cliente',
      customerPhone: data.customerPhone || '',
      date: data.date,
      time: data.time,
      guests: data.guests || 2,
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
    };

    const current = getLocalInquiries();
    saveLocalInquiries([newInq, ...current]);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Offline/Vercel static
    }

    return newInq;
  },

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    const current = getLocalInquiries();
    const index = current.findIndex((i) => i.id === id);
    if (index !== -1) {
      current[index].status = status;
      saveLocalInquiries(current);
    }

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Offline/Vercel static
    }

    return current[index] || ({ id, status } as any);
  },

  // Admin Auth (Universal: Works on Server AND on Vercel)
  async loginAdmin(password: string): Promise<{ success: boolean; token: string; user: string }> {
    const validCodes = ['admin', 'bongoût2025', 'admin123'];

    // Check custom password saved in localStorage if any
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      if (stored) validCodes.push(stored);
    } catch {}

    // First attempt remote server verification
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return res.json();
      }
    } catch {
      // Server not reachable (e.g. Vercel deployment)
    }

    // Seamless client-side verification fallback
    const trimmed = (password || '').trim();
    if (validCodes.includes(trimmed)) {
      return {
        success: true,
        token: 'bg-token-local-' + Date.now(),
        user: 'Administrador BON GOÛT',
      };
    }

    throw new Error('Palavra-passe incorreta. Utilize "admin" ou "bongoût2025".');
  },
};
