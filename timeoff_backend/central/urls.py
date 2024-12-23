from django.urls import path
from .views import RegisterView, LoginView, TakeLeaveView, hello_chris, UserDetailsView, LogoutView, SearchUserView

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Endpoints for user and leave management
    path('take-leave/', TakeLeaveView.as_view(), name='take_leave'),
    path('employees/', UserDetailsView.as_view(), name='list_employees'),
    path('employee/<str:employee_id>/', UserDetailsView.as_view(), name='user_details'),
    path('search-user/', SearchUserView.as_view(), name='search_user'),

    # Testing
    path('hello_chris/', hello_chris, name='hello_chris'),
]