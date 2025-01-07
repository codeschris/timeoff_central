from django.contrib.auth import authenticate, logout
from django.http import JsonResponse, HttpResponse
from django.views import View

# Handling CSRF tokens
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# ------------------------------

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import User, LeaveDays
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from datetime import datetime
from rest_framework.views import APIView
from dateutil.parser import parse as parse_date

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

# Register view
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Login view (fetches user_type effecttively)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_data = {
                'name': user.name,
                'email': user.email,
                'user_type': user.user_type,
                'role': user.role if user.user_type == 'Management' else None,
            }
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    
# User profile view
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "name": user.name,
            "email": user.email,
            'user_type': user.user_type,
        }
        return Response(user_data, status=status.HTTP_200_OK)

# Logout view
class LogoutView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

        logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})

# Take leave view
class LeaveRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')
        purpose = request.data.get('purpose', 'Annual')

        if not start_date_str or not end_date_str:
            return Response({'error': 'Start date and end date are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = parse_date(start_date_str).date()
            end_date = parse_date(end_date_str).date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use dd/mm/yyyy.'}, status=status.HTTP_400_BAD_REQUEST)

        if start_date > end_date:
            return Response({'error': 'End date must be after start date.'}, status=status.HTTP_400_BAD_REQUEST)

        days_requested = (end_date - start_date).days + 1

        # Fetch or create LeaveDays for the user
        leave_days, _ = LeaveDays.objects.get_or_create(user=user)

        # Check if the user has enough remaining days
        if leave_days.remaining_days < days_requested:
            return Response({
                'error': 'Insufficient leave days.',
                'remaining_days': leave_days.remaining_days
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update the LeaveDays record
        leave_days.days_taken += days_requested
        leave_days.save()

        return Response({
            'message': 'Leave request successful.',
            'days_requested': days_requested,
            'remaining_days': leave_days.remaining_days,
            'purpose': purpose,
            'start_date': start_date.strftime('%d/%m/%Y'),
            'end_date': end_date.strftime('%d/%m/%Y')
        }, status=status.HTTP_200_OK)

# Search User view
class SearchUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if query:
            users = User.objects.filter(
                Q(name__icontains=query) |
                Q(email__icontains=query) |
                Q(employee_id__icontains=query)
            )
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No query parameter provided'}, status=status.HTTP_400_BAD_REQUEST)

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
    
# Testing view
def hello_chris(request):
    return HttpResponse("Hello Chris")
