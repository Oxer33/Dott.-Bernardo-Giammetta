// =============================================================================
// NAVBAR - DOTT. BERNARDO GIAMMETTA
// Navigation bar sticky con effetto glassmorphism e blur
// Responsive con menu hamburger per mobile
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Calendar, 
  User,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

// =============================================================================
// NAVIGATION LINKS
// =============================================================================

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/chi-sono', label: 'Chi Sono' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/blog', label: 'Blog' },
  { href: '/contatti', label: 'Contatti' },
];

// =============================================================================
// NAVBAR COMPONENT
// =============================================================================

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Effetto scroll per cambiare stile navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chiudi menu mobile quando cambia pagina
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Navbar principale */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-soft py-3'
            : 'bg-sage-900/30 backdrop-blur-sm py-5'
        )}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="relative z-10 group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
                {/* Logo icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-glow">
                  <span className="text-white font-display font-bold text-lg">BG</span>
                </div>
                
                {/* Logo text - nascosto su mobile piccolo */}
                <div className="hidden sm:block">
                  <p className={cn(
                      "font-display font-semibold text-lg leading-tight transition-colors",
                      isScrolled ? "text-sage-900" : "text-white"
                    )}>
                    Dott. Giammetta
                  </p>
                  <p className={cn(
                      "text-xs tracking-wide transition-colors",
                      isScrolled ? "text-sage-600" : "text-orange-100"
                    )}>
                    Biologo Nutrizionista
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    pathname === link.href
                      ? isScrolled 
                        ? 'text-sage-700 bg-sage-100'
                        : 'text-white bg-white/20'
                      : isScrolled
                        ? 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
                        : 'text-orange-100 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA & User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Pulsante Agenda */}
              <Link href="/agenda">
                <Button variant="secondary" size="sm">
                  <Calendar className="w-4 h-4" />
                  <span>Prenota</span>
                </Button>
              </Link>

              {/* User Menu */}
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-sage-200 animate-pulse" />
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-sage-50 transition-colors"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-sage-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-sage-600" />
                      </div>
                    )}
                    <ChevronDown className={cn(
                      'w-4 h-4 text-sage-600 transition-transform',
                      isUserMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-sage-100 overflow-hidden"
                      >
                        <div className="p-3 border-b border-sage-100">
                          <p className="font-medium text-sage-900 truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-sm text-sage-600 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/area-personale"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Area Personale
                          </Link>
                          <Link
                            href="/agenda"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Calendar className="w-4 h-4" />
                            I Miei Appuntamenti
                          </Link>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Esci
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => signIn('google')}
                >
                  <User className="w-4 h-4" />
                  <span>Accedi</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-10 p-2 rounded-xl hover:bg-sage-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-sage-900" />
              ) : (
                <Menu className="w-6 h-6 text-sage-900" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-sage-900/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300',
                          pathname === link.href
                            ? 'text-sage-700 bg-sage-100'
                            : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="space-y-3 pt-6 border-t border-sage-100">
                  <Link href="/agenda" className="block">
                    <Button variant="secondary" className="w-full justify-center">
                      <Calendar className="w-5 h-5" />
                      <span>Prenota Visita</span>
                    </Button>
                  </Link>
                  
                  {session ? (
                    <div className="space-y-3">
                      {/* Info utente */}
                      <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-sage-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sage-900 text-sm">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-sage-600">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Link menu mobile */}
                      <Link 
                        href="/area-personale" 
                        className="flex items-center gap-3 px-4 py-3 bg-sage-100 rounded-xl text-sage-800 hover:bg-sage-200 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Area Personale</span>
                      </Link>
                      
                      <Link 
                        href="/agenda" 
                        className="flex items-center gap-3 px-4 py-3 bg-lavender-100 rounded-xl text-lavender-800 hover:bg-lavender-200 transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">I Miei Appuntamenti</span>
                      </Link>
                      
                      {/* Logout */}
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        <span className="font-medium">Esci</span>
                      </button>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="w-full justify-center"
                      onClick={() => signIn('google')}
                    >
                      <User className="w-5 h-5" />
                      <span>Accedi con Google</span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer per compensare navbar fixed */}
      <div className="h-20" />
    </>
  );
}
