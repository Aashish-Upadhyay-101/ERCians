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
    followers = models.ManyToManyField(User, blank=True, related_name='+') 
    followings = models.ManyToManyField(User, blank=True, related_name='+')
    bio = models.TextField(max_length=256, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(max_length=100, blank=True, null=True)

    def get_followers(self):
        followers = self.followers.all()
        followers_list = []
        for follower in followers:
            followers_dict = {}
            followers_dict['name'] = follower.username
            followers_dict['profile_picture'] = follower.profile.profile_picture.url
            followers_list.append(followers_dict)
            del followers_dict
        return followers_list

    def get_followings(self):
        followings = self.followings.all()
        followings_list = []
        for following in followings:
            followings_dict = {}
            followings_dict['name'] = following.username
            followings_dict['profile_picture'] = following.profile.profile_picture.url 
            followings_list.append(followings_dict)
            del followings_dict
        return followings_list

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
    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    
    def get_user(self):
        curr_user = vars(self.auther)
        return {
            "id": curr_user.get("id"),
            "username": curr_user.get("username")
        }
    
    def get_liked_user(self):
        likes = self.likes.all()
        likes_list = []
        for like in likes:
            likes_dict = {}
            likes_dict['name'] = like.username
            likes_dict['profile_picture'] = like.profile.profile_picture.url 
            likes_list.append(likes_dict)
            del likes_dict
        return likes_list
    
    def get_datetime(self):
        return self.created_on

    def count_likes(self):
        return len(self.likes.all())

    @property
    def image_url(self):
        if self.image:
            return self.image.url 
        else:
            return ''


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    comment = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(User, related_name='+', blank=True, null=True)
    sub_comment = models.ForeignKey('self', related_name='+', on_delete=models.CASCADE, blank=True, null=True)

    @property
    def is_sub_comment(self):
        return self.sub_comment is not None 
    
    @property
    def all_sub_comments(self):
        return Comment.objects.filter(sub_comment=self).order_by('-created_on').all()

    def get_likes(self):
        likes = self.likes.all()
        likes_list = []
        for like in likes:
            likes_dict = {}
            likes_dict['name'] = like.username
            likes_dict['profile_picture'] = like.profile.profile_picture.url 
            likes_list.append(likes_dict)
            del likes_dict
        return likes_list