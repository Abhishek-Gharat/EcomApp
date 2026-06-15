import { motion } from 'framer-motion';

/**
 * Scroll-triggered reveal wrapper. Fades + slides content into view once.
 * Usage: <Reveal delay={0.1}>...</Reveal>
 */
const directions = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

const Reveal = ({ children, delay = 0, direction = 'up', className = '', as = 'div' }) => {
  const offset = directions[direction] || directions.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
