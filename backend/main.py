from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.system import router as system_router

app = FastAPI(
    title="PulseOps API",
    description="Backend API for monitoring system resources.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system_router)

@app.get("/")
def home():
    return {
        "project": "PulseOps",
        "status": "running",
    }


@app.get("/about")
def about():
    return {
        "project": "PulseOps",
        "description": "My first full-stack software engineering project.",
        "developer": "Jacob Juliao",
        "version": "0.1.0",
    }