import { useEffect, useState } from "react"
import "./App.css"
import MetricCard from "./components/MetricCard"

import {
  getSystemData,
  getProcesses,
  getAlerts,
} from "./services/api"


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function createChartData(history) {
  return history.map((value, index) => ({
    time: index,
    value,
  }))
}



function App() {
  const [systemData, setSystemData] = useState(null)

  const [cpuHistory, setCpuHistory] = useState([])
  const [memoryHistory, setMemoryHistory] = useState([])
  const [diskHistory, setDiskHistory] = useState([])

  const [processes, setProcesses] = useState([])
  const [alerts, setAlerts] = useState([])

  const [uploadHistory, setUploadHistory] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])

  const [isConnected, setIsConnected] = useState(false)
  
  const fetchSystemData = async () => {
  try {
    const data = await getSystemData()

    setSystemData(data)
    setIsConnected(true)

    setCpuHistory((previousHistory) =>
      [...previousHistory, data.cpu_percent].slice(-20)
    )

    setMemoryHistory((previousHistory) =>
      [...previousHistory, data.memory_percent].slice(-20)
    )

    setDiskHistory((previousHistory) =>
      [...previousHistory, data.disk_percent].slice(-20)
    )

    setUploadHistory((previousHistory) =>
      [...previousHistory, data.upload_mb_s].slice(-20)
    )

    setDownloadHistory((previousHistory) =>
      [...previousHistory, data.download_mb_s].slice(-20)
    )
  } catch (error) {
    console.error("Could not connect to PulseOps backend:", error)
    setIsConnected(false)

    return
  }

  try {
    const processData = await getProcesses()

    if (Array.isArray(processData)) {
      setProcesses(processData)
    }
  } catch (error) {
    console.error("Could not fetch processes:", error)
  }

  try {
    const alertData = await getAlerts()

    if (Array.isArray(alertData)) {
      setAlerts(alertData)
    }
  } catch (error) {
    console.error("Could not fetch alerts:", error)
  }
}
useEffect(() => {
  fetchSystemData()

  const interval = setInterval(fetchSystemData, 3000)

  return () => clearInterval(interval)
}, [])

  const cpuChartData = createChartData(cpuHistory)
  const memoryChartData = createChartData(memoryHistory)
  const diskChartData = createChartData(diskHistory)
  const uploadChartData = createChartData(uploadHistory)
  const downloadChartData = createChartData(downloadHistory)


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>PulseOps</h1>
        <p>System Monitoring Dashboard</p>
          <p className={isConnected ? "status-online" : "status-offline"}>
           {isConnected ? "● Backend Online" : "● Backend Offline"}
          </p>
      </header>

      <section className="info-grid">
        <MetricCard
           title="CPU Usage"
           percent={systemData?.cpu_percent}
        />

        <MetricCard
           title="Memory Usage"
           percent={systemData?.memory_percent}
          detail={`${systemData?.memory_used_gb} GB / ${systemData?.memory_total_gb} GB`}
        />
       <MetricCard
          title="Disk Usage"
          percent={systemData?.disk_percent}
          detail={`${systemData?.disk_used_gb} GB / ${systemData?.disk_total_gb} GB`}
        />

        <div className="card">
          <h3>System Info</h3>
          <p>Host: {systemData?.hostname}</p>
          <p>OS: {systemData?.operating_system}</p>
        </div>

        <div className="card">
          <h3>Uptime</h3>
          <p>
            {systemData?.uptime_days}d {systemData?.uptime_hours}h{" "}
            {systemData?.uptime_minutes}m
          </p>
        </div>
      
        <div className="card">
          <h3>Network</h3>

          <p>
            Upload: {systemData?.upload_mb_s} MB/s
          </p>

          <p>
            Download: {systemData?.download_mb_s} MB/s
          </p>
        </div>
        </section>
      <div className="alert-card">
        <h3>Active Alerts</h3>

        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-item ${alert.level}`}
            >
              {alert.message}
            </div>
          ))
        )}
      </div>

      <div className="chart-card">
        <h3>CPU Usage - Last 60 Seconds</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cpuChartData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Memory Usage - Last 60 Seconds</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memoryChartData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Disk Usage - Last 60 Seconds</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={diskChartData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="process-card">
        <h3>Top Processes by Memory Usage</h3>

        <table className="process-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Process</th>
              <th>CPU %</th>
              <th>Memory %</th>
            </tr>
          </thead>

          <tbody>
            {processes.map((process) => (
              <tr key={process.pid}>
                <td>{process.pid}</td>
                <td>{process.name}</td>
                <td>{process.cpu_percent}</td>
                <td>{process.memory_percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <div className="chart-card">
  <h3>Upload Speed - Last 60 Seconds</h3>

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={uploadChartData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="chart-card">
  <h3>Download Speed - Last 60 Seconds</h3>

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={downloadChartData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
      
    </div>
  )
}

export default App