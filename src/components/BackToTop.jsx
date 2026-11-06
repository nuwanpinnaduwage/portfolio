import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { defaultEase } from './animations/MotionWrappers';

const CIRCLE_RADIUS = 20.5;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~128.805

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const rafIdRef = useRef(null);

  const calculateScroll = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
    const totalScroll = scrollHeight - clientHeight;

    const progress = totalScroll > 0 ? Math.min(Math.max(scrollY / totalScroll, 0), 1) : 0;
    setScrollProgress(progress);
    setIsVisible(scrollY > 250);
  }, []);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        calculateScroll();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [calculateScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  const strokeDashoffset = CIRCUMFERENCE * (1 - scrollProgress);

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
              : { opacity: 0, scale: 0.8, y: 12 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.8, y: 12 }
          }
          transition={{ duration: 0.22, ease: defaultEase }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white dark:bg-[#121212] text-[#2D3748] dark:text-[#F5F7FA] shadow-md hover:shadow-lg dark:shadow-none transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3748] dark:focus-visible:ring-[#F5F7FA] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0A0A0A] group cursor-pointer"
        >
          {/* Animated Circular Scroll Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            {/* Background Track Circle */}
            <circle
              cx="24"
              cy="24"
              r={CIRCLE_RADIUS}
              className="stroke-[#E2E8F0] dark:stroke-[#222222]"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Active Scroll Progress Circle */}
            <circle
              cx="24"
              cy="24"
              r={CIRCLE_RADIUS}
              className="stroke-[#2D3748] dark:stroke-[#F5F7FA] transition-[stroke-dashoffset] duration-75 ease-linear"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              fill="none"
            />
          </svg>

          {/* Centered Upward-Arrow SVG Icon */}
          <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2D3748] dark:text-[#F5F7FA] stroke-[2.2] transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
