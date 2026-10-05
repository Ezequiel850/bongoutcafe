import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { CartItem, SiteSettings } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: SiteSettings;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  const handleCheckoutWhatsApp = async () => {
    if (items.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor preencha o seu Nome e Número de Contacto.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Por favor informe o endereço de entrega para Maputo.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order to backend database for the café owner CMS
      await api.createInquiry({
        type: 'delivery',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'Levantamento no Café (Takeaway)',
        totalAmount: subtotal,
        notes: orderNotes.trim() || undefined,
        items: items.map((ci) => ({
          name: ci.item.name,
          quantity: ci.quantity,
          price: ci.item.price,
          notes: ci.notes,
        })),
      });

      // 2. Format WhatsApp message
      const itemsList = items
        .map(
          (ci) =>
            `• ${ci.quantity}x ${ci.item.name} (${(ci.item.price * ci.quantity).toLocaleString('pt-MZ')} MT)${
              ci.notes ? `\n   Obs: ${ci.notes}` : ''
            }`
        )
        .join('\n');

      const messageText = `*NOVO PEDIDO - BON GOÛT café*\n\n` +
        `👤 *Cliente:* ${customerName}\n` +
        `📞 *Contacto:* ${customerPhone}\n` +
        `🛵 *Tipo:* ${orderType === 'delivery' ? 'Entrega ao Domicílio' : 'Levantamento no Café'}\n` +
        (orderType === 'delivery' ? `📍 *Endereço:* ${deliveryAddress}\n` : '') +
        (orderNotes ? `📝 *Observações:* ${orderNotes}\n` : '') +
        `\n*ITENS DO PEDIDO:*\n${itemsList}\n\n` +
        `💰 *TOTAL ESTIMADO:* ${subtotal.toLocaleString('pt-MZ')} MT\n\n` +
        `_Enviado através do Menu Digital Oficial BON GOÛT café_`;

      const targetWhatsapp = settings.whatsappRaw || '258847849629';
      const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(messageText)}`;

      setOrderSuccess(true);

      // Open WhatsApp in new window/tab
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
      }, 500);
    } catch (err) {
      console.error('Error recording order:', err);
      setIsSubmitting(false);
      // Still allow WhatsApp redirection
      const targetWhatsapp = settings.whatsappRaw || '258847849629';
      const fallbackUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent('Olá BON GOÛT café! Gostaria de confirmar o meu pedido.')}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8DEC8]">
          {/* Header */}
          <div className="p-5 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D97724]" />
              <h2 className="font-serif text-lg font-bold text-[#2B1B17]">Sacola de Pedidos</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#EFE8DC] text-[#705F55] rounded-full tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7C6B61] hover:text-[#2B1B17] rounded-md transition-colors"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderSuccess ? (
            <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="w-16 h-16 text-[#4A5D4E] animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-[#2B1B17]">Pedido Encaminhado!</h3>
              <p className="text-sm text-[#6C5B52] max-w-xs leading-relaxed">
                O seu pedido foi registado e enviado para a nossa equipa no WhatsApp ({settings.phone}). Entraremos em contacto para confirmar a preparação e entrega.
              </p>
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  onClearCart();
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 text-xs font-semibold text-white bg-[#2B1B17] rounded-md hover:bg-[#D97724] transition-colors"
              >
                Voltar ao Menu
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#D2C5B5] mx-auto" />
                    <p className="text-sm font-medium text-[#7C6B61]">A sua sacola está vazia.</p>
                    <p className="text-xs text-[#9E8E85]">
                      Adicione cafés especiais, sandes deliciosas ou sobremesas artesanais do menu.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((cartItem) => (
                        <div
                          key={cartItem.item.id}
                          className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-[#F0EAE1]"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-[#2B1B17] truncate">
                              {cartItem.item.name}
                            </h4>
                            <span className="text-xs text-[#8A796F] font-mono tabular-nums">
                              {cartItem.item.price.toLocaleString('pt-MZ')} MT unid.
                            </span>
                            {cartItem.notes && (
                              <p className="text-[11px] text-[#D97724] mt-0.5 truncate">
                                Obs: {cartItem.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-white border border-[#E3D9C9] rounded px-1.5 py-1">
                              <button
                                onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                className="text-[#6D5D53] hover:text-[#2B1B17]"
                                aria-label="Diminuir"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold font-mono tabular-nums px-1">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                className="text-[#6D5D53] hover:text-[#2B1B17]"
                                aria-label="Aumentar"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(cartItem.item.id)}
                              className="p-1 text-[#9E8E85] hover:text-red-600 transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Details Form */}
                    <div className="pt-4 border-t border-[#F0EAE1] space-y-3">
                      <span className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider">
                        Modalidade &amp; Dados para Entrega
                      </span>

                      {/* Toggle Delivery / Takeaway */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-[#F0EAE1] rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`py-2 rounded-md transition-colors ${
                            orderType === 'delivery'
                              ? 'bg-white text-[#2B1B17] shadow-xs'
                              : 'text-[#6C5B52]'
                          }`}
                        >
                          🛵 Entrega (Delivery)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('takeaway')}
                          className={`py-2 rounded-md transition-colors ${
                            orderType === 'takeaway'
                              ? 'bg-white text-[#2B1B17] shadow-xs'
                              : 'text-[#6C5B52]'
                          }`}
                        >
                          🛍️ Levantamento
                        </button>
                      </div>

                      {/* Customer inputs */}
                      <div className="space-y-2">
                        <div className="relative">
                          <User className="w-4 h-4 text-[#9E8E85] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Seu Nome Completo *"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D97724] text-[#2B1B17]"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#9E8E85] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Telefone / WhatsApp (+258 ...) *"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D97724] text-[#2B1B17]"
                          />
                        </div>

                        {orderType === 'delivery' && (
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-[#9E8E85] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Bairro, Rua, Edifício em Maputo *"
                              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D97724] text-[#2B1B17]"
                            />
                          </div>
                        )}

                        <input
                          type="text"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Alguma recomendação para o entregador?"
                          className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D97724] text-[#2B1B17]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer with Subtotal & WhatsApp CTA */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[#F0EAE1] bg-[#FAF8F5] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#7A695F]">
                    <span>Subtotal dos Itens</span>
                    <span className="font-mono tabular-nums text-sm font-semibold text-[#2B1B17]">
                      {subtotal.toLocaleString('pt-MZ')} MT
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#7A695F]">
                    <span>Taxa de Entrega</span>
                    <span className="text-[11px] text-[#4A5D4E] font-medium">
                      Calculada por zona no WhatsApp
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DEC8]">
                    <span className="text-sm font-bold text-[#2B1B17]">Total Estimado</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-[#D97724]">
                      {subtotal.toLocaleString('pt-MZ')} MT
                    </span>
                  </div>

                  <button
                    onClick={handleCheckoutWhatsApp}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-[#4A5D4E] hover:bg-[#3D4D40] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4 text-[#8CD19D]" />
                    <span>{isSubmitting ? 'A processar...' : 'Finalizar Pedido via WhatsApp'}</span>
                  </button>

                  <p className="text-[11px] text-center text-[#8C7B71]">
                    O pedido será enviado diretamente para o atendimento do BON GOÛT no WhatsApp.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
