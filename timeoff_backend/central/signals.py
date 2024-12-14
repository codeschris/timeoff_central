from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, LeaveDays

# Ensure that a LeaveDays instance is automatically created for each user.
@receiver(post_save, sender=User)
def create_leave_days(sender, instance, created, **kwargs):
    if created:
        LeaveDays.objects.create(user=instance)