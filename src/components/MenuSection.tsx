import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, Sparkles, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  onSelectItem,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      // Quick filter tags
      let matchesFilter = true;
      if (filterTag === 'specials') {
        matchesFilter = item.isSpecial;
      } else if (filterTag === 'halal') {
        matchesFilter = item.isHalal;
      } else if (filterTag === 'drinks') {
        matchesFilter = ['bebidas-frias', 'milkshakes', 'sumos-naturais', 'cafes-chas'].includes(item.category);
      } else if (filterTag === 'food') {
        matchesFilter = ['especialidades', 'tostas-wraps', 'entradas-sobremesas'].includes(item.category);
      }

      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [items, selectedCategory, searchQuery, filterTag]);

  return (
    <section id="menu-digital" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header with Scroll Fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-semibold text-[#D97724] uppercase tracking-wider block mb-2">
          Experiência Gastronómica Completa
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B1B17] mb-4">
          Nosso Menu Digital
        </h2>
        <p className="text-sm sm:text-base text-[#68574D] leading-relaxed">
          Explore todas as nossas receitas artesanais, cafés de origem, tostas gourmet, bebidas geladas e sobremesas feitas diariamente.
        </p>
      </motion.div>

      {/* Controls & Search Bar with Scroll Fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6 mb-12"
      >
        {/* Search input & Filter row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por prato, café, ingrediente..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E3D9C9] rounded-lg text-sm text-[#2B1B17] placeholder-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#D97724] focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A70] hover:text-[#2B1B17]"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EFE8DC] rounded-lg overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterTag === 'all'
                  ? 'bg-white text-[#2B1B17] shadow-xs'
                  : 'text-[#6A5A50] hover:text-[#2B1B17]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTag('specials')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                filterTag === 'specials'
                  ? 'bg-white text-[#D97724] shadow-xs font-semibold'
                  : 'text-[#6A5A50] hover:text-[#2B1B17]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Destaques
            </button>
            <button
              onClick={() => setFilterTag('drinks')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterTag === 'drinks'
                  ? 'bg-white text-[#2B1B17] shadow-xs'
                  : 'text-[#6A5A50] hover:text-[#2B1B17]'
              }`}
            >
              Bebidas
            </button>
            <button
              onClick={() => setFilterTag('food')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterTag === 'food'
                  ? 'bg-white text-[#2B1B17] shadow-xs'
                  : 'text-[#6A5A50] hover:text-[#2B1B17]'
              }`}
            >
              Pratos &amp; Tostas
            </button>
          </div>
        </div>

        {/* Category Tabs (Segmented Controls) */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#2B1B17] text-white shadow-xs'
                : 'bg-white text-[#5C4D44] hover:bg-[#F3EFEA] border border-[#E5DCce]'
            }`}
          >
            <span>Ver Tudo</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                selectedCategory === 'all' ? 'bg-[#432E28] text-[#F3EFEA]' : 'bg-[#EFE8DC] text-[#705F55]'
              }`}
            >
              {items.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#2B1B17] text-white shadow-xs'
                    : 'bg-white text-[#5C4D44] hover:bg-[#F3EFEA] border border-[#E5DCCE]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected ? 'bg-[#432E28] text-[#F3EFEA]' : 'bg-[#EFE8DC] text-[#705F55]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Results Count Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between border-b border-[#E8DEC8] pb-3 mb-8 text-xs text-[#7A695F]"
      >
        <div className="flex items-center gap-2">
          <span>Mostrando</span>
          <strong className="text-[#2B1B17] font-semibold tabular-nums">{filteredItems.length}</strong>
          <span>itens no menu</span>
        </div>
        <div className="flex items-center gap-2 text-[#4A5D4E]">
          <ShieldCheck className="w-4 h-4 text-[#4A5D4E]" />
          <span className="font-medium text-xs">Cozinha 100% Halal Certificada</span>
        </div>
      </motion.div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16 bg-white rounded-xl border border-[#E8DEC8] max-w-lg mx-auto p-8"
        >
          <AlertCircle className="w-10 h-10 text-[#C4B5A6] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#2B1B17] mb-1">Nenhum prato encontrado</h3>
          <p className="text-xs text-[#75645A] mb-4">
            Não encontramos resultados para a sua pesquisa. Tente usar outros termos ou limpar os filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterTag('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2B1B17] rounded-md hover:bg-[#D97724] transition-colors"
          >
            Ver Todo o Menu
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const hasImage = Boolean(item.image);

              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-white rounded-xl border border-[#E9E2D5] hover:border-[#D5C7B5] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Optional Image Header */}
                    {hasImage && (
                      <div
                        className="relative aspect-16/10 w-full bg-[#EFE8DC] overflow-hidden cursor-pointer"
                        onClick={() => onSelectItem(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        {item.isSpecial && (
                          <div className="absolute top-3 left-3 bg-[#2B1B17]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#D97724]" />
                            <span>Destaque</span>
                          </div>
                        )}
                        {item.isHalal && (
                          <div className="absolute top-3 right-3 bg-[#4A5D4E]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Halal</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Unboxed Metadata Header */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#806E64] mb-2 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="capitalize">{item.category.replace('-', ' & ')}</span>
                          {item.prepTime && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{item.prepTime}</span>
                            </>
                          )}
                        </div>

                        {item.isAvailable ? (
                          <span className="text-[11px] text-[#4A5D4E] font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Em Stock
                          </span>
                        ) : (
                          <span className="text-[11px] text-red-600 font-medium">Esgotado</span>
                        )}
                      </div>

                      {/* Dish Title */}
                      <h3
                        onClick={() => onSelectItem(item)}
                        className="font-serif text-lg font-bold text-[#2B1B17] group-hover:text-[#D97724] transition-colors cursor-pointer mb-2"
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#615147] leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>

                      {/* Tag list - unboxed quiet text */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#7C6B61] pt-1">
                          {item.tags.map((tag, idx) => (
                            <React.Fragment key={idx}>
                              <span>#{tag}</span>
                              {idx < item.tags.length - 1 && <span aria-hidden="true">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with Price and Quick Order */}
                  <div className="p-5 pt-3 border-t border-[#F3EFE9] bg-[#FAF8F5] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A796E]">
                        Preço
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#2B1B17] font-mono tabular-nums">
                        {item.price.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectItem(item)}
                        aria-label={`Ver detalhes do prato ${item.name}`}
                        className="p-2 text-[#736359] hover:text-[#2B1B17] hover:bg-white rounded-md transition-colors border border-transparent hover:border-[#E5DCCE] cursor-pointer"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAddToCart(item)}
                        disabled={!item.isAvailable}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pedir</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

