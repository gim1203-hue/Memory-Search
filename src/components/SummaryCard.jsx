function SummaryCard({ icon, label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>

      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default SummaryCard;