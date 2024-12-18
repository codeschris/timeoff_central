from django.urls import path
from .views import RegisterView, LoginView, TakeLeaveView , hello_chris, UserDetailsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('take-leave/', TakeLeaveView.as_view(), name='take_leave'),
    path('hello_chris/', hello_chris, name='hello_chris'),
    path('employees/', UserDetailsView.as_view(), name='list_employees'),
    path('employees/<uuid:id>/', UserDetailsView.as_view(), name='user_details'),
]