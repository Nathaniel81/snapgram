from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .authenticate import CustomAuthentication
from .models import Post
from .serializers import PostSerializer


class PostCreateView(generics.CreateAPIView):
    """
    View for creating posts.

    This view allows authenticated users to create new posts.
    """

    authentication_classes = [CustomAuthentication]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        #set the creator of the post to the current authenticated user.
        serializer.save(creator=self.request.user)

class RecentPostsView(generics.ListAPIView):
    """
    View for retrieving the recent posts.

    This view returns a list of the 10 most recent posts.
    """

    queryset = Post.objects.all().order_by('-id')[:10]
    serializer_class = PostSerializer


class LikePostView(generics.GenericAPIView):
    """
    View for liking a post.

    This view allows authenticated users to like a post.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for liking a post.

        This method adds the authenticated user to the 'likes' field of the post.
        """

        post = get_object_or_404(Post, id=self.kwargs.get('pk'))
        post.likes.add(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UnlikePostView(generics.GenericAPIView):
    """
    View for unliking a post.

    This view allows authenticated users to unlike a post.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for unliking a post.

        This method removes the authenticated user from the 'likes' field of the post.
        """

        post = get_object_or_404(Post, id=self.kwargs.get('pk'))
        post.likes.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class SavePostView(generics.GenericAPIView):
    """
    View for saving a post.

    This view allows authenticated users to save a post.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for saving a post.

        This method adds the authenticated user to the 'saved_by' field of the post.
        """

        post = get_object_or_404(Post, id=self.kwargs.get('pk'))
        post.saved_by.add(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UnsavePostView(generics.GenericAPIView):
    """
    View for unsaving a post.

    This view allows authenticated users to unsave a post.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for unsaving a post.

        This method removes the authenticated user from the 'saved_by' field of the post.
        """

        post = get_object_or_404(Post, id=self.kwargs.get('pk'))
        post.saved_by.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for retrieving, updating, and deleting a single post.

    This view allows users to retrieve, update, or delete a specific post.
    """

    queryset = Post.objects.all()
    serializer_class = PostSerializer
