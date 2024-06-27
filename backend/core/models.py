from django.db import models
from cloudinary.models import CloudinaryField
from accounts.models import User


class Post(models.Model):
    creator = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    caption = models.TextField(blank=True, null=True)
    file = CloudinaryField('image', null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    saved_by = models.ManyToManyField(User, related_name='saved_posts', blank=True)

    def __str__(self):
        return str(self.id)

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    parent_comment_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author}'s comment on \"{self.post}\""

class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'comment')
