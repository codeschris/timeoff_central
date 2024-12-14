from django.apps import AppConfig

class CentralConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'central'

    def ready(self):
        import central.signals