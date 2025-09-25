from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Post
from django.db.models import Q
from django.core.paginator import Paginator
import json

def index(request):
    posts = Post.objects.all().order_by('-date')
    paginator = Paginator(posts, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'blog/index.html', {'page_obj': page_obj})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    # Tentar buscar posts relacionados por título ou resumo
    related_posts = Post.objects.filter(
        Q(title__icontains=post.title.split()[0]) |  # Usar primeira palavra do título
        Q(summary__icontains=post.summary[:50])  # Usar primeiros 50 caracteres do resumo
    ).exclude(pk=pk)[:3]
    # Se não houver posts relacionados, buscar 3 posts recentes
    if not related_posts.exists():
        related_posts = Post.objects.exclude(pk=pk).order_by('-date')[:3]
    return render(request, 'blog/post.html', {'post': post, 'related_posts': related_posts})

def about(request):
    return render(request, 'blog/about.html')

def contact(request):
    return render(request, 'blog/contact.html')

def search(request):
    query = request.GET.get('q', '')
    posts = Post.objects.filter(Q(title__icontains=query) | Q(summary__icontains=query) | Q(content__icontains=query)).order_by('-date')
    paginator = Paginator(posts, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'blog/search.html', {'page_obj': page_obj, 'query': query})

@login_required
def create_post(request, pk=None):
    if request.method == 'POST':
        data = request.POST
        thumbnail = request.FILES.get('thumbnail')
        try:
            if pk:  # Edição
                post = get_object_or_404(Post, pk=pk)
                post.title = data['title']
                post.summary = data['summary']
                post.content = data['content']
                if thumbnail:
                    post.thumbnail = thumbnail
                post.save()
            else:  # Criação
                post = Post.objects.create(
                    title=data['title'],
                    summary=data['summary'],
                    content=data['content'],
                    thumbnail=thumbnail,
                    author=request.user
                )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        post = get_object_or_404(Post, pk=pk) if pk else None
        return render(request, 'blog/create-post.html', {'post': post})

@login_required
def delete_post(request, pk):
    if request.method == 'POST':
        post = get_object_or_404(Post, pk=pk)
        if request.user.is_staff:
            post.delete()
            return redirect('index')
        else:
            return JsonResponse({'success': False, 'error': 'Permissão negada.'}, status=403)
    return redirect('index')