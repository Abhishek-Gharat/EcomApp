import { Search, X } from 'lucide-react';

const EmptySearchState = ({ searchQuery, onClear, onSuggestionClick }) => {
  const suggestions = [
    'Earphones',
    'Smartwatches',
    'Speakers',
    'Power Banks',
    'Headphones',
    'Cables'
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-pulse-bg-dark">
      <div className="text-center max-w-md px-4">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Search className="w-16 h-16 text-pulse-gray" />
            <X className="absolute -bottom-1 -right-1 w-6 h-6 text-red-500 bg-pulse-bg rounded-full p-0.5" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-black text-pulse-text mb-3">
          No products found
        </h2>

        {/* Description */}
        <p className="text-pulse-text-secondary mb-8">
          We couldn't find any products matching "<span className="text-pulse-accent font-bold">{searchQuery}</span>".
          Try a different search term or browse our suggestions below.
        </p>

        {/* Suggestions */}
        <div className="mb-8">
          <p className="text-sm text-pulse-text-secondary mb-4 uppercase tracking-wide font-semibold">
            Try searching for:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2 bg-pulse-gray rounded-lg text-pulse-text hover:bg-pulse-accent/20 hover:text-pulse-accent border border-pulse-accent/20 hover:border-pulse-accent/60 transition text-sm font-semibold"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="w-full px-6 py-3 bg-pulse-accent hover:shadow-glow-intense text-pulse-bg font-bold rounded-lg transition-all duration-300"
        >
          Clear Search
        </button>

        {/* Helpful Text */}
        <p className="text-xs text-pulse-text-secondary mt-6">
          💡 Tip: Search for product type, brand, or specifications
        </p>
      </div>
    </div>
  );
};

export default EmptySearchState;
