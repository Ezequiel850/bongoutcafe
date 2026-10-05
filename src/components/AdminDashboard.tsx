import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Calendar,
  Settings,
  Utensils,
  Sparkles,
  Phone,
  Clock,
  Eye,
  LogOut,
  RefreshCw,
  Search,
} from 'lucide-react';
import { MenuItem, MenuCategory, SiteSettings, Inquiry } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  items: MenuItem[];
  settings: SiteSettings;
  onMenuUpdated: () => void;
  onSettingsUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  settings,
  onMenuUpdated,
  onSettingsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'inquiries' | 'settings'>('menu');

  // Menu management state
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Settings form state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Fetch inquiries when authenticated and tab active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await api.loginAdmin(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Palavra-passe inválida');
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      onMenuUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSpecial = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { isSpecial: !item.isSpecial });
      onMenuUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Tem a certeza que deseja eliminar o prato "${name}"?`)) {
      try {
        await api.deleteMenuItem(id);
        onMenuUpdated();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;

    try {
      if (isCreatingNew) {
        await api.addMenuItem({
          ...editingItem,
          tags: typeof editingItem.tags === 'string' ? (editingItem.tags as string).split(',').map(s => s.trim()) : editingItem.tags || [],
        });
      } else if (editingItem.id) {
        await api.updateMenuItem(editingItem.id, {
          ...editingItem,
          tags: typeof editingItem.tags === 'string' ? (editingItem.tags as string).split(',').map(s => s.trim()) : editingItem.tags || [],
        });
      }
      setEditingItem(null);
      setIsCreatingNew(false);
      onMenuUpdated();
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar prato.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await api.updateSettings(localSettings);
      setSettingsSuccess(true);
      onSettingsUpdated();
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar definições.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: Inquiry['status']) => {
    try {
      await api.updateInquiryStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered items in admin list
  const filteredAdminItems = items.filter((it) => {
    const matchesCat = selectedCategoryFilter === 'all' || it.category === selectedCategoryFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchesQ = !q || it.name.toLowerCase().includes(q) || it.description.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F9F6F0] rounded-2xl overflow-hidden shadow-2xl border border-[#D5C7B5] flex flex-col h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#2B1B17] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#D97724]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Painel Administrativo &amp; CMS
              </h2>
              <p className="text-[11px] text-[#A6978B]">
                BON GOÛT café • Gestão de Menu &amp; Pedidos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-[#C5B7AC] hover:text-white px-2.5 py-1 rounded bg-[#3D2924] flex items-center gap-1 cursor-pointer"
                title="Terminar sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#C5B7AC] hover:text-white rounded-md transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-xl border border-[#E3D9C9] shadow-md text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#F3EFEA] flex items-center justify-center mx-auto text-[#D97724]">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#2B1B17]">Autenticação do Gestor</h3>
                <p className="text-xs text-[#705F55] mt-1">
                  Insira a palavra-passe para aceder às configurações e edição do menu.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1">
                    Palavra-Passe
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Introduza a sua password..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
                  />
                  {loginError && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Entrar no Painel
                </button>
              </form>

              <div className="pt-2 text-center border-t border-[#F2ECE3]">
                <span className="text-[11px] text-[#8C7B71]">
                  Dica de acesso: palavra-passe padrão <code className="text-[#2B1B17] font-mono font-bold bg-[#EFE8DC] px-1.5 py-0.5 rounded">admin</code> ou <code className="text-[#2B1B17] font-mono font-bold bg-[#EFE8DC] px-1.5 py-0.5 rounded">bongoût2025</code>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="px-6 pt-3 bg-white border-b border-[#E8DEC8] flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'menu'
                    ? 'border-[#D97724] text-[#2B1B17]'
                    : 'border-transparent text-[#7A695F] hover:text-[#2B1B17]'
                }`}
              >
                <Utensils className="w-4 h-4 text-[#D97724]" />
                <span>Gestão do Menu ({items.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'border-[#D97724] text-[#2B1B17]'
                    : 'border-transparent text-[#7A695F] hover:text-[#2B1B17]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#4A5D4E]" />
                <span>Pedidos &amp; Reservas</span>
                {inquiries.filter((i) => i.status === 'Pendente').length > 0 && (
                  <span className="bg-[#D97724] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                    {inquiries.filter((i) => i.status === 'Pendente').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#D97724] text-[#2B1B17]'
                    : 'border-transparent text-[#7A695F] hover:text-[#2B1B17]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#7A695F]" />
                <span>Definições do Café</span>
              </button>
            </div>

            {/* Tab 1: Menu Items Management */}
            {activeTab === 'menu' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8DEC8]">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filtrar por nome..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D97724]"
                      />
                    </div>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-md text-[#2B1B17]"
                    >
                      <option value="all">Todas as Categorias</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem({
                        name: '',
                        category: 'especialidades',
                        price: 500,
                        description: '',
                        isSpecial: false,
                        isAvailable: true,
                        isHalal: true,
                        tags: [],
                        image: '',
                        prepTime: '10 min',
                      });
                      setIsCreatingNew(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Novo Prato / Bebida</span>
                  </button>
                </div>

                {/* Edit / Create Form Modal */}
                {editingItem && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E8DEC8] flex flex-col max-h-[90vh]">
                      <div className="p-4 sm:p-5 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-[#2B1B17]">
                          {isCreatingNew ? 'Novo Item do Menu' : `Editar: ${editingItem.name}`}
                        </h3>
                        <button
                          onClick={() => {
                            setEditingItem(null);
                            setIsCreatingNew(false);
                          }}
                          className="p-1 text-[#7C6B61] hover:text-[#2B1B17]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                              Nome do Item *
                            </label>
                            <input
                              type="text"
                              required
                              value={editingItem.name || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                            />
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                              Categoria *
                            </label>
                            <select
                              value={editingItem.category || 'especialidades'}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                              Preço em Meticais (MT) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={editingItem.price ?? ''}
                              onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                              className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                              Tempo de Preparação
                            </label>
                            <input
                              type="text"
                              value={editingItem.prepTime || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                              placeholder="Ex: 5-8 min"
                              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                            Descrição dos Ingredientes &amp; Preparação
                          </label>
                          <textarea
                            rows={3}
                            value={editingItem.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                            URL da Fotografia do Prato
                          </label>
                          <input
                            type="text"
                            value={editingItem.image || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                            placeholder="/src/assets/images/... ou link web"
                            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <label className="flex items-center gap-2 p-2 rounded bg-[#FAF8F5] border border-[#E3D9C9] text-xs font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingItem.isAvailable !== false}
                              onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                            />
                            <span>Disponível</span>
                          </label>

                          <label className="flex items-center gap-2 p-2 rounded bg-[#FAF8F5] border border-[#E3D9C9] text-xs font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingItem.isSpecial)}
                              onChange={(e) => setEditingItem({ ...editingItem, isSpecial: e.target.checked })}
                            />
                            <span>Destaque</span>
                          </label>

                          <label className="flex items-center gap-2 p-2 rounded bg-[#FAF8F5] border border-[#E3D9C9] text-xs font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingItem.isHalal !== false}
                              onChange={(e) => setEditingItem({ ...editingItem, isHalal: e.target.checked })}
                            />
                            <span>Halal</span>
                          </label>
                        </div>

                        <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(null);
                              setIsCreatingNew(false);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-[#6C5B52] hover:bg-[#F3EFEA] rounded-md"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-md flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Guardar Alterações</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Table of items */}
                <div className="bg-white rounded-xl border border-[#E8DEC8] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] text-[#8C7B71] border-b border-[#F0EAE1] font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3">Prato / Bebida</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Preço</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3">Destaque</th>
                          <th className="p-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE3]">
                        {filteredAdminItems.map((item) => (
                          <tr key={item.id} className="hover:bg-[#FCFAF8] transition-colors">
                            <td className="p-3 font-medium text-[#2B1B17]">
                              <div className="flex items-center gap-2">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 rounded object-cover shrink-0"
                                  />
                                )}
                                <div>
                                  <span className="font-semibold block">{item.name}</span>
                                  <span className="text-[11px] text-[#7A695F] truncate max-w-xs block">
                                    {item.description}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[#6A5A50] capitalize whitespace-nowrap">
                              {item.category.replace('-', ' & ')}
                            </td>
                            <td className="p-3 font-mono font-bold text-[#2B1B17] tabular-nums whitespace-nowrap">
                              {item.price.toLocaleString('pt-MZ')} MT
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleAvailable(item)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                                  item.isAvailable
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {item.isAvailable ? 'Em Stock' : 'Esgotado'}
                              </button>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleSpecial(item)}
                                className={`p-1 rounded cursor-pointer ${
                                  item.isSpecial ? 'text-[#D97724] bg-amber-50' : 'text-[#B0A195] hover:text-[#2B1B17]'
                                }`}
                                title={item.isSpecial ? 'Remover destaque' : 'Tornar destaque'}
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsCreatingNew(false);
                                  }}
                                  className="p-1.5 text-[#6B5A51] hover:text-[#2B1B17] hover:bg-[#F3EFEA] rounded"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Orders & Inquiries Inbox */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#2B1B17]">
                    Caixa de Entrada: Reservas &amp; Pedidos
                  </h3>
                  <button
                    onClick={fetchInquiries}
                    className="p-2 text-xs font-semibold text-[#2B1B17] bg-white border border-[#E3D9C9] rounded-md hover:bg-[#F3EFEA] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-[#E8DEC8] text-center text-xs text-[#7A695F]">
                    Nenhum pedido ou reserva registado ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-white rounded-xl border border-[#E8DEC8] p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-3">
                          <div className="flex items-center gap-2">
                            {inq.type === 'reservation' ? (
                              <span className="p-1.5 bg-[#FAF3EA] text-[#D97724] rounded-md">
                                <Calendar className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="p-1.5 bg-[#EAF2EC] text-[#4A5D4E] rounded-md">
                                <ShoppingBag className="w-4 h-4" />
                              </span>
                            )}
                            <div>
                              <strong className="text-sm font-serif font-bold text-[#2B1B17]">
                                {inq.customerName}
                              </strong>
                              <span className="text-xs text-[#8C7B71] block font-mono">
                                {inq.customerPhone}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#9E8E85]">
                              {new Date(inq.createdAt).toLocaleDateString('pt-MZ', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>

                            {/* Status Selector */}
                            <select
                              value={inq.status}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                                inq.status === 'Confirmado'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : inq.status === 'Concluído'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : inq.status === 'Cancelado'
                                  ? 'bg-red-50 text-red-800 border-red-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Confirmado">Confirmado</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </div>
                        </div>

                        {/* Inquiry Content details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#4E3F37]">
                          {inq.type === 'reservation' ? (
                            <>
                              <div>
                                <span className="text-[#8C7B71] block font-medium">Data e Hora Solicitadas:</span>
                                <span className="font-semibold text-[#2B1B17]">
                                  {inq.date} às {inq.time} ({inq.guests} pessoas)
                                </span>
                              </div>
                              {inq.notes && (
                                <div>
                                  <span className="text-[#8C7B71] block font-medium">Observações:</span>
                                  <p className="italic text-[#6A5A50]">{inq.notes}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[#8C7B71] block font-medium">Endereço de Entrega:</span>
                                <span className="font-semibold text-[#2B1B17]">
                                  {inq.deliveryAddress || 'Levantamento no Café'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[#8C7B71] block font-medium">Total Estimado:</span>
                                <span className="font-mono font-bold text-sm text-[#D97724] tabular-nums">
                                  {inq.totalAmount?.toLocaleString('pt-MZ')} MT
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* If items in delivery order */}
                        {inq.items && inq.items.length > 0 && (
                          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#F0EAE1] text-xs">
                            <span className="font-bold text-[#8C7B71] block mb-1">Itens Solicitados:</span>
                            <ul className="space-y-1">
                              {inq.items.map((it, idx) => (
                                <li key={idx} className="flex justify-between text-[#2B1B17]">
                                  <span>
                                    {it.quantity}x {it.name}
                                    {it.notes ? <span className="text-[#D97724] text-[11px] block">Obs: {it.notes}</span> : null}
                                  </span>
                                  <span className="font-mono tabular-nums text-[#6C5B52]">
                                    {(it.price * it.quantity).toLocaleString('pt-MZ')} MT
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Settings Editor */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <div className="bg-white p-6 rounded-xl border border-[#E8DEC8] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#2B1B17] border-b border-[#F0EAE1] pb-2">
                    Informações do Estabelecimento &amp; Contactos
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                        Nome do Negócio
                      </label>
                      <input
                        type="text"
                        value={localSettings.businessName}
                        onChange={(e) => setLocalSettings({ ...localSettings, businessName: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                        Slogan / Conceito
                      </label>
                      <input
                        type="text"
                        value={localSettings.tagline}
                        onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                        Telefone Principal
                      </label>
                      <input
                        type="text"
                        value={localSettings.phone}
                        onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                        Número WhatsApp (formato internacional sem +)
                      </label>
                      <input
                        type="text"
                        value={localSettings.whatsappRaw}
                        onChange={(e) => setLocalSettings({ ...localSettings, whatsappRaw: e.target.value })}
                        placeholder="258847849629"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                      Horário de Funcionamento Exibido
                    </label>
                    <input
                      type="text"
                      value={localSettings.operatingHours}
                      onChange={(e) => setLocalSettings({ ...localSettings, operatingHours: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#8C7B71] mb-1">
                      Endereço Completo &amp; Link Google Maps
                    </label>
                    <input
                      type="text"
                      value={localSettings.mapsUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, mapsUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg mb-2"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#F0EAE1]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase font-bold text-[#8C7B71]">
                        Barra de Anúncio / Novidade Topo
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2B1B17] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.announcementActive}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, announcementActive: e.target.checked })
                          }
                        />
                        <span>Ativar Barra de Novidade</span>
                      </label>
                    </div>
                    <textarea
                      rows={2}
                      value={localSettings.announcement}
                      onChange={(e) => setLocalSettings({ ...localSettings, announcement: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    {settingsSuccess && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Alterações gravadas com sucesso!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingSettings ? 'A guardar...' : 'Guardar Definições'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
