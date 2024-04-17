from rest_framework import serializers
from .models import Post
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

    def create(self, validated_data):
        """
        Create a new Post instance.

        This method overrides the default create method to handle file upload.

        """
        file = validated_data.pop('file', None)
        post = super().create(validated_data)
        if file:
            post.file = file
            post.save()
        return post

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
