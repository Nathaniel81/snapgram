from accounts.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .authenticate import CustomAuthentication
from .models import Post
from .serializers import PostSerializer
from django.db.models import Q


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

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to like a post")

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

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to unlike a post")

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

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to save a post")

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

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to unsave a post")

        post = get_object_or_404(Post, id=self.kwargs.get('pk'))
        post.saved_by.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for retrieving, updating, and deleting a single post.

    This view allows users to retrieve, update, or delete a specific post.
    """

    authentication_classes = [CustomAuthentication]

    queryset = Post.objects.all()
    serializer_class = PostSerializer

class UserPostsView(generics.ListAPIView):
    """
    View for retrieving posts created by a specific user.

    This view returns a list of posts created by a particular user.
    """

    serializer_class = PostSerializer

    def get_queryset(self):
        """
        Get the queryset of posts created by a specific user.

        This method filters the queryset to include only posts created by the specified user.
        """

        user = get_object_or_404(User, id=self.kwargs.get('pk'))
        return Post.objects.filter(creator=user)

class PostPagination(PageNumberPagination):
    """
    Pagination class for posts.

    This pagination class sets the page size to 6 posts per page.
    """

    page_size = 6

class PostsListView(generics.ListAPIView):
    """
    View for listing posts.

    This view returns a paginated list of all posts, ordered by the 'updatedAt' field.
    """

    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-updatedAt')
    pagination_class = PostPagination

class SearchPostsView(generics.ListAPIView):
    """
    View for searching posts.

    This view returns a list of posts filtered by a search query.
    """

    serializer_class = PostSerializer

    def get_queryset(self):
        """
        Get the queryset of posts filtered by a search query.

        This method filters the queryset to include only posts containing the search query in their caption.
        """

        query = self.request.query_params.get('query', '')
        queryset = Post.objects.filter(Q(caption__icontains=query))
        return queryset

class SavedPostsView(generics.ListAPIView):
    """
    View for listing saved posts.

    This view returns a list of posts saved by the authenticated user.
    """

    serializer_class = PostSerializer
    authentication_classes = [CustomAuthentication]

    def get_queryset(self):
        """
        Get the queryset of saved posts for the authenticated user.

        This method filters the queryset to include only posts saved by the authenticated user.
        """

        user = self.request.user
        queryset = Post.objects.filter(saved_by=user)
        return queryset

class LikedPostsView(generics.ListAPIView):
    """
    View for listing liked posts.

    This view returns a list of posts liked by the authenticated user.
    """

    serializer_class = PostSerializer
    authentication_classes = [CustomAuthentication]

    def get_queryset(self):
        """
        Get the queryset of liked posts for the authenticated user.

        This method filters the queryset to include only posts liked by the authenticated user.
        """

        user = self.request.user
        queryset = Post.objects.filter(likes=user)
        return queryset
