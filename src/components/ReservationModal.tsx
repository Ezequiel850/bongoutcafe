import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, settings }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !date || !time) {
      alert('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createInquiry({
        type: 'reservation',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        date,
        time,
        guests: Number(guests),
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Falha ao registar reserva:', err);
      alert('Ocorreu um erro ao guardar a reserva. Pode também reservar via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyWhatsApp = () => {
    const text = `*RESERVA DE MESA - BON GOÛT café*\n\n` +
      `👤 *Nome:* ${customerName}\n` +
      `📞 *Contacto:* ${customerPhone}\n` +
      `📅 *Data:* ${date}\n` +
      `⏰ *Hora:* ${time}\n` +
      `👥 *Pessoas:* ${guests}\n` +
      (notes ? `📝 *Notas:* ${notes}\n` : '') +
      `\n_Solicito confirmação de disponibilidade da mesa. Obrigado!_`;

    const targetWhatsapp = settings.whatsappRaw || '258847849629';
    window.open(`https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E8DEC8]">
        {/* Header */}
        <div className="p-6 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D97724]" />
            <h2 className="font-serif text-xl font-bold text-[#2B1B17]">Reserva de Mesa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7C6B61] hover:text-[#2B1B17] rounded-md transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#4A5D4E] mx-auto animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-[#2B1B17]">Reserva Solicitada!</h3>
            <p className="text-xs sm:text-sm text-[#6C5B52] leading-relaxed">
              Obrigado, <strong>{customerName}</strong>! Registámos o seu pedido para <strong>{guests} pessoas</strong> no dia <strong>{date}</strong> às <strong>{time}</strong>.
            </p>
            <div className="pt-3 space-y-2">
              <button
                onClick={handleNotifyWhatsApp}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#4A5D4E] hover:bg-[#3D4D40] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#8CD19D]" />
                <span>Confirmar Imediatamente no WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#2B1B17] bg-[#F1E9DA] hover:bg-[#EAE0D0] rounded-lg transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Sara Machava"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+258 84 000 0000"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D97724]" />
                  Hora *
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
                >
                  <option value="08:30">08:30 (Pequeno-Almoço)</option>
                  <option value="09:30">09:30</option>
                  <option value="10:30">10:30</option>
                  <option value="11:30">11:30</option>
                  <option value="12:30">12:30 (Almoço)</option>
                  <option value="13:30">13:30</option>
                  <option value="14:30">14:30</option>
                  <option value="15:30">15:30 (Chá da Tarde)</option>
                  <option value="16:30">16:30</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#D97724]" />
                Número de Pessoas
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      guests === num
                        ? 'bg-[#2B1B17] text-white border-[#2B1B17]'
                        : 'bg-[#FAF8F5] text-[#5C4D44] border-[#E3D9C9] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    {num === 8 ? '8+' : `${num}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#8C7B71] tracking-wider mb-1">
                Preferências / Pedidos Especiais
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Aniversário, mesa perto da janela ou esplanada..."
                className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97724] text-[#2B1B17]"
              />
            </div>

            <p className="text-[11px] text-[#8A796E]">
              * O café está aberto de Terça a Domingo das 08h às 19h (Segundas-feiras encerrado).
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#2B1B17] hover:bg-[#D97724] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Calendar className="w-4 h-4 text-[#D97724]" />
              <span>{isSubmitting ? 'A registar...' : 'Confirmar Reserva de Mesa'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
