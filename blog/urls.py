from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('search/', views.search, name='search'),
    path('create-post/', views.create_post, name='create_post'),
    path('create-post/<int:pk>/', views.create_post, name='edit_post'),
    path('delete-post/<int:pk>/', views.delete_post, name='delete_post'),
]