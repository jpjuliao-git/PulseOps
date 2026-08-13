import platform
import socket
from datetime import datetime

import psutil

BYTES_PER_GB = 1024 ** 3
previous_network = psutil.net_io_counters()
previous_network_time = datetime.now()

def get_cpu_percent() -> float:
    return psutil.cpu_percent(interval=1)


def get_memory_metrics() -> dict:
    usage = psutil.virtual_memory()

    return {
        "memory_percent": usage.percent,
        "memory_used_gb": round(usage.used / BYTES_PER_GB, 2),
        "memory_total_gb": round(usage.total / BYTES_PER_GB, 2),
    }


def get_disk_metrics() -> dict:
    usage = psutil.disk_usage("C:\\")

    return {
        "disk_percent": usage.percent,
        "disk_used_gb": round(usage.used / BYTES_PER_GB, 2),
        "disk_total_gb": round(usage.total / BYTES_PER_GB, 2),
    }


def get_host_info() -> dict:
    return {
        "hostname": socket.gethostname(),
        "operating_system": platform.system(),
        "os_version": platform.version(),
        "processor": platform.processor(),
    }


def get_uptime() -> dict:
    boot_time = datetime.fromtimestamp(psutil.boot_time())
    current_time = datetime.now()
    uptime = current_time - boot_time

    total_seconds = int(uptime.total_seconds())

    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60

    return {
        "boot_time": boot_time.isoformat(),
        "uptime_days": days,
        "uptime_hours": hours,
        "uptime_minutes": minutes,
    }


def get_system_metrics() -> dict:
    return {
        **get_host_info(),
        **get_uptime(),
        "cpu_percent": get_cpu_percent(),
        **get_memory_metrics(),
        **get_disk_metrics(),
        **get_network_metrics(),
    }


def get_processes() -> list:
    processes = []

    for process in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent"]
    ):
        try:
            info = process.info

            processes.append({
                "pid": info["pid"],
                "name": info["name"],
                "cpu_percent": info["cpu_percent"],
                "memory_percent": round(info["memory_percent"], 2),
            })

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    processes.sort(
        key=lambda process: process["memory_percent"],
        reverse=True,
    )

    return processes[:15]

def get_alerts() -> list:
    alerts = []

    cpu = get_cpu_percent()
    memory = get_memory_metrics()
    disk = get_disk_metrics()

    metrics = [
        ("CPU", "cpu", cpu),
        ("Memory", "memory", memory["memory_percent"]),
        ("Disk", "disk", disk["disk_percent"]),
    ]

    for name, metric_type, value in metrics:

        if value >= 80:
            alerts.append({
                "type": metric_type,
                "level": "high",
                "message": f"{name} usage is high at {value}%"
            })

        elif value >= 60:
            alerts.append({
                "type": metric_type,
                "level": "warning",
                "message": f"{name} usage is elevated at {value}%"
            })

    return alerts


def get_network_metrics() -> dict:
    global previous_network
    global previous_network_time

    current_network = psutil.net_io_counters()
    current_time = datetime.now()

    elapsed_seconds = (
        current_time - previous_network_time
    ).total_seconds()

    if elapsed_seconds <= 0:
        elapsed_seconds = 1

    bytes_sent = (
        current_network.bytes_sent
        - previous_network.bytes_sent
    )

    bytes_received = (
        current_network.bytes_recv
        - previous_network.bytes_recv
    )

    upload_bytes_per_second = bytes_sent / elapsed_seconds
    download_bytes_per_second = bytes_received / elapsed_seconds

    previous_network = current_network
    previous_network_time = current_time

    return {
        "upload_mb_s": round(
            upload_bytes_per_second / (1024 ** 2),
            2
        ),
        "download_mb_s": round(
            download_bytes_per_second / (1024 ** 2),
            2
        ),
    }