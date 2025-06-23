from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True)
    c_name = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    gst = models.CharField(max_length=15) 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.c_name if self.c_name else self.username
    




# class User(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(max_length=254, unique=True)
#     username = models.CharField(max_length=50)
#     contact_number = models.CharField(max_length=10)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['username']

#     def __str__(self):
#         return self.username



# class User(AbstractUser):
#     email = models.EmailField(unique=True)
#     c_name = models.CharField(max_length=100)
#     contact = models.CharField(max_length=15)
#     address = models.TextField()
#     gst = models.CharField(max_length=15) 

    
#     def __str__(self):
#         return self.c_name if self.c_name else self.username