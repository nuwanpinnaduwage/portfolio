import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Smooth cubic-bezier easing [0.22, 1, 0.36, 1] for professional, natural deceleration
export const defaultEase = [0.22, 1, 0.36, 1];

/**
 * ScrollReveal: Reveals a block smoothly when it enters the viewport.
 * Fully supports bidirectional entry/exit animations (once: false by default).
 */
export function ScrollReveal({
  children,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
  amount = 0.15,
  once = false,
  margin = '-20px 0px -20px 0px',
  className = '',
  as = 'div',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  const getOffset = () => {
    if (shouldReduceMotion || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
      case 'from-bottom':
        return { x: 0, y: distance };
      case 'down':
      case 'from-top':
        return { x: 0, y: -distance };
      case 'left':
      case 'from-left':
        return { x: -distance, y: 0 };
      case 'right':
      case 'from-right':
        return { x: distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getOffset();
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin }}
      transition={{
        duration,
        delay,
        ease: defaultEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * ScaleReveal: Reveals an element with subtle scale (0.96 -> 1) and opacity transition.
 * Ideal for profile photos, preview cards, certificate images, and featured callouts.
 */
export function ScaleReveal({
  children,
  initialScale = 0.96,
  duration = 0.6,
  delay = 0,
  amount = 0.15,
  once = false,
  margin = '-20px 0px -20px 0px',
  className = '',
  as = 'div',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount, margin }}
      transition={{
        duration,
        delay,
        ease: defaultEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * StaggerContainer: Wraps a group of items to animate them sequentially.
 * Supports bidirectional triggers (once: false by default).
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.09,
  delayChildren = 0.05,
  amount = 0.12,
  once = false,
  margin = '-20px 0px -20px 0px',
  className = '',
  as = 'div',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * StaggerItem: An individual animated element inside a StaggerContainer.
 */
export function StaggerItem({
  children,
  direction = 'up',
  distance = 20,
  withScale = false,
  initialScale = 0.97,
  duration = 0.55,
  className = '',
  as = 'div',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const getOffset = () => {
    switch (direction) {
      case 'up':
      case 'from-bottom':
        return { x: 0, y: distance };
      case 'down':
      case 'from-top':
        return { x: 0, y: -distance };
      case 'left':
      case 'from-left':
        return { x: -distance, y: 0 };
      case 'right':
      case 'from-right':
        return { x: distance, y: 0 };
      case 'none':
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getOffset();

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: offset.x, 
      y: offset.y, 
      scale: withScale ? initialScale : 1 
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: defaultEase,
      },
    },
  };

  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * AnimatedProgressBar: Smoothly animates a skill progress bar from 0% to the target percentage.
 * Bidirectional: re-animates whenever it re-enters the viewport (once: false by default).
 */
export function AnimatedProgressBar({
  value,
  label,
  delay = 0.05,
  duration = 0.75,
  once = false,
  amount = 0.2,
  containerClassName = 'w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-[#161616] overflow-hidden',
  barClassName = 'h-full rounded-full bg-[#2D3748] dark:bg-[#F5F7FA]',
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={label || `Proficiency: ${value}%`}
      className={containerClassName}
    >
      <motion.div
        className={barClassName}
        initial={{ width: shouldReduceMotion ? `${value}%` : '0%' }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once, amount }}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          delay: shouldReduceMotion ? 0 : delay,
          ease: defaultEase,
        }}
      />
    </div>
  );
}
