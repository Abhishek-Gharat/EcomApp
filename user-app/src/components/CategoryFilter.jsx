const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onSelectCategory('')}
        className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition duration-300 ${
          selectedCategory === ''
            ? 'bg-pulse-accent text-pulse-bg shadow-glow'
            : 'bg-pulse-gray text-pulse-text border border-pulse-accent/30 hover:border-pulse-accent/60 hover:shadow-glow'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.name)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition duration-300 ${
            selectedCategory === category.name
              ? 'bg-pulse-accent text-pulse-bg shadow-glow'
              : 'bg-pulse-gray text-pulse-text border border-pulse-accent/30 hover:border-pulse-accent/60 hover:shadow-glow'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
