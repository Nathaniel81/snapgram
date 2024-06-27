from rest_framework import serializers
from .models import Post, Comment, CommentLike
from cloudinary.utils import cloudinary_url
from accounts.serializers import UserSerializer, UserBasicSerializer


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = '__all__'



class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for comment objects.

    This serializer serializes comment objects, converting them into JSON format.
    """

    author = UserBasicSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_likes_count(self, obj):
        return CommentLike.objects.filter(comment=obj).count()

    def get_user_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return CommentLike.objects.filter(comment=obj, user=user).exists()
        return False

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.

    This serializer handles serialization and deserialization of Post instances.
    """

    creator = UserBasicSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 
            'creator', 
            'caption', 
            'file', 
            'location', 
            'tags', 
            'createdAt', 
            'updatedAt', 
            'likes', 
            'saved_by',
            'comments',
        ]

    def to_representation(self, instance):
        """
        Convert the Post instance to a representation.

        This method overrides the default to_representation method to include the file URL.
        """

        representation = super().to_representation(instance)
        if instance.file:
            # Add the file URL to the representation
            representation['file'] = cloudinary_url(instance.file.public_id)[0]
        return representation
