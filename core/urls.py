from django.urls import path
from . import views
    
urlpatterns = [
	path('', views.PostsListView.as_view(), name='posts_list'),
	path('search/', views.SearchPostsView.as_view(), name='search_posts'),
	path('recent/', views.RecentPostsView.as_view(), name='recent_posts'),
	path('saved/', views.SavedPostsView.as_view(), name='saved_posts'),
	path('liked/', views.LikedPostsView.as_view(), name='liked_posts'),
	path('<int:pk>/', views.PostRetrieveUpdateDestroyView.as_view(), name='post_detail'),
	path('user/<int:pk>/', views.UserPostsView.as_view(), name='user_posts'),
	path('create/', views.PostCreateView.as_view(), name='post_create'),
	path('<int:pk>/like/', views.LikePostView.as_view(), name='like_post'),
    path('<int:pk>/unlike/', views.UnlikePostView.as_view(), name='unlike_post'),
	path('<int:pk>/save/', views.SavePostView.as_view(), name='save_post'),
    path('<int:pk>/unsave/',views.UnsavePostView.as_view(), name='unsave_post'),
]
