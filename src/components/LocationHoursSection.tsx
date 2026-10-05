import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, MapPin, MessageCircle, ExternalLink, ShieldCheck, Truck } from 'lucide-react';
import { SiteSettings } from '../types';

interface LocationHoursSectionProps {
  settings: SiteSettings;
  onOpenReservation: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({
  settings,
  onOpenReservation,
}) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappRaw || '258847849629'}?text=${encodeURIComponent(
    'Olá BON GOÛT café! Gostaria de mais informações sobre localização e pedidos de entrega.'
  )}`;

  return (
    <section id="horario-local" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-semibold text-[#D97724] uppercase tracking-wider block mb-2">
          Venha Visitar-nos
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17] mb-3">
          Localização, Horário &amp; Delivery
        </h2>
        <p className="text-sm text-[#6C5B52]">
          Estamos prontos para recebê-lo com café acabado de moer ou entregar o seu pedido favorito no conforto de sua casa.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Info Cards Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-4 flex flex-col justify-between"
        >
          {/* Operating Hours Card */}
          <div className="p-6 bg-white rounded-xl border border-[#E8DEC8] shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#D97724]">
              <Clock className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-[#2B1B17]">Horário de Funcionamento</h3>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-[#4E3F37]">
              <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                <span className="font-medium">Terça-Feira a Domingo</span>
                <span className="font-bold text-[#2B1B17] font-mono tabular-nums">08:00 – 19:00</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                <span className="text-[#8C7B71]">Segunda-Feira</span>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Encerrado para Descanso da Equipa
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#8C7B71]">Cozinha &amp; Balcão</span>
                <span className="font-medium text-[#4A5D4E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Delivery Card */}
          <div className="p-6 bg-white rounded-xl border border-[#E8DEC8] shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#4A5D4E]">
              <Truck className="w-5 h-5 text-[#4A5D4E]" />
              <h3 className="font-serif text-lg font-bold text-[#2B1B17]">Atendimento &amp; Delivery</h3>
            </div>
            <p className="text-xs text-[#6A5A50] leading-relaxed">
              Fazemos entregas em toda a cidade de Maputo e arredores. Peça pelo WhatsApp para um atendimento rápido e direto.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-[#4E3F37] pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <Phone className="w-4 h-4 text-[#D97724]" />
                  Telefone Principal:
                </span>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-[#2B1B17] hover:text-[#D97724] font-mono tabular-nums"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <MessageCircle className="w-4 h-4 text-[#4A5D4E]" />
                  WhatsApp Direto:
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#4A5D4E] hover:underline font-mono"
                >
                  +258 84 784 9629
                </a>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-[#4A5D4E] hover:bg-[#3D4D40] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#8CD19D]" />
                <span>Pedir no WhatsApp</span>
              </a>
              <button
                onClick={onOpenReservation}
                className="flex-1 py-2.5 px-3 text-xs font-semibold text-[#2B1B17] bg-[#F1E9DA] hover:bg-[#E7DBC7] border border-[#D5C6AF] rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Reservar Mesa</span>
              </button>
            </div>
          </div>

          {/* Location Address Note */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8] flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#D97724] shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="block font-semibold text-[#2B1B17] mb-0.5">Endereço do Café</strong>
              <p className="text-[#6D5C52]">Maputo, Moçambique</p>
              <a
                href={settings.mapsUrl || 'https://maps.app.goo.gl/8bLVEGu2MqVgV3Hp7'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#D97724] font-semibold hover:underline mt-1"
              >
                <span>Abrir rota no Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Map Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col"
        >
          <div className="bg-white rounded-xl border border-[#E8DEC8] overflow-hidden shadow-xs flex-1 flex flex-col min-h-[380px]">
            {/* Map Top Bar */}
            <div className="p-4 bg-[#FAF8F5] border-b border-[#F0EAE1] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2B1B17]">
                <MapPin className="w-4 h-4 text-[#D97724]" />
                <span>Localização no Google Maps</span>
              </div>
              <a
                href={settings.mapsUrl || 'https://maps.app.goo.gl/8bLVEGu2MqVgV3Hp7'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#D97724] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Ver no Mapa Externo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Map Iframe or Interactive Card */}
            <div className="relative flex-1 w-full bg-[#EAE2D5] min-h-[320px]">
              <iframe
                title="Localização do BON GOÛT café em Maputo"
                src="https://maps.google.com/maps?q=Maputo,+Mozambique&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-lg border border-[#E8DEC8] shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2B1B17]">BON GOÛT café</h4>
                  <p className="text-xs text-[#756459]">Eat, Sip, Gather • Maputo</p>
                </div>
                <a
                  href={settings.mapsUrl || 'https://maps.app.goo.gl/8bLVEGu2MqVgV3Hp7'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#2B1B17] text-white text-xs font-semibold rounded hover:bg-[#D97724] transition-colors flex items-center gap-1"
                >
                  <span>Direções</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

