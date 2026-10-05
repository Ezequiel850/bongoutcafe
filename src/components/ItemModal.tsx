import React, { useState } from 'react';
import { X, Plus, Minus, ShieldCheck, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [customerNotes, setCustomerNotes] = useState('');

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity, customerNotes);
    onClose();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E8DEC8] flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar janela"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#2B1B17] shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero / Image */}
        {item.image ? (
          <div className="relative aspect-16/9 w-full bg-[#EFE8DC] overflow-hidden shrink-0">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="bg-[#2B1B17]/80 px-2.5 py-1 rounded backdrop-blur-xs font-medium">
                {item.category.replace('-', ' & ')}
              </span>
              {item.isHalal && (
                <span className="bg-[#4A5D4E]/90 px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 pb-2 border-b border-[#F0EAE1] bg-[#FAF8F5]">
            <div className="flex items-center gap-2 text-xs text-[#827167] font-medium mb-1">
              <span className="capitalize">{item.category.replace('-', ' & ')}</span>
              {item.isHalal && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#4A5D4E] flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Halal Certificado
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2B1B17]">{item.name}</h2>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {item.image && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2B1B17] mb-1">{item.name}</h2>
              <div className="flex items-center gap-2 text-xs text-[#7B6A61]">
                {item.prepTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D97724]" />
                    Tempo estimado: {item.prepTime}
                  </span>
                )}
                {item.isSpecial && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#D97724] flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> Especialidade da Casa
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1.5">
              Descrição &amp; Ingredientes
            </h4>
            <p className="text-sm text-[#4E3F37] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-xs text-[#75645A]">
              {item.tags.map((t, idx) => (
                <span key={idx} className="bg-[#F2ECE3] px-2.5 py-1 rounded text-[#5C4D44] font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Special Requests / Notes */}
          <div>
            <label htmlFor="notes" className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1.5">
              Instruções Especiais / Notas
            </label>
            <input
              id="notes"
              type="text"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Ex: Leite vegetal, pouco açúcar, molho à parte..."
              className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE3]">
            <span className="text-sm font-semibold text-[#2B1B17]">Quantidade</span>
            <div className="flex items-center gap-3 bg-[#F2ECE3] p-1 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Diminuir quantidade"
                className="w-8 h-8 rounded-md bg-white text-[#2B1B17] hover:bg-[#EAE2D5] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold font-mono tabular-nums text-[#2B1B17]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Aumentar quantidade"
                className="w-8 h-8 rounded-md bg-white text-[#2B1B17] hover:bg-[#EAE2D5] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-[#8A796E]">Total</span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#2B1B17]">
              {totalPrice.toLocaleString('pt-MZ')} MT
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className="flex-1 py-3 px-6 text-sm font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Adicionar à Sacola</span>
          </button>
        </div>
      </div>
    </div>
  );
};
