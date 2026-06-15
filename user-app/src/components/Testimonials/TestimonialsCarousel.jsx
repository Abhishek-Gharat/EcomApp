import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex M.',
    location: 'Mumbai, India',
    avatar: '👨‍💼',
    rating: 5,
    text: 'Best headphones I\'ve ever used. The sound quality is incredible!',
    product: 'PulseBay Pro X',
    purchaseDate: '2 months ago',
    verified: true,
  },
  {
    id: 2,
    name: 'Jordan K.',
    location: 'New York, USA',
    avatar: '👩‍🎤',
    rating: 5,
    text: 'Quality meets simplicity. This is exactly what I was looking for.',
    product: 'PulseBay Elite',
    purchaseDate: '1 month ago',
    verified: true,
  },
  {
    id: 3,
    name: 'Casey T.',
    location: 'London, UK',
    avatar: '👨‍🔧',
    rating: 5,
    text: 'Best impulse buy I\'ve made this year. Worth every penny!',
    product: 'PulseBay Gear Pro',
    purchaseDate: '3 weeks ago',
    verified: true,
  },
  {
    id: 4,
    name: 'Sam P.',
    location: 'Toronto, Canada',
    avatar: '👩‍💻',
    rating: 5,
    text: 'The build quality and attention to detail is unmatched.',
    product: 'PulseBay Pro X',
    purchaseDate: '1 week ago',
    verified: true,
  },
  {
    id: 5,
    name: 'Morgan L.',
    location: 'Berlin, Germany',
    avatar: '👨‍🎨',
    rating: 5,
    text: 'Finally found headphones that match my lifestyle perfectly.',
    product: 'PulseBay Elite',
    purchaseDate: '5 days ago',
    verified: true,
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);

  // Auto-slide testimonials
  useEffect(() => {
    if (!autoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay]);

  const handlePrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  const resumeAutoPlay = () => {
    setTimeout(() => setAutoPlay(true), 3000);
  };

  return (
    <div className="w-full py-20 bg-pulse-bg-dark">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-pulse-text mb-4 uppercase">
            PEOPLE WHO MOVE
          </h2>
          <p className="text-pulse-text-secondary text-lg">
            Real stories from real customers
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-96 md:h-80 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
              onMouseEnter={() => {
                setAutoPlay(false);
              }}
              onMouseLeave={() => resumeAutoPlay()}
            >
              <div className="bg-pulse-gray rounded-2xl border border-pulse-accent/20 p-8 md:p-12 h-full flex flex-col justify-between">
                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Star
                        className="w-5 h-5 fill-pulse-gold text-pulse-gold"
                        key={i}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl md:text-2xl text-pulse-text font-semibold italic my-6"
                >
                  "{testimonials[currentIndex].text}"
                </motion.p>

                {/* Verified Badge & Product */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 mb-4"
                >
                  {testimonials[currentIndex].verified && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">Verified Purchase</span>
                    </div>
                  )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-pulse-text-secondary text-sm mb-4"
                >
                  <p>Purchased: {testimonials[currentIndex].product}</p>
                  <p className="text-xs mt-1">{testimonials[currentIndex].purchaseDate}</p>
                </motion.div>

                {/* Customer Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-4 pt-6 border-t border-pulse-accent/10"
                >
                  <div className="text-3xl">{testimonials[currentIndex].avatar}</div>
                  <div>
                    <p className="font-bold text-pulse-text">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-pulse-text-secondary">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-10 bg-pulse-accent hover:bg-pulse-accent-dark text-pulse-bg p-3 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-10 bg-pulse-accent hover:bg-pulse-accent-dark text-pulse-bg p-3 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Dots Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mt-8"
        >
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleDotClick(index);
                resumeAutoPlay();
              }}
              className={`h-3 rounded-full transition ${
                index === currentIndex
                  ? 'bg-pulse-accent w-8'
                  : 'bg-pulse-accent/30 w-3 hover:bg-pulse-accent/50'
              }`}
            />
          ))}
        </motion.div>

        {/* Auto-play indicator */}
        {autoPlay && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-pulse-text-secondary text-sm mt-4"
          >
            Auto-playing testimonials...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
