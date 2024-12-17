from django.contrib import admin
from .models import User, LeaveDays

class LeaveDaysRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'days_taken')
    search_fields = ('user',)
    list_filter = ('user',)

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_type', 'role')
    search_fields = ('name', 'role')
    list_filter = ('role',)

admin.site.register(LeaveDays, LeaveDaysRequestAdmin)
admin.site.register(User, EmployeeAdmin)