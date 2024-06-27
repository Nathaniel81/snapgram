from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    name = models.CharField(max_length=100, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    dob = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    profile_picture = CloudinaryField('image', null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)

    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)

    @property
    def friends(self):
        return User.objects.filter(following=self, followers__in=[self])

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
