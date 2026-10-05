import { MenuItem, MenuCategory, SiteSettings, Inquiry } from '../types';

export const api = {
  // Menu items & categories
  async getMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
    const res = await fetch('/api/menu');
    if (!res.ok) throw new Error('Falha ao carregar menu');
    return res.json();
  },

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Falha ao adicionar item');
    return res.json();
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar item');
    return res.json();
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao remover item');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Falha ao carregar definições');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Falha ao atualizar definições');
    return res.json();
  },

  // Inquiries & Reservations
  async getInquiries(): Promise<Inquiry[]> {
    const res = await fetch('/api/inquiries');
    if (!res.ok) throw new Error('Falha ao carregar pedidos');
    return res.json();
  },

  async createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao submeter pedido');
    return res.json();
  },

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar estado do pedido');
    return res.json();
  },

  // Admin Auth
  async loginAdmin(password: string): Promise<{ success: boolean; token: string; user: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Palavra-passe inválida' }));
      throw new Error(err.error || 'Falha na autenticação');
    }
    return res.json();
  }
};
