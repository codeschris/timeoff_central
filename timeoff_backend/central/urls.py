from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ( RegisterView, LoginView, LeaveRequestView, 
                    hello_chris, ListEmployees, LogoutView, SearchUserView, 
                    UserProfileView, RecentActivitiesView, EmployeeLeaveLogsView, 
                    PendingLeaveRequestsView, ApproveOrDenyLeaveRequestView
                    )
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # API docs
    path('schema/', SpectacularAPIView.as_view(), name='schema'),

    # Swagger UI
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # ReDoc UI
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # JWT token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'), # The real life-saver of the authentication using 'user_type'

    # Requesting leave days and Fetching Leave History
    path('leave/request/', LeaveRequestView.as_view(), name='leave-request'),
    path('leave/request/<str:employee_id>/', LeaveRequestView.as_view(), name='leave-history'),
    path('leaves/<str:employee_id>/', EmployeeLeaveLogsView.as_view(), name='employee-leave-logs'),
    path('leaves/pending/<str:employee_id>/', PendingLeaveRequestsView.as_view(), name='pending-requests'),
    path('leaves/<int:id>/approve-deny/', ApproveOrDenyLeaveRequestView.as_view(), name='approve-deny-leave-request'),

    # Endpoints for user and leave management
    path('employees/', ListEmployees.as_view(), name='list_employees'),
    path('employee/<str:employee_id>/', ListEmployees.as_view(), name='user_details'),
    path('search-user/', SearchUserView.as_view(), name='search_user'),

    # Recent Activity
    path('recent-activities/', RecentActivitiesView.as_view(), name='recent_activities'),

    # Testing
    path('hello_chris/', hello_chris, name='hello_chris'),
]