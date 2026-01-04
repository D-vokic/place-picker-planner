export default function SearchInput({ value, onChange }) {
  return (
    <div className="center">
      <input
        type="text"
        placeholder="Search places..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
