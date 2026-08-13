from fastapi import APIRouter


from services.system_metrics import (
    get_cpu_percent,
    get_disk_metrics,
    get_host_info,
    get_memory_metrics,
    get_processes,
    get_system_metrics,
    get_uptime,
    get_alerts
)

router = APIRouter(
    prefix="/system",
    tags=["System"],
)


@router.get("")
def system():
    return get_system_metrics()


@router.get("/cpu")
def cpu():
    return {
        "cpu_percent": get_cpu_percent()
    }


@router.get("/memory")
def memory():
    return get_memory_metrics()


@router.get("/disk")
def disk():
    return get_disk_metrics()


@router.get("/host")
def host():
    return get_host_info()


@router.get("/uptime")
def uptime():
    return get_uptime()

@router.get("/processes")
def processes():
    return get_processes()

@router.get("/alerts")
def alerts():
    return get_alerts()