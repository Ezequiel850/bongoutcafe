import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre-nos" className="py-24 bg-[#F2EDE4] border-y border-[#E5DCCE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D97724] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Nossa História &amp; Filosofia</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2B1B17] leading-tight text-balance">
              Eat, Sip, Gather — Onde cada detalhe tem sabor a dedicação.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#57483F] leading-relaxed">
              <p>
                O <strong className="text-[#2B1B17] font-semibold">BON GOÛT café</strong> nasceu de uma paixão profunda pela arte da cafetaria contemporânea e pela doçaria de precisão. Em cada chávena servida e em cada tosta dourada, celebramos o prazer de partilhar momentos autênticos.
              </p>
              <p>
                Acreditamos que uma experiência gastronómica inesquecível exige compromisso absoluto com a qualidade: selecionamos grãos nobres torrados com mestria, frutas frescas colhidas diariamente e receitas exclusivas — como o nosso célebre <em>Dubai Chocolate Latte</em> e as nossas chamussas caseiras estaladiças.
              </p>
            </div>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                {
                  icon: ShieldCheck,
                  title: '100% Halal',
                  desc: 'Todos os ingredientes cárneos, aves e processos culinários cumprem rigorosos padrões Halal.',
                  color: 'text-[#4A5D4E]',
                },
                {
                  icon: Coffee,
                  title: 'Grãos Nobres',
                  desc: 'Espressos encorpados, métodos especiais, cafés gelados de assinatura e cremes aveludados.',
                  color: 'text-[#D97724]',
                },
                {
                  icon: Heart,
                  title: 'Feito no Dia',
                  desc: 'Sobremesas artesanais, panquecas fofas e tostas preparadas na hora com pães selecionados.',
                  color: 'text-[#D97724]',
                },
              ].map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: 0.1 * (idx + 1), ease: [0.16, 1, 0.3, 1] }}
                    className="p-4 bg-white rounded-xl border border-[#E3D9C9] shadow-2xs space-y-2"
                  >
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                    <h4 className="font-serif font-bold text-sm text-[#2B1B17]">{pillar.title}</h4>
                    <p className="text-xs text-[#705F55] leading-relaxed">{pillar.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Visual Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative p-6 sm:p-8 bg-white rounded-2xl border border-[#E1D6C4] shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D97724]" />
                  <span className="font-serif text-lg font-bold text-[#2B1B17]">Garantia de Qualidade</span>
                </div>
                <span className="text-xs font-semibold text-[#4A5D4E] bg-[#4A5D4E]/10 px-2.5 py-1 rounded">
                  Maputo
                </span>
              </div>

              <blockquote className="italic font-serif text-base text-[#463831] leading-relaxed border-l-2 border-[#D97724] pl-4">
                &ldquo;Queremos que o BON GOÛT seja o seu refúgio diário: aquele lugar onde o primeiro gole de café acalma o espírito e o almoço se transforma numa celebração.&rdquo;
              </blockquote>

              <div className="space-y-3 pt-2 text-xs text-[#6A5A50]">
                <div className="flex items-center justify-between py-2 border-b border-[#F3EFE9]">
                  <span className="font-medium">Tipo de Cozinha</span>
                  <span className="text-[#2B1B17] font-semibold">Cafetaria &amp; Bistrô Gourmet</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F3EFE9]">
                  <span className="font-medium">Certificação</span>
                  <span className="text-[#4A5D4E] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F3EFE9]">
                  <span className="font-medium">Ambiente</span>
                  <span className="text-[#2B1B17] font-semibold">Acolhedor, Wi-Fi &amp; Esplanada</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">Serviços</span>
                  <span className="text-[#2B1B17] font-semibold">Consumo Local, Takeaway &amp; Delivery</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs text-[#8E7E74]">
                  Siga a nossa rotina no Instagram: <a href="https://instagram.com/bon_gout789" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#D97724] hover:underline">@bon_gout789</a>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

