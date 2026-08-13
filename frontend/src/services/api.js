const API_BASE = "http://127.0.0.1:8000"

export async function getSystemData() {
  const response = await fetch(`${API_BASE}/system`)
  return response.json()
}

export async function getProcesses() {
  const response = await fetch(`${API_BASE}/system/processes`)
  return response.json()
}

export async function getAlerts() {
  const response = await fetch(`${API_BASE}/system/alerts`)
  return response.json()
}