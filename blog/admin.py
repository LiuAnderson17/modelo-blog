from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'author']
    list_filter = ['date', 'author']
    search_fields = ['title', 'summary', 'content']
    readonly_fields = ['date']