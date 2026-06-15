import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const FinalCTA = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Floating elements
  const floatVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const handleScrollToProducts = () => {
    // Scroll to products section with smooth behavior
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full py-24 bg-gradient-to-b from-pulse-bg-dark via-pulse-bg to-pulse-bg-dark overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        variants={floatVariants}
        animate="float"
        className="absolute top-20 left-10 w-64 h-64 bg-pulse-accent/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        variants={floatVariants}
        animate="float"
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-pulse-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Main Headline with Character Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            variants={containerVariants}
            className="text-5xl md:text-7xl font-black text-pulse-text mb-6 uppercase tracking-tight"
          >
            {/* Split text into letters for staggered animation */}
            {'READY TO UNLOCK MORE?'.split('').map((letter, index) => (
              <motion.span key={index} variants={letterVariants} className="inline-block">
                {letter === ' ' ? ' ' : letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-pulse-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of audio technology with PulseBay. Discover gear that moves with you,
            empowers your passion, and elevates every moment.
          </motion.p>
        </motion.div>

        {/* CTA Button with Advanced Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleScrollToProducts}
            className="group relative px-10 md:px-14 py-5 md:py-6 bg-pulse-accent text-pulse-bg font-black text-lg md:text-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-lg"
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pulse-gold via-pulse-accent to-pulse-gold opacity-0"
              animate={{ opacity: isHovered ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <span className="uppercase tracking-wider">CHARGE UP</span>
            </div>

            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-white opacity-0"
              animate={{ scale: isHovered ? 1.5 : 1, opacity: isHovered ? 0.1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        </motion.div>

        {/* Supporting Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <p className="text-pulse-text-secondary text-sm md:text-base">
            💥 Limited time offers • ⚡ Free shipping on orders over $100 • 🎁 Exclusive member rewards
          </p>
          <p className="text-pulse-text font-semibold">
            PulseBay Gear — where tech empowers motion.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-pulse-accent/20 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { number: '10K+', label: 'Happy Customers' },
            { number: '500+', label: 'Products' },
            { number: '98%', label: 'Satisfaction' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-4"
            >
              <motion.div
                className="text-3xl md:text-4xl font-black text-pulse-gold mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity }}
              >
                {stat.number}
              </motion.div>
              <p className="text-pulse-text-secondary text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FinalCTA;
