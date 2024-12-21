from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
import json
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, TakeLeaveSerializer
from .models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.middleware.csrf import get_token
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

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

# CSRF token view
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFTokenView(View):
    def get(self, request):
        response = JsonResponse({'detail': 'CSRF cookie set'})
        response['X-CSRFToken'] = get_token(request)
        return response

# Register view
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Login view
class LoginView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_POST)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON data.'}, status=400)

        email = data.get('email')
        password = data.get('password')

        if email is None or password is None:
            return JsonResponse({'detail': 'Please provide email and password.'}, status=400)

        # Authenticate using email
        user = authenticate(request, email=email, password=password)

        if user is None:
            return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

        login(request, user)
        return JsonResponse({'detail': 'Successfully logged in.'})
    
# Logout view
class LogoutView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

        logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})

# Take leave view    
class TakeLeaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TakeLeaveSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            leave_days = serializer.save(user=request.user)
            specific_days = request.data.get('specific_days', [])
            
            # Calculate the number of days between the specific dates
            date_format = "%d/%m/%Y"
            specific_dates = [datetime.strptime(date, date_format) for date in specific_days]
            specific_dates.sort()
            num_days = (specific_dates[-1] - specific_dates[0]).days + 1 if specific_dates else 0
            
            return Response({
            "message": "Leave recorded successfully!",
            "remaining_days": leave_days.remaining_days,
            "specific_days": specific_days,
            "num_days": num_days
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User details view    
class UserDetailsView(APIView):
    permission_classes = [AllowAny]  # Switch to IsAuthenticated if needed

    def get(self, request, employee_id=None):
        if employee_id:
            try:
                employee = User.objects.get(employee_id=employee_id)
                serializer = UserSerializer(employee)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            employees = User.objects.all()
            serializer = UserSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
# Session view
class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'username': request.user.username})
    
# Testing view
def hello_chris(request):
    return HttpResponse("Hello Chris")
