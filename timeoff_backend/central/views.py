from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, TakeLeaveSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

"""
Views
** User registration and authentication **

- RegisterView: This view is used to register a new user. It accepts a POST request with the user details and saves the user to the database.
- LoginView: This view is used to authenticate a user. It accepts a POST request with the user's email and password, and returns a token if the user is authenticated.

** Leave management **
- TakeLeaveView: This view is used to record a leave request. It accepts a POST request with the start and end date of the leave, 
validates the request, and updates the user's leave days accordingly.

** Testing **

- hello_chris: A simple view that returns a "Hello Chris" message when accessed. Used for testing purposes.

"""
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
class TakeLeaveView(APIView):
    def post(self, request):
        serializer = TakeLeaveSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            leave_days = serializer.save()
            return Response({
                "message": "Leave recorded successfully!",
                "remaining_days": leave_days.remaining_days
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Testing view
def hello_chris(request):
    return HttpResponse("Hello Chris")
