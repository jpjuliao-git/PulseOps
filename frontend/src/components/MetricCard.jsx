function getUsageClass(percent) {
  if (percent >= 80) return "high"
  if (percent >= 60) return "warning"
  return "normal"
}

function MetricCard({ title, percent, detail }) {
  return (
    <div className="card">
      <h3>{title}</h3>

      <p className="metric">{percent}%</p>

      <div className="progress-bar">
        <div
          className={`progress-fill ${getUsageClass(percent || 0)}`}
          style={{ width: `${percent || 0}%` }}
        />
      </div>

      {detail && <p>{detail}</p>}
    </div>
  )
}

export default MetricCard