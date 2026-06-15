import { useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

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

  // Cursor-reactive parallax on the 3D card (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768 || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) * 0.015;
      const offsetY = (e.clientY - centerY) * 0.015;
      imageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToProducts = () => {
    document
      .querySelector('[data-section="products"]')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-pulse-bg flex flex-col items-center justify-center px-4 pt-10 pb-20 overflow-hidden"
    >
      {/* Layered ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-pulse-accent/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-pulse-gold/10 rounded-full blur-[120px]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center">
        {/* Eyebrow badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-pulse-gray/70 backdrop-blur px-4 py-2 text-sm text-pulse-text-secondary border border-pulse-gold/30">
          <span className="w-2 h-2 bg-pulse-gold rounded-full animate-glow-pulse" />
          Premium Gear — Charged &amp; Ready
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-pulse-text mb-6 tracking-tight leading-[0.92]">
          GET <span className="text-gradient-gold">CHARGED</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-2xl text-pulse-text-secondary mb-9 max-w-2xl leading-relaxed">
          Premium audio tech built for people who move. Fast shipping, real warranties, zero compromise.
        </p>

        {/* Hero 3D Model */}
        <div className="mb-9 w-full max-w-2xl h-96 md:h-[480px] lg:h-[560px] relative rounded-3xl overflow-hidden border border-pulse-border shadow-card bg-pulse-gray">
          {/* gold corner accent */}
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-pulse-gold/60 to-transparent z-10" />
          <div
            ref={imageRef}
            className="relative w-full h-full transition-transform duration-300 ease-out"
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                position: 'absolute',
                width: '120%',
                height: '150%',
                top: '-25%',
                left: '-10%',
                overflow: 'hidden',
                borderRadius: '1.5rem',
              }}
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
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '1.5rem',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={scrollToProducts}
            className="shimmer-on-hover group inline-flex items-center justify-center gap-2 px-10 py-4 md:py-5 bg-pulse-gold hover:bg-pulse-gold-light text-pulse-bg font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-gold-glow-intense hover:-translate-y-0.5 active:scale-95"
          >
            CHARGE UP
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={scrollToProducts}
            className="inline-flex items-center justify-center px-10 py-4 md:py-5 bg-transparent border-2 border-pulse-border hover:border-pulse-accent text-pulse-text font-bold text-lg rounded-xl transition-all duration-300 hover:bg-pulse-accent/5"
          >
            EXPLORE NOW
          </button>
        </div>

        {/* Trust signals */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-pulse-text-muted">
          <span className="inline-flex items-center gap-2">
            <Truck className="w-4 h-4 text-pulse-gold" /> Free shipping over Rs. 5,000
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pulse-gold" /> 1-year warranty
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="w-4 h-4 fill-pulse-gold text-pulse-gold" /> 4.9/5 from 10K+ buyers
          </span>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToProducts}
          className="mt-14 flex flex-col items-center gap-2 text-pulse-text-muted hover:text-pulse-gold transition-colors"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Scroll progress bar */}
      <div
        data-scroll-indicator
        className="fixed top-16 left-0 h-0.5 bg-pulse-gold transition-all duration-200 z-40"
        style={{ width: '0%' }}
      />
    </div>
  );
};

export default Hero;
