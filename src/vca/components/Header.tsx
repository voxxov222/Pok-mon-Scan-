import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Services', href: '#services' },
  { name: 'Grading Guide', href: '#grading' },
  { name: 'Security Tech', href: '#security-tech' },
  { name: 'Submit Card', href: '#submit' },
  { name: 'Ledger', href: '#dashboard' },
  { name: 'Portal Login', href: '#auth' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <span className="font-display font-bold text-xl tracking-wide text-white">
            VCA
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a href="#submit" className="ml-4 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-sm font-semibold transition-all">
            Verify Item
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-slate-300 hover:text-cyan-400"
                >
                  {item.name}
                </a>
              ))}
              <a href="#submit" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center mt-4 px-5 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg font-semibold block">
                Verify Item
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
