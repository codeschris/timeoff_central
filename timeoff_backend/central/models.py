from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser

"""
Models

- User: This model represents a user in the system. It extends the AbstractUser class provided by Django to add custom 
fields such as user_type and role. The user_type field is used to distinguish between employees and management users, while 
the role field is used to assign specific roles to management users.

- LeaveDays: This model represents the leave days available to a user.

"""

# User models
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('Employee', 'Employee'),
        ('Management', 'Management'),
    )
    
    MANAGEMENT_ROLE_CHOICES = (
        ('HR', 'Human Resource Manager'),
        ('General Manager', 'General Manager'),
        ('Assistant Quality Assurance Manager', 'Assistant Quality Assurance Manager'),
        ('Procurement Manager', 'Procurement Manager'),
        ('Quality and Compliance Manager', 'Quality and Compliance Manager'),
        ('Logistician', 'Logistician'),
        ('Accountant', 'Accountant'),
        ('Production Supervisor', 'Production Supervisor'),
        ('Inventory Supervisor', 'Inventory Supervisor'),
        ('Production Supervisor', 'Production Supervisor'),
        ('Production Manager', 'Production Manager'),
        ('Production Support', 'Production Support'),
        ('Janitor', 'Janitor'),
        ('Security Guard', 'Security Guard'),
        ('Managing Director', 'Managing Director'),
        ('Director', 'Director'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    employee_id = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    role = models.CharField(max_length=50, choices=MANAGEMENT_ROLE_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.name
    
# Leave days model
class LeaveDays(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_days = models.IntegerField(default=21)
    days_taken = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.name} - {self.total_days} days"
    
    @property
    def remaining_days(self):
        return self.total_days - self.days_taken
