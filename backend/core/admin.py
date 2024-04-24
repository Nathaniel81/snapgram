from django.contrib import admin
from .models import Post, Message, ChatRoom

admin.site.register(Post)
admin.site.register(Message)
admin.site.register(ChatRoom)
