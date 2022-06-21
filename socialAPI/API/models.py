from email.policy import default
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import signals
from django.dispatch import receiver
from django.utils.text import slugify


# user model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='user')
    name = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', default='profile_picture/default_profile_picture.jpeg', blank=True, null=True)
    bio = models.TextField(max_length=256, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(UserProfile, self).save(*args, **kwargs)


@receiver(signals.post_save, sender=User)
def create_save_user_profile(sender, instance, created, **kwargs):
    print(sender)
    if created:
        UserProfile.objects.create(user=instance, name=instance.username)
    
    
class Post(models.Model):
    auther = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    image = models.ImageField(upload_to='post_pictures', blank=True, null=True)
    created_on = models.DateTimeField(default=timezone.now, blank=True, null=True)
    
    def get_user(self):
        curr_user = vars(self.auther)
        return {
            "id": curr_user.get("id"),
            "username": curr_user.get("username")
        }
    
    def get_datetime(self):
        return self.created_on

    @property
    def image_url(self):
        if self.image:
            return self.image.url 
        else:
            return ''

