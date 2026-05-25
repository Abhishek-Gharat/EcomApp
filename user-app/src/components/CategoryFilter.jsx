const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onSelectCategory('')}
        className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
          selectedCategory === ''
            ? 'bg-boat-red text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.name)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
            selectedCategory === category.name
              ? 'bg-boat-red text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
