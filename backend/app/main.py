from fastapi import FastAPI

app = FastAPI(
    title="Selkie Backend API",
    description="API services for the Selkie project (Kappa, Djinn, Ghost, Tesseract)",
    version="0.1.0",
)

@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}

# Add routers for different modules (Auth, Kappa, etc.) later
# from .api.v1 import api_router
# app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    # This block is for running locally without uvicorn command, useful for debugging
    # Not typically used when running with Docker/uvicorn command
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)