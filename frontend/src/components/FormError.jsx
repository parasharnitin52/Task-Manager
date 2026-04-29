export function FormError({ error }) {
  if (!error) return null;
  return <div className="form-error">{error}</div>;
}
