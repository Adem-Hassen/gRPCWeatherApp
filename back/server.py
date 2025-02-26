import requests
import weather_pb2
from concurrent import futures
import weather_pb2_grpc
import grpc 

class WeatherService(weather_pb2_grpc.WeatherServiceServicer):
    def GetCurrentWeather(self, request, context):
        location = request.location
        api_key = "20cc6d622b60d5a595fabf2076b1063f"
        url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
        response = requests.get(url).json()

        if response.get("cod") != 200:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Location not found")
            return weather_pb2.WeatherResponse()

        return weather_pb2.WeatherResponse(
            temperature=response["main"]["temp"],
            humidity=response["main"]["humidity"],
            condition=response["weather"][0]["description"]
        )
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    weather_pb2_grpc.add_WeatherServiceServicer_to_server(WeatherService(), server)
    server.add_insecure_port('[::]:50051')
    print("Weather server running on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()