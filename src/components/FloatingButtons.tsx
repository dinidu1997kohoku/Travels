import { MessageCircle, ArrowUp, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { waLink } from '../lib/api';
import { useSettings } from '../lib/settings';

export default function FloatingButtons() {
  const { get } = useSettings();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openWA = () =>
    window.open(waLink(get('whatsapp', '94771234567'), get('whatsapp_message', 'Hello! I would like to plan a Sri Lanka tour.')), '_blank');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-jungle-950/90 text-white shadow-xl backdrop-blur transition hover:bg-jungle-900"
        >
          <ArrowUp size={18} />
        </button>
      )}
      <a
        href={`tel:${get('phone', '+94 77 123 4567').replace(/\s/g, '')}`}
        aria-label="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ocean-600 text-white shadow-xl transition hover:bg-ocean-500 sm:hidden"
      >
        <Phone size={20} />
      </a>
      <button
        onClick={openWA}
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-4 pr-5 text-white shadow-2xl shadow-green-600/30 transition hover:bg-[#1fb857] hover:shadow-green-600/50"
      >
        <span className="relative">
          <MessageCircle size={24} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-white" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-85">Chat with us</span>
          <span className="block text-sm font-extrabold">WhatsApp</span>
        </span>
      </button>
    </div>
  );
}
