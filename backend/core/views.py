from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from .authenticate import CustomAuthentication


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
