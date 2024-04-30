from rest_framework import serializers
from .models import Post, Message
from cloudinary.utils import cloudinary_url
from accounts.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.

    This serializer handles serialization and deserialization of Post instances.
    """

    creator = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

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
