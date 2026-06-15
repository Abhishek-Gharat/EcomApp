import { X } from 'lucide-react';

const SearchResultsHeader = ({ searchQuery, resultCount, onClear }) => {
  return (
    <div className="bg-pulse-gray-light border-b border-pulse-accent/20 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-pulse-text">
              Search Results
            </h1>
            <p className="text-pulse-text-secondary mt-2">
              Results for "<span className="text-pulse-accent font-bold">{searchQuery}</span>"
            </p>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pulse-bg transition text-pulse-text-secondary hover:text-pulse-text"
            title="Clear search"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Clear</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-pulse-text-secondary">
          <span className="text-lg font-semibold">{resultCount}</span>
          <span>{resultCount === 1 ? 'product' : 'products'} found</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
