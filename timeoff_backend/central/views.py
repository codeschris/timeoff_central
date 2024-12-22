from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.http import require_POST
import json
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, TakeLeaveSerializer
from .models import LeaveDays, User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
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

# Register view
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Login view
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful!'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    
# Logout view
class LogoutView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

        logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})

# Take leave view    
class TakeLeaveView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        employee_id = request.data.get('employee_id')
        if not employee_id:
            return Response({'detail': 'Employee ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TakeLeaveSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            leave_days = serializer.save(user=user)
            specific_days = request.data.get('specific_days', [])
            
            # Calculate the number of days between the specific dates
            date_format = "%Y/%m/%d"
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
    
# Leave approval view
class LeaveApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, leave_id):
        if not request.user.is_management:
            return Response({'detail': 'You do not have permission to approve leaves.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            leave_request = LeaveDays.objects.get(id=leave_id)
        except LeaveDays.DoesNotExist:
            return Response({'detail': 'Leave request not found.'}, status=status.HTTP_404_NOT_FOUND)

        leave_request.status = 'Approved'
        leave_request.approved_by = request.user
        leave_request.save()

        return Response({'detail': 'Leave request approved successfully.'}, status=status.HTTP_200_OK)

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
