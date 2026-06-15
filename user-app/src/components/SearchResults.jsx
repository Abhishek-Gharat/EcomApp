import { forwardRef } from 'react';
import ProductCard from './ProductCard';
import SearchResultsHeader from './SearchResultsHeader';
import EmptySearchState from './EmptySearchState';

const SearchResults = forwardRef(
  ({ searchQuery, filteredProducts, onClear, onQuickView, onSuggestionClick }, ref) => {
    const hasResults = filteredProducts.length > 0;

    return (
      <div ref={ref} className="bg-pulse-bg min-h-screen">
        {/* Results Header */}
        {hasResults && (
          <SearchResultsHeader
            searchQuery={searchQuery}
            resultCount={filteredProducts.length}
            onClear={onClear}
          />
        )}

        {/* Results or Empty State */}
        {hasResults ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

            {/* Results Footer */}
            <div className="mt-16 text-center py-8 border-t border-pulse-accent/20">
              <p className="text-pulse-text-secondary">
                Showing {filteredProducts.length} of {filteredProducts.length} products
              </p>
            </div>
          </div>
        ) : (
          <EmptySearchState
            searchQuery={searchQuery}
            onClear={onClear}
            onSuggestionClick={onSuggestionClick}
          />
        )}
      </div>
    );
  }
);

SearchResults.displayName = 'SearchResults';

export default SearchResults;
