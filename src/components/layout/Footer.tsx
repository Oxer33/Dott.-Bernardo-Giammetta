// =============================================================================
// FOOTER - DOTT. BERNARDO GIAMMETTA
// Footer minimalista con link social e informazioni di contatto
// =============================================================================

import Link from 'next/link';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

// =============================================================================
// SOCIAL LINKS
// =============================================================================

const socialLinks = [
  { 
    icon: Instagram, 
    href: 'https://instagram.com/dott.bernardogiammetta', 
    label: 'Instagram' 
  },
  { 
    icon: Facebook, 
    href: 'https://facebook.com/dott.bernardogiammetta', 
    label: 'Facebook' 
  },
  { 
    icon: Linkedin, 
    href: 'https://linkedin.com/in/bernardogiammetta', 
    label: 'LinkedIn' 
  },
];

// =============================================================================
// FOOTER LINKS
// =============================================================================

const footerLinks = {
  navigazione: [
    { label: 'Home', href: '/' },
    { label: 'Chi Sono', href: '/chi-sono' },
    { label: 'Servizi', href: '/servizi' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contatti', href: '/contatti' },
  ],
  servizi: [
    { label: 'Prima Visita', href: '/servizi#prima-visita' },
    { label: 'Controlli', href: '/servizi#controlli' },
    { label: 'Nutrizione Sportiva', href: '/servizi#sportiva' },
    { label: 'Prenota Online', href: '/agenda' },
  ],
  legali: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie' },
    { label: 'Termini e Condizioni', href: '/termini' },
  ],
};

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sage-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-400 to-sage-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">BG</span>
              </div>
              <div>
                <p className="font-display font-semibold text-white text-lg">
                  Dott. Giammetta
                </p>
                <p className="text-sage-300 text-sm">
                  Biologo Nutrizionista
                </p>
              </div>
            </Link>
            
            <p className="text-sage-300 text-sm leading-relaxed mb-6">
              Percorsi di <em className="text-sage-200">nutrizione personalizzata</em> per 
              raggiungere il tuo <em className="text-sage-200">benessere</em> ottimale 
              attraverso un approccio scientifico e umano.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sage-800 hover:bg-sage-700 
                           flex items-center justify-center transition-all duration-300
                           hover:-translate-y-1 hover:shadow-lg"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-sage-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">
              Navigazione
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigazione.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">
              Servizi
            </h4>
            <ul className="space-y-3">
              {footerLinks.servizi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">
              Contatti
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@bernardogiammetta.com"
                  className="flex items-start gap-3 text-sage-300 hover:text-white transition-colors duration-300 group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-sage-400 group-hover:text-sage-300" />
                  <span className="text-sm">info@bernardogiammetta.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+393920979135"
                  className="flex items-start gap-3 text-sage-300 hover:text-white transition-colors duration-300 group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-sage-400 group-hover:text-sage-300" />
                  <span className="text-sm">+39 392 0979135</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sage-300">
                  <MapPin className="w-5 h-5 mt-0.5 text-sage-400 flex-shrink-0" />
                  <span className="text-sm">
                    Via Example, 123<br />
                    00100 Roma (RM)
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sage-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sage-400 text-sm text-center md:text-left">
              © {currentYear} Dott. Bernardo Giammetta. Tutti i diritti riservati.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {footerLinks.legali.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sage-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Made with love */}
            <p className="text-sage-500 text-xs flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-blush-200 fill-current" /> in Italy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
