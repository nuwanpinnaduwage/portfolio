import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { resolveSegmentColor } from '../../utils/heroTextRange.js';

/**
 * HeroAnimatedText: High-performance, zero-CLS animated text component
 * supporting 20+ animation types with structured rich-text segments,
 * independent Light & Dark Mode word styling, one-shot entrance animations, and reduced-motion fallback.
 */
export default function HeroAnimatedText({
  text = '',
  highlight = '',
  segments = null,
  animation = {},
  style = {},
  className = '',
  as: Component = 'div',
  accentColor = '#16C96B',
  textColor = 'inherit',
  darkMode = true,
  replayKey = 0,
  isEditorMode = false,
  selectedSegmentId = null,
  onSelectSegment = null,
  isPaused = false,
}) {
  const shouldReduceMotion = useReducedMotion();

  // If segments array is provided with content, render the structured rich-text segment model
  if (Array.isArray(segments) && segments.length > 0) {
    return (
      <Component 
        key={`hero-text-${replayKey}`}
        className={className} 
        style={{ ...style, color: textColor }}
      >
        {segments.map((segment) => {
          const segAnimation = segment.animation?.type && segment.animation.type !== 'inherit'
            ? segment.animation
            : animation;
          const isSelected = isEditorMode && selectedSegmentId === segment.id;

          const segColor = resolveSegmentColor(segment, darkMode, textColor);

          const segStyle = {
            color: segColor,
            fontWeight: segment.fontWeight || undefined,
            fontStyle: segment.fontStyle || undefined,
            fontSize: segment.fontSize || undefined,
            textDecoration: segment.textDecoration || undefined,
            textTransform: segment.textTransform || undefined,
            letterSpacing: segment.letterSpacing || undefined,
            wordSpacing: segment.wordSpacing || undefined,
            opacity: segment.opacity !== undefined ? segment.opacity : undefined,
          };

          return (
            <span
              key={segment.id}
              data-segment-id={segment.id}
              onClick={(e) => {
                if (isEditorMode && onSelectSegment) {
                  e.stopPropagation();
                  onSelectSegment(segment.id);
                }
              }}
              className={`inline-block whitespace-pre relative transition-colors ${
                isEditorMode 
                  ? 'cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-emerald-400/70 rounded-xs' 
                  : ''
              } ${isSelected ? 'outline-2 outline-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 rounded-xs' : ''}`}
            >
              <SingleAnimatedToken
                text={segment.text}
                animation={segAnimation}
                style={segStyle}
                accentColor={accentColor}
                shouldReduceMotion={shouldReduceMotion}
                isPaused={isPaused}
                replayKey={replayKey}
              />
            </span>
          );
        })}
      </Component>
    );
  }

  // Fallback to single text / string animation
  return (
    <Component 
      key={`hero-text-${replayKey}`}
      className={className} 
      style={{ ...style, color: textColor }}
    >
      <SingleAnimatedToken
        text={text}
        highlight={highlight}
        animation={animation}
        accentColor={accentColor}
        shouldReduceMotion={shouldReduceMotion}
        isPaused={isPaused}
        replayKey={replayKey}
      />
    </Component>
  );
}

/**
 * Single Animated Token renderer with lifecycle awareness.
 * Guarantees that entrance animations run ONCE by default and do not restart
 * when styling (e.g. text color, font size, spacing) changes.
 */
function SingleAnimatedToken({
  text = '',
  highlight = '',
  animation = {},
  style = {},
  accentColor = '#16C96B',
  shouldReduceMotion = false,
  isPaused = false,
  replayKey = 0,
}) {
  const animType = (animation?.type || 'none').toLowerCase().replace(/[_\s]+/g, '-');
  const duration = typeof animation?.duration === 'number' ? animation.duration : 0.6;
  const delay = typeof animation?.delay === 'number' ? animation.delay : 0;
  const stagger = typeof animation?.stagger === 'number' ? animation.stagger : 0.05;
  const direction = animation?.direction || 'up';
  
  // Continuous animations naturally loop
  const isContinuous = ['floating-text', 'subtle-pulse', 'color-transition', 'text-shimmer'].includes(animType);
  
  // Entrance animations run ONCE by default. Loop ONLY when explicitly enabled.
  const isExplicitRepeat = Boolean(animation?.repeat);
  const shouldLoop = isContinuous || isExplicitRepeat;
  const repeatCount = animation?.repeatCount && animation.repeatCount > 0 ? animation.repeatCount : (shouldLoop ? Infinity : 0);
  
  const distance = typeof animation?.distance === 'number' ? animation.distance : 24;
  const blurAmount = typeof animation?.blur === 'number' ? animation.blur : 12;
  const scaleAmount = typeof animation?.scale === 'number' ? animation.scale : 0.88;
  const isDisabled = Boolean(animation?.disabled) || animType === 'none' || shouldReduceMotion;

  // Track whether the entrance animation has played to completion
  const [hasCompleted, setHasCompleted] = useState(false);
  const prevReplayKeyRef = useRef(replayKey);

  // When user explicitly triggers Replay, reset completion state so entrance replays
  if (prevReplayKeyRef.current !== replayKey) {
    prevReplayKeyRef.current = replayKey;
    if (hasCompleted) {
      setHasCompleted(false);
    }
  }

  const easeCurve = useMemo(() => {
    switch (animation?.easing) {
      case 'linear':
        return 'linear';
      case 'ease-in':
        return [0.4, 0, 1, 1];
      case 'ease-in-out':
        return [0.42, 0, 0.58, 1];
      case 'spring':
        return [0.175, 0.885, 0.32, 1.275];
      case 'bounce':
        return [0.68, -0.55, 0.265, 1.55];
      case 'ease-out':
      default:
        return [0.22, 1, 0.36, 1];
    }
  }, [animation?.easing]);

  // Transition config: strictly omits repeat and repeatDelay when loop is not explicitly enabled
  const baseTransition = useMemo(() => {
    const t = {
      duration: isPaused ? 0 : duration,
      delay: hasCompleted ? 0 : delay,
      ease: easeCurve,
    };
    if (shouldLoop && repeatCount) {
      t.repeat = repeatCount;
      t.repeatDelay = typeof animation?.repeatDelay === 'number' ? animation.repeatDelay : (animType === 'typewriter' ? 2 : 2.5);
    }
    return t;
  }, [duration, delay, easeCurve, shouldLoop, repeatCount, isPaused, hasCompleted, animation?.repeatDelay, animType]);

  // If disabled or reduced motion: render plain text
  if (isDisabled) {
    return (
      <span style={style} className="inline-block whitespace-pre">
        {renderHighlightedText(text, highlight, accentColor)}
      </span>
    );
  }

  // If entrance has completed and animation does not loop, render in resting state.
  // This guarantees changing text color, font size, or spacing NEVER restarts the animation!
  if (hasCompleted && !shouldLoop) {
    return (
      <motion.span
        style={style}
        className="inline-block whitespace-pre"
        animate={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 1. TYPEWRITER ANIMATION
  if (animType === 'typewriter') {
    const chars = Array.from(text || '');
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial="hidden"
        animate={isPaused ? "visible" : "visible"}
        onAnimationComplete={() => setHasCompleted(true)}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: delay,
              staggerChildren: Math.max(0.02, Math.min(0.08, duration / Math.max(1, chars.length))),
              ...(shouldLoop && repeatCount ? { repeat: repeatCount, repeatDelay: 2 } : {}),
            },
          },
        }}
        className="inline-block whitespace-pre"
      >
        {chars.map((char, index) => {
          const isHighlighted = highlight && text.includes(highlight) && isCharInHighlight(text, highlight, index);
          return (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, display: 'none' },
                visible: { opacity: 1, display: 'inline' },
              }}
              style={isHighlighted ? { color: accentColor } : {}}
            >
              {char}
            </motion.span>
          );
        })}
        <motion.span
          animate={{ opacity: isPaused ? 1 : [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="inline-block ml-0.5 font-bold"
          style={{ color: accentColor }}
        >
          |
        </motion.span>
      </motion.span>
    );
  }

  // 2. CURSOR BLINK ANIMATION
  if (animType === 'cursor-blink') {
    return (
      <span style={style} className="inline-block whitespace-pre">
        {renderHighlightedText(text, highlight, accentColor)}
        <motion.span
          animate={{ opacity: isPaused ? 1 : [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="inline-block ml-0.5 font-bold"
          style={{ color: accentColor }}
        >
          _
        </motion.span>
      </span>
    );
  }

  // 3. CHARACTER-BY-CHARACTER / CHARACTER REVEAL
  if (animType === 'character-reveal' || animType === 'character-by-character') {
    const chars = Array.from(text || '');
    const yOffset = direction === 'down' ? -distance : direction === 'up' ? distance : 0;
    const xOffset = direction === 'right' ? -distance : direction === 'left' ? distance : 0;

    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial="hidden"
        animate={isPaused ? "visible" : "visible"}
        onAnimationComplete={() => setHasCompleted(true)}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: Math.max(0.015, Math.min(0.06, stagger || 0.03)),
              ...(shouldLoop && repeatCount ? { repeat: repeatCount, repeatDelay: 2.5 } : {}),
            },
          },
        }}
        className="inline-block whitespace-pre"
      >
        {chars.map((char, index) => {
          const isHighlighted = highlight && text.includes(highlight) && isCharInHighlight(text, highlight, index);
          return (
            <span key={index} className="inline-block overflow-hidden align-top">
              <motion.span
                variants={{
                  hidden: { y: yOffset, x: xOffset, opacity: 0 },
                  visible: {
                    y: 0,
                    x: 0,
                    opacity: 1,
                    transition: { duration: Math.min(duration, 0.45), ease: easeCurve },
                  },
                }}
                className="inline-block whitespace-pre"
                style={isHighlighted ? { color: accentColor } : {}}
              >
                {char}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    );
  }

  // 4. WORD REVEAL / WORD-BY-WORD
  if (animType === 'word-reveal' || animType === 'word-by-word') {
    const words = (text || '').split(' ');
    const yOffset = direction === 'down' ? -distance : direction === 'up' ? distance : 0;
    const xOffset = direction === 'right' ? -distance : direction === 'left' ? distance : 0;

    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial="hidden"
        animate={isPaused ? "visible" : "visible"}
        onAnimationComplete={() => setHasCompleted(true)}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: stagger || 0.08,
              ...(shouldLoop && repeatCount ? { repeat: repeatCount, repeatDelay: 2.5 } : {}),
            },
          },
        }}
        className="inline-block whitespace-pre"
      >
        {words.map((word, wIdx) => {
          const isHighlighted = highlight && word.toLowerCase().includes(highlight.toLowerCase());
          return (
            <span key={wIdx} className="inline-block overflow-hidden mr-[0.25em] align-top">
              <motion.span
                variants={{
                  hidden: { y: yOffset, x: xOffset, opacity: 0 },
                  visible: {
                    y: 0,
                    x: 0,
                    opacity: 1,
                    transition: { duration, ease: easeCurve },
                  },
                }}
                className="inline-block whitespace-pre"
                style={isHighlighted ? { color: accentColor } : {}}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    );
  }

  // 5. BLUR REVEAL
  if (animType === 'blur-reveal') {
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 0, filter: `blur(${blurAmount}px)`, scale: scaleAmount }}
        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
        onAnimationComplete={() => setHasCompleted(true)}
        transition={baseTransition}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 6. ZOOM IN / ZOOM OUT
  if (animType === 'zoom-in') {
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 0, scale: scaleAmount }}
        animate={{ opacity: 1, scale: 1 }}
        onAnimationComplete={() => setHasCompleted(true)}
        transition={baseTransition}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }
  if (animType === 'zoom-out') {
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: scaleAmount }}
        onAnimationComplete={() => setHasCompleted(true)}
        transition={baseTransition}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 7. MASK REVEAL (Smooth clip-path uncover)
  if (animType === 'mask-reveal') {
    return (
      <span className="inline-block overflow-hidden align-top whitespace-pre">
        <motion.span
          key={`token-${replayKey}`}
          style={style}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          onAnimationComplete={() => setHasCompleted(true)}
          transition={baseTransition}
          className="inline-block whitespace-pre"
        >
          {renderHighlightedText(text, highlight, accentColor)}
        </motion.span>
      </span>
    );
  }

  // 8. SLIDE UP / SLIDE DOWN / SLIDE LEFT / SLIDE RIGHT
  if (animType === 'slide-up' || animType === 'slide-down' || animType === 'slide-left' || animType === 'slide-right') {
    const yOffset = animType === 'slide-down' ? -distance : animType === 'slide-up' ? distance : 0;
    const xOffset = animType === 'slide-right' ? -distance : animType === 'slide-left' ? distance : 0;

    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 0, y: yOffset, x: xOffset }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        onAnimationComplete={() => setHasCompleted(true)}
        transition={baseTransition}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 9. CONTINUOUS: FLOATING TEXT (Always continuous)
  if (animType === 'floating-text') {
    return (
      <motion.span
        style={style}
        animate={isPaused ? { y: 0 } : { y: [-4, 4, -4] }}
        transition={{ duration: Math.max(1.8, duration * 3), repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 10. CONTINUOUS: SUBTLE PULSE
  if (animType === 'subtle-pulse') {
    return (
      <motion.span
        style={style}
        animate={isPaused ? { scale: 1, opacity: 1 } : { scale: [0.98, 1.02, 0.98], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: Math.max(1.8, duration * 3), repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 11. CONTINUOUS: COLOR TRANSITION
  if (animType === 'color-transition') {
    return (
      <motion.span
        style={style}
        animate={isPaused ? { color: accentColor } : { color: [accentColor, '#34D399', '#6EE7B7', accentColor] }}
        transition={{ duration: Math.max(2.5, duration * 4), repeat: Infinity, ease: 'linear' }}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 12. CONTINUOUS: TEXT SHIMMER
  if (animType === 'text-shimmer') {
    return (
      <span
        style={{
          ...style,
          backgroundImage: `linear-gradient(90deg, currentColor 0%, ${accentColor} 50%, currentColor 100%)`,
          backgroundSize: '200% auto',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: isPaused ? 'none' : 'heroShimmer 2.5s linear infinite',
        }}
        className="inline-block font-semibold whitespace-pre"
      >
        {text}
        <style>{`
          @keyframes heroShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      </span>
    );
  }

  // 13. EXIT ANIMATIONS: FADE OUT / SLIDE OUT
  if (animType === 'fade-out') {
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration, delay, ease: easeCurve }}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }
  if (animType === 'slide-out') {
    return (
      <motion.span
        key={`token-${replayKey}`}
        style={style}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -distance }}
        transition={{ duration, delay, ease: easeCurve }}
        className="inline-block whitespace-pre"
      >
        {renderHighlightedText(text, highlight, accentColor)}
      </motion.span>
    );
  }

  // 14. DEFAULT: FADE IN
  return (
    <motion.span
      key={`token-${replayKey}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onAnimationComplete={() => setHasCompleted(true)}
      transition={baseTransition}
      className="inline-block whitespace-pre"
    >
      {renderHighlightedText(text, highlight, accentColor)}
    </motion.span>
  );
}

// Helper to safely render highlight spans
function renderHighlightedText(text = '', highlight = '', accentColor = '#16C96B') {
  if (!highlight || !text.toLowerCase().includes(highlight.toLowerCase())) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === highlight.toLowerCase()) {
      return (
        <span key={index} style={{ color: accentColor }} className="font-semibold">
          {part}
        </span>
      );
    }
    return part;
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isCharInHighlight(fullText, highlight, charIndex) {
  const lowerFull = fullText.toLowerCase();
  const lowerHigh = highlight.toLowerCase();
  let searchIdx = lowerFull.indexOf(lowerHigh);
  while (searchIdx !== -1) {
    if (charIndex >= searchIdx && charIndex < searchIdx + lowerHigh.length) {
      return true;
    }
    searchIdx = lowerFull.indexOf(lowerHigh, searchIdx + 1);
  }
  return false;
}
