import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHero({
  title,
  subtitle,
  image,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  image: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden md:min-h-[54vh]">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="h-full w-full object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/55 to-jungle-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-jungle-950/60 via-transparent to-transparent" />
      </div>
      <div className="container-x relative pb-12 pt-36 md:pb-16">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {crumbs && crumbs.length > 0 && (
            <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-white/70">
              <Link to="/" className="hover:text-gold-300">Home</Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight size={13} />
                  {c.to ? (
                    <Link to={c.to} className="hover:text-gold-300">{c.label}</Link>
                  ) : (
                    <span className="text-gold-300">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight text-white text-shadow-hero md:text-6xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
      <svg className="absolute bottom-0 left-0 w-full text-sand-50" viewBox="0 0 1440 70" preserveAspectRatio="none" height="44" aria-hidden>
        <path fill="currentColor" d="M0,32 C240,70 480,0 720,24 C960,48 1200,64 1440,24 L1440,70 L0,70 Z" />
      </svg>
    </section>
  );
}
