from django.contrib.auth.base_user import BaseUserManager

# create your own custom user manager as well as user model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('User from have a valid email')

        email = self.normalize_email(email)



    def create_superuser(self, email, password, **extra_fields):
        pass 