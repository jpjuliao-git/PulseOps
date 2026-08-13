
# PulseOps

PulseOps is a full-stack system monitoring dashboard built with FastAPI and React. It collects system metrics from a Python backend and displays them through a real-time web dashboard.

## Features

- Real-time CPU usage monitoring
- Memory utilization monitoring
- Disk usage monitoring
- Network upload and download monitoring
- System uptime and host information
- Top running processes by memory usage
- Threshold-based system alerts
- Historical metric charts
- Backend connection status detection
- Automatic dashboard updates every 3 seconds

## Tech Stack

### Backend
- Python
- FastAPI
- psutil
- Uvicorn

### Frontend
- React
- JavaScript
- Vite
- Recharts
- CSS

## Architecture

PulseOps uses a client-server architecture:

React Frontend  
↓  
REST API  
↓  
FastAPI Backend  
↓  
psutil  
↓  
Host System

The FastAPI backend collects operating system metrics using `psutil` and exposes them through REST API endpoints. The React frontend periodically requests these endpoints and updates the dashboard.

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/system` | Returns system and hardware metrics |
| `/system/processes` | Returns information about running processes |
| `/system/alerts` | Returns active system alerts |

## Running PulseOps

### Backend

Navigate to the backend directory:

```bash
cd backend