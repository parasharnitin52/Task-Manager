export function StatusBadge({ value }) {
  return <span className={`status status-${value?.toLowerCase()}`}>{value?.replace('_', ' ')}</span>;
}
