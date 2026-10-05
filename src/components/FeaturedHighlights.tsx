import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { MenuItem } from '../types';

interface FeaturedHighlightsProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export const FeaturedHighlights: React.FC<FeaturedHighlightsProps> = ({
  items,
  onSelectItem,
  onAddToCart,
}) => {
  // Find our top highlighted items
  const highlighted = items.filter(
    (it) =>
      it.id === 'bf-6' || // Dubai Chocolate Latte
      it.id === 'ep-1' || // Bon Goût Crispy Burger
      it.id === 'bf-2' || // Strawberry Matcha Latte
      it.id === 'es-1'    // Chamussa 3 Queijos
  );

  const displayList = highlighted.length > 0 ? highlighted : items.filter((it) => it.isSpecial).slice(0, 4);

  return (
    <section id="destaques" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D97724] uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4" />
            <span>Seleção Exclusiva da Casa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17]">
            Os Favoritos do BON GOÛT
          </h2>
        </div>
        <p className="text-sm text-[#6C5B52] max-w-md">
          Criações artesanais que conquistaram Maputo. Preparadas na hora com ingredientes nobres, paixão e certificação Halal.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((item, idx) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white rounded-xl overflow-hidden border border-[#E9E2D5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Frame with fallback */}
              <div
                className="relative aspect-4/3 w-full bg-[#EFE8DC] overflow-hidden cursor-pointer"
                onClick={() => onSelectItem(item)}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#9E8B7F] p-4 text-center">
                    <Sparkles className="w-8 h-8 text-[#D97724] mb-2 opacity-60" />
                    <span className="text-xs font-serif font-semibold">{item.name}</span>
                  </div>
                )}

                {/* Subtle top tag badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#2B1B17]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-[#D97724]" />
                  <span>Destaque</span>
                </div>

                {item.isHalal && (
                  <div className="absolute top-3 right-3 bg-[#4A5D4E]/90 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Halal</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Quiet unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-[#827167] mb-1.5 font-medium">
                  <span className="capitalize">{item.category.replace('-', ' & ')}</span>
                  {item.prepTime && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{item.prepTime}</span>
                    </>
                  )}
                </div>

                <h3
                  onClick={() => onSelectItem(item)}
                  className="font-serif text-lg font-bold text-[#2B1B17] group-hover:text-[#D97724] transition-colors cursor-pointer mb-2"
                >
                  {item.name}
                </h3>

                <p className="text-xs text-[#63534A] leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Card Footer: Price & Actions */}
            <div className="p-5 pt-0 border-t border-[#F2ECE3] mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-[#8C7B71]">Preço</span>
                <span className="text-lg font-bold text-[#2B1B17] font-mono tabular-nums">
                  {item.price.toLocaleString('pt-MZ')} MT
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectItem(item)}
                  aria-label={`Ver detalhes de ${item.name}`}
                  className="p-2 text-[#736358] hover:text-[#2B1B17] hover:bg-[#F3EFE8] rounded-md transition-colors cursor-pointer"
                  title="Ver detalhes"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.isAvailable}
                  aria-label={`Adicionar ${item.name} ao pedido`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

