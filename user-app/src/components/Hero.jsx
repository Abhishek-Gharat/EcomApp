import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Scroll indicator fill animation
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const scrolled = window.scrollY;
      const fillPercent = Math.min((scrolled / heroHeight) * 100, 100);
      const indicator = document.querySelector('[data-scroll-indicator]');
      if (indicator) {
        indicator.style.width = `${fillPercent}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor-reactive hero image (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768 || !imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = (e.clientX - centerX) * 0.1;
      const offsetY = (e.clientY - centerY) * 0.1;

      imageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(2deg) scale(1)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-pulse-bg flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pulse-accent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center">
        {/* Headline */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pulse-accent/20 to-pulse-gold/20 px-4 py-2 text-sm text-pulse-accent border border-pulse-accent/50">
          <span className="w-2 h-2 bg-pulse-gold rounded-full animate-glow-pulse" />
          Premium Gear • Charged & Ready
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-pulse-text mb-6 tracking-tight leading-tight">
          GET CHARGED
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-pulse-text-secondary mb-10 max-w-2xl leading-relaxed animate-slide-up">
          Tech built for people who move. Fast.
        </p>

        {/* Hero 3D Model */}
        <div className="mb-12 w-full max-w-2xl h-96 md:h-[500px] lg:h-[600px] relative rounded-2xl overflow-hidden border border-pulse-accent/30 shadow-glow bg-pulse-gray">
          <div
            ref={imageRef}
            className="relative w-full h-full transition-transform duration-100 ease-out"
          >
            <iframe
              title="Marshall Major IV headphones"
              frameBorder="0"
              allowFullScreen
              mozAllowFullScreen="true"
              webkitAllowFullScreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xrSpatialTracking
              executionWhileOutOfViewport
              executionWhileNotRendered
              webShare
              src="https://sketchfab.com/models/102ca77328c24c4b890e4f7c71bda101/embed?annotations=false&ui_infos=false&ui_controls=false&ui_watermark=false&ui_inspector=false&autostart=1"
              className="w-full h-full"
              style={{
                borderRadius: '1rem',
                overflow: 'hidden',
              }}
            />
          </div>
          {/* Glow pulse effect */}
          <div className="absolute inset-0 rounded-2xl shadow-glow animate-glow-pulse pointer-events-none" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group relative px-8 py-4 md:px-12 md:py-5 bg-pulse-accent text-pulse-bg font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-glow-intense hover:scale-105">
            CHARGE UP
            <span className="absolute inset-0 rounded-xl bg-pulse-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
          <button className="group relative px-8 py-4 md:px-12 md:py-5 bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105">
            EXPLORE NOW
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2">
          <p className="text-pulse-text-secondary text-sm">Scroll to explore</p>
          <ChevronDown className="w-5 h-5 text-pulse-accent animate-bounce" />
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        data-scroll-indicator
        className="absolute bottom-0 left-0 h-1 bg-pulse-accent transition-all duration-200"
        style={{ width: '0%' }}
      />
    </div>
  );
};

export default Hero;
