from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import grpc
import weather_pb2
import weather_pb2_grpc

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# gRPC client to communicate with the gRPC server
def get_weather_from_grpc_server(location: str):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = weather_pb2_grpc.WeatherServiceStub(channel)
        request = weather_pb2.WeatherRequest(location=location)
        response = stub.GetCurrentWeather(request)
        return {
            "temperature": response.temperature,
            "humidity": response.humidity,
            "condition": response.condition,
        }

# REST API endpoint
@app.get("/weather/{location}")
def get_weather(location: str):
    try:
        weather_data = get_weather_from_grpc_server(location)
        return weather_data
    except grpc.RpcError as e:
        raise HTTPException(status_code=404, detail="Location not found or gRPC server error")

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)