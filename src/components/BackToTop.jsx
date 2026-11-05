import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { defaultEase } from './animations/MotionWrappers';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const heroElement = document.getElementById('hero');

    if (!heroElement) {
      // Fallback to passive scroll position listener if hero section is not found
      const handleScroll = () => {
        setIsVisible(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // High performance IntersectionObserver to check if hero is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button only when hero section has scrolled out of view
        setIsVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.75, y: 16 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.75, y: 16 }
          }
          transition={{ duration: 0.25, ease: defaultEase }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-white/95 dark:bg-dark-850/95 text-black dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-black/5 dark:shadow-black/40 hover:bg-slate-100 dark:hover:bg-dark-800 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 group cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
