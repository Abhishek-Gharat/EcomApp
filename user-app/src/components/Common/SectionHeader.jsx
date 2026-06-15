import Reveal from './Reveal';

/**
 * Consistent section header: eyebrow label + gold accent bar + title + optional subtitle.
 * Gives every section the same premium rhythm.
 */
const SectionHeader = ({ eyebrow, title, subtitle, align = 'left' }) => {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <Reveal className={`flex flex-col ${alignment} max-w-2xl mb-12`}>
      {eyebrow && (
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-pulse-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-pulse-gold">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-pulse-text uppercase tracking-tight leading-[0.95]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-pulse-text-secondary text-base md:text-lg mt-4 leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
};

export default SectionHeader;
