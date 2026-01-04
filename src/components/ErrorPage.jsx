export default function ErrorPage({ title, message, onConfirm }) {
  return (
    <section className="error center">
      <h2>{title}</h2>
      <p>{message}</p>
      {onConfirm && (
        <div id="confirmation-actions">
          <button onClick={onConfirm} className="button">
            Okay
          </button>
        </div>
      )}
    </section>
  );
}
