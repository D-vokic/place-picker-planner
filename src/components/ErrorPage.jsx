export default function ErrorPage({ title, message, onConfirm }) {
  return (
    <section className="error center">
      <h2>{title || "An error occurred"}</h2>
      <p>{message || "Something went wrong. Please try again later."}</p>
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
