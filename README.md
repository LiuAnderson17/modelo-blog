# Meu Blog Django

Um blog dinâmico desenvolvido com Django, permitindo a criação, edição, exclusão e visualização de posts, com funcionalidades de busca e posts relacionados. O projeto possui um design moderno com gradiente no cabeçalho, sombras suaves e bordas arredondadas, garantindo uma experiência visual atraente e responsiva.

## Funcionalidades

- **Visualização de Posts**: Exibe posts em uma grade no index (`/`) com título, resumo, data e thumbnail (ou imagem padrão).
- **Criação de Posts**: Funcionalidade restrita a usuários autenticados com status de staff (`/create-post/`), com editor Quill.js para conteúdo rico e upload de imagens.
- **Edição e Exclusão**: Admins podem editar (`/create-post/<id>/`) e excluir posts (`/delete-post/<id>/`) com confirmação via diálogo `confirm`.
- **Busca**: Permite buscar posts por título, resumo ou conteúdo (`/search/?q=<termo>`).
- **Posts Relacionados**: Exibe até 3 posts relacionados na sidebar de cada post, com fallback para posts recentes.
- **Responsividade**: Layout adaptável para dispositivos móveis (telas menores que 480px).
- **Segurança**: Criação e edição de posts protegidas com `@login_required`. Botões de gerenciamento (criar, editar, excluir) visíveis apenas para admins.
- **Estilo**: Design sofisticado com gradiente no cabeçalho, sombras, bordas arredondadas e cores consistentes (`#007bff` para ações principais).

## Requisitos

- Python 3.8+
- Django 4.x
- Pillow (para suporte a imagens)
- Navegador moderno (para Quill.js e responsividade)

## Instalação

1. **Clonar o Repositório** (quando disponível no Git):
   ```bash
   git clone https://github.com/LiuAnderson17/modelo-blog.git .
   
   ```

2. **Criar e Ativar um Ambiente Virtual**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Instalar Dependências**:
   
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar o Projeto**:
   - Certifique-se de que o arquivo `settings.py` está configurado com:
     ```python
     INSTALLED_APPS = [
         ...
         'blog',
     ]
     STATIC_URL = '/static/'
     STATICFILES_DIRS = [BASE_DIR / "static"]
     MEDIA_URL = '/media/'
     MEDIA_ROOT = BASE_DIR / "media"
     ```
   - Adicione as configurações de autenticação, se necessário:
     ```python
     LOGIN_URL = '/admin/login/'
     ```

5. **Aplicar Migrações**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Criar um Superusuário**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Coletar Arquivos Estáticos**:
   ```bash
   python manage.py collectstatic
   ```

8. **Iniciar o Servidor**:
   ```bash
   python manage.py runserver
   ```
   Acesse `http://127.0.0.1:8000/` no navegador.

## Estrutura do Projeto

```
meu-blog-django/
├── blog/
│   ├── migrations/
│   ├── static/
│   │   ├── blog/
│   │   │   ├── styles.css       # Estilos do blog (gradiente, sombras, responsividade)
│   │   │   ├── create-post.js   # JavaScript para o editor Quill.js
│   │   │   ├── logo.png         # Logo do blog
│   │   │   ├── placeholder.png  # Imagem padrão para posts sem thumbnail
│   ├── templates/
│   │   ├── blog/
│   │   │   ├── index.html       # Página inicial com grade de posts
│   │   │   ├── post.html        # Página de detalhes do post com sidebar
│   │   │   ├── create-post.html # Formulário de criação/edição de posts
│   │   │   ├── header.html      # Cabeçalho com menu e busca
│   │   │   ├── footer.html      # Rodapé
│   │   │   ├── about.html       # Página "Sobre"
│   │   │   ├── contact.html     # Página "Contato"
│   │   │   ├── search.html      # Página de resultados de busca
│   ├── __init__.py
│   ├── admin.py                 # Configuração do admin
│   ├── apps.py
│   ├── models.py               # Modelo Post (título, resumo, conteúdo, etc.)
│   ├── urls.py                 # Rotas do blog
│   ├── views.py                # Lógica das views
├── media/
│   ├── thumbnails/             # Imagens dos posts
├── manage.py
├── requirements.txt            # Dependências
├── README.md                   # Este arquivo
```

## Uso

1. **Acessar o Blog**:
   - Página inicial: `http://127.0.0.1:8000/`
   - Detalhes do post: `http://127.0.0.1:8000/post/<id>/`
   - Busca: `http://127.0.0.1:8000/search/?q=<termo>`
   - Sobre: `http://127.0.0.1:8000/about/`
   - Contato: `http://127.0.0.1:8000/contact/`

2. **Gerenciamento (Admin)**:
   - Faça login em `http://127.0.0.1:8000/admin/`.
   - Crie/editar posts em `http://127.0.0.1:8000/create-post/` ou `http://127.0.0.1:8000/create-post/<id>/`.
   - Exclua posts em `http://127.0.0.1:8000/post/<id>/` (botão "Excluir" com confirmação).

3. **Funcionalidades do Admin**:
   - Botão "Criar Post" visível apenas para usuários autenticados com status de staff.
   - Botões "Editar" e "Excluir" aparecem apenas para admins na página de detalhes do post.

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m "Adiciona nova funcionalidade"`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Melhorias Futuras

- Adicionar sistema de comentários em `post.html`.
- Implementar busca dinâmica com JavaScript (resultados instantâneos).
- Adicionar paginação dinâmica.
- Configurar Django REST Framework para uma API de posts.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` (a ser criado) para mais detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato via [inserir contato, ex.: e-mail ou issue no Git].
