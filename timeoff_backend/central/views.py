from django.contrib.auth import authenticate, logout
from django.http import JsonResponse, HttpResponse

# ------------------------------
# Handling CSRF tokens
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# ------------------------------

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import User, LeaveDays, LeaveRequest, TimeLog
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from datetime import datetime
from rest_framework.views import APIView
from dateutil.parser import parse as parse_date
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime

"""
Views
** User, User registration and authentication **

- RegisterView: This view is used to register a new user. It accepts a POST request with the user details and saves the user to the database.
- LoginView: This view is used to authenticate a user. It accepts a POST request with the user's email and password, and returns a token if the user is authenticated.
- UserProfileView: This view is used to fetch the user's profile details. It requires authentication and returns the user's name, email, and user type.
- LogoutView: This view is used to log out a user.
- SearchUserView: This view is used to search for users by name, email, or employee ID.
- ListEmployees: This view is used to list all employees or fetch details of a specific employee.
- RecentActivitiesView: This view is used to fetch recent leave requests.
- PendingLeaveRequestsView: This view is used to fetch pending leave requests for a specific employee.
- ApproveOrDenyLeaveRequestView: This view is used to approve or deny a leave request.
- EmployeeLeaveLogsView: This view is used to fetch the leave history of a specific employee.
- ClockInOutView: This view is used to clock in or out an employee.

** Leave management **
- LeaveRequestView: This view is used to request leave days. It accepts a POST request with the start date, end date, and purpose of the leave. It also provides a GET method to view leave history.

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
    
# Login view
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
                'employee_id': user.employee_id,
                'role': user.role if user.user_type == 'Management' else None,  # Remove this line if not needed
            }
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    
# User profile view (Life-save on auth (logging-in))
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "name": user.name,
            "email": user.email,
            "user_type": user.user_type,
            "employee_id": user.employee_id,
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

    def get(self, request, employee_id):
        # Fetch the approved leave requests for the employee
        leave_requests = LeaveRequest.objects.filter(user__employee_id=employee_id, approval_status='Approved')
        data = [
            {
                "start_date": leave.start_date.strftime("%Y-%m-%d"),
                "end_date": leave.end_date.strftime("%Y-%m-%d"),
                "days_requested": leave.days_requested,
                "purpose": leave.purpose,
            }
            for leave in leave_requests
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user

        start_date_str = request.data.get("start_date")
        end_date_str = request.data.get("end_date")
        purpose = request.data.get("purpose", "Annual")

        if not start_date_str or not end_date_str:
            return Response({"error": "Start date and end date are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = parse_date(start_date_str).date()
            end_date = parse_date(end_date_str).date()
        except ValueError:
            return Response({"error": "Invalid date format. Use yyyy-mm-dd."}, status=status.HTTP_400_BAD_REQUEST)

        if start_date > end_date:
            return Response({"error": "End date must be after start date."}, status=status.HTTP_400_BAD_REQUEST)

        days_requested = (end_date - start_date).days + 1

        # Check if the user has enough remaining days (but do not deduct yet)
        leave_days, _ = LeaveDays.objects.get_or_create(user=user)
        if leave_days.remaining_days < days_requested:
            return Response(
                {
                    "error": "Insufficient leave days.",
                    "remaining_days": leave_days.remaining_days,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Log the leave request with "Pending" status
        leave_request = LeaveRequest.objects.create(
            user=user,
            start_date=start_date,
            end_date=end_date,
            purpose=purpose,
            days_requested=days_requested,
            approval_status="Pending",
        )

        return Response(
            {
                "message": "Leave request submitted for approval.",
                "days_requested": days_requested,
                "remaining_days": leave_days.remaining_days,
                "purpose": purpose,
                "start_date": start_date.strftime("%d/%m/%Y"),
                "end_date": end_date.strftime("%d/%m/%Y"),
                "status": leave_request.approval_status,
            },
            status=status.HTTP_200_OK,
        )

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
    
# Recent activities view
class RecentActivitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch recent leave requests
        leave_requests = LeaveRequest.objects.all().order_by('-created_at')[:10]
        
        activities = []
        for leave_request in leave_requests:
            activities.append({
                "user": leave_request.user.name,
                "days_requested": leave_request.days_requested,
                "purpose": leave_request.purpose,
                "start_date": leave_request.start_date.strftime("%d/%m/%Y"),
                "end_date": leave_request.end_date.strftime("%d/%m/%Y"),
                "created_at": localtime(leave_request.created_at).strftime("%d/%m/%Y %H:%M"),  # Localized created_at
            })
        
        return Response(activities, status=status.HTTP_200_OK)

# User details view    
class ListEmployees(APIView):
    permission_classes = [AllowAny]

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
        
class EmployeeLeaveLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            # Filter LeaveRequest by user__employee_id
            leave_requests = LeaveRequest.objects.filter(user__employee_id=employee_id, approval_status='Approved') # Print approved leave requests only
            if not leave_requests.exists():
                return Response(
                    {"error": "No leave logs found for this employee."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Serialize leave request data
            data = [
                {
                    "start_date": leave.start_date.strftime("%Y-%m-%d"),
                    "end_date": leave.end_date.strftime("%Y-%m-%d"),
                    "days_requested": leave.days_requested,
                    "purpose": leave.purpose,
                }
                for leave in leave_requests
            ]
            return Response(data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND
            )

# Pending leave requests view
class PendingLeaveRequestsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, employee_id):
        try:
            # Fetch the user (employee) by employee_id passed in the URL
            employee = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch pending leave requests for the specified employee
        pending_leaves = LeaveRequest.objects.filter(user=employee, approval_status='Pending')
        data = []

        for leave in pending_leaves:
            data.append({
                'id': int(leave.id),
                'user': leave.user.name,
                'start_date': leave.start_date,
                'end_date': leave.end_date,
                'days_requested': leave.days_requested,
                'purpose': leave.purpose,
                'status': leave.approval_status,
            })

        return Response(data, status=status.HTTP_200_OK)
  
# Approve or deny leave request view
class ApproveOrDenyLeaveRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        leave_request = get_object_or_404(LeaveRequest, id=id)
        action = request.data.get('action') 
        user = request.user

        if user.user_type != 'Management':
            return Response({'error': 'Only management can approve or deny leave requests'}, status=status.HTTP_403_FORBIDDEN)

        if action not in ['approve', 'deny']:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'approve':
            # Check if the employee has enough remaining leave days
            leave_days = LeaveDays.objects.get(user=leave_request.user)
            if leave_days.remaining_days >= leave_request.days_requested:
                # Deduct leave days and approve request
                leave_days.days_taken += leave_request.days_requested
                # leave_days.remaining_days -= leave_request.days_requested
                leave_days.save()
                leave_request.approval_status = 'Approved'
                leave_request.approved_by = user
                leave_request.save()

                return Response({'message': 'Leave request approved and days deducted.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Insufficient leave days'}, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'deny':
            # Simply deny the leave request
            leave_request.approval_status = 'Denied'
            leave_request.approved_by = user
            leave_request.save()
            return Response({'message': 'Leave request denied.'}, status=status.HTTP_200_OK)

class ClockInOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, employee_id):
        # Get employee from employee_id
        try:
            user = User.objects.get(employee_id=employee_id)
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the last time log for the employee for today
        today = datetime.now().date()
        last_time_log = TimeLog.objects.filter(user=user, date=today).last()

        if last_time_log and last_time_log.clock_in and not last_time_log.clock_out:
            # Clock out if the employee is already clocked in
            last_time_log.clock_out = datetime.now()
            last_time_log.save()
            return Response({"message": f"Clocked out at {last_time_log.clock_out}"}, status=status.HTTP_200_OK)
        else:
            # Clock in if the employee has not clocked in today
            TimeLog.objects.create(user=user, clock_in=datetime.now(), date=today)
            return Response({"message": "Clocked in successfully"}, status=status.HTTP_200_OK)
        
# Clock in/out records view
class ClockInOutRecordsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, employee_id):
        # Try to get the user, return 404 if not found
        user = get_object_or_404(User, employee_id=employee_id)
        
        # Fetch logs ordered by date
        logs = TimeLog.objects.filter(user=user).order_by('-date')
        
        # If no logs exist, return an empty list instead of a 404
        if not logs.exists():
            return Response([], status=status.HTTP_200_OK)

        # Format response
        data = [
            {
                "date": log.date.strftime('%Y-%m-%d'),
                "clock_in": localtime(log.clock_in).strftime('%H:%M:%S') if log.clock_in else None,
                "clock_out": localtime(log.clock_out).strftime('%H:%M:%S') if log.clock_out else None,
            }
            for log in logs
        ]

        return Response(data, status=status.HTTP_200_OK)

# Testing view
def hello_chris(request):
    return HttpResponse("Hello Chris")
