from django.urls import path
from django.http import HttpResponse

def hello_chris(request):
    return HttpResponse("Hello Chris")

urlpatterns = [
    path('hello-chris/', hello_chris),
]