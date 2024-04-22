from django.urls import path
from core import views
    
urlpatterns = [
    path("myinbox/<user_id>/", views.MyInbox.as_view()),
    path("get-messages/<sender_id>/<reciever_id>/", views.GetMessages.as_view()),
    path("send-messages/", views.SendMessages.as_view()),
]