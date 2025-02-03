from rest_framework import serializers
from .models import User, LeaveDays, TimeLog
from django.contrib.auth.hashers import make_password
from django.utils.timezone import localtime

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    total_days = serializers.ReadOnlyField()
    days_taken = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'employee_id', 'password', 'user_type', 'role', 'total_days', 'days_taken']
        extra_kwargs = {
            'password': {'write_only': True}  # password is write-only
        }

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            employee_id=validated_data['employee_id'],
            user_type=validated_data['user_type'],
            role=validated_data.get('role'),
        )
        user.password = make_password(validated_data['password'])  # Hash the password
        user.save()
        return user
