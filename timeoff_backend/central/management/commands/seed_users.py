import uuid
from django.core.management.base import BaseCommand
from central.models import User
from faker import Faker

class Command(BaseCommand):
    help = 'Seed the database with initial users'

    def handle(self, *args, **options):  # Add **options to handle verbosity and other arguments
        fake = Faker()
        usernames = set()  # To track unique usernames
        users = []

        for i in range(1, 11):
            username = fake.user_name()
            # Ensure username is unique
            while username in usernames or User.objects.filter(username=username).exists():
                username = fake.user_name()
            usernames.add(username)

            users.append({
                'name': fake.name(),
                'email': fake.email(),
                'employee_id': f'EMP{str(i).zfill(3)}',
                'username': username,
                'password': 'password123',
                'user_type': fake.random.choice(['Employee', 'Management']),
                'role': fake.random.choice([
                    'HR', 'Human Resource Manager', 'General Manager', 'Assistant Quality Assurance Manager',
                    'Procurement Manager', 'Quality and Compliance Manager', 'Logistician', 'Accountant',
                    'Production Supervisor', 'Inventory Supervisor', 'Production Manager', 'Production Support',
                    'Janitor', 'Security Guard', 'Managing Director', 'Director'
                ])
            })

        for user_data in users:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'id': uuid.uuid4(),
                    'name': user_data['name'],
                    'employee_id': user_data['employee_id'],
                    'username': user_data['username'],
                    'password': user_data['password'],
                    'user_type': user_data['user_type'],
                    'role': user_data['role']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created user {user_data['name']}'))
            else:
                self.stdout.write(self.style.WARNING(f'User {user_data['name']} already exists'))
