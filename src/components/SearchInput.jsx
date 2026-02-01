export default function SearchInput({ value, onChange }) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search places..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
