export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="center">
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
