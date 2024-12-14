from rest_framework import serializers
from .models import User, LeaveDays

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'employee_id', 'password', 'user_type', 'role']

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            employee_id=validated_data['employee_id'],
            user_type=validated_data['user_type'],
            role=validated_data.get('role')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class TakeLeaveSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def validate(self, data):
        user = self.context['request'].user
        leave_days = LeaveDays.objects.get(user=user)
        total_requested_days = (data['end_date'] - data['start_date']).days + 1  # Include the start day
        if total_requested_days <= 0:
            raise serializers.ValidationError("End date must be after start date.")
        if total_requested_days > leave_days.remaining_days:
            raise serializers.ValidationError("You do not have enough leave days remaining.")
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        leave_days = LeaveDays.objects.get(user=user)
        total_requested_days = (self.validated_data['end_date'] - self.validated_data['start_date']).days + 1
        leave_days.days_taken += total_requested_days
        leave_days.save()
        return leave_days