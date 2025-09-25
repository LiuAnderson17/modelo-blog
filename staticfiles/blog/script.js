document.addEventListener('DOMContentLoaded', () => {
    // Configuração da paginação
    const postsPerPage = 9;
    let currentPage = 1;
    let allPosts = []; // Armazena todos os posts carregados

    // Carrega o cabeçalho
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Inicializa a busca após o cabeçalho ser carregado
            initializeSearch();
        })
        .catch(error => console.error('Erro ao carregar o header:', error));

    // Carrega o rodapé
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));

    // Função para renderizar posts
    function renderPosts(posts, page, containerId = 'posts') {
        const postsSection = document.getElementById(containerId);
        postsSection.innerHTML = ''; // Limpa os posts existentes
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const paginatedPosts = posts.slice(start, end);

        if (paginatedPosts.length === 0) {
            postsSection.innerHTML = '<p class="no-results">Nenhum post encontrado.</p>';
            if (containerId === 'posts') {
                document.getElementById('pagination').innerHTML = '';
            }
            return;
        }

        paginatedPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'post';
            article.innerHTML = `
                <img src="${post.thumbnail}" alt="Imagem do ${post.title}" class="post-thumbnail">
                <h2>${post.title}</h2>
                <p class="post-date">${post.date}</p>
                <p class="post-summary">${post.summary}</p>
                <a href="post.html?id=${post.id}" class="read-more">Leia mais</a>
            `;
            postsSection.appendChild(article);
        });

        // Renderiza botões de paginação apenas para o container 'posts'
        if (containerId === 'posts') {
            const totalPages = Math.ceil(posts.length / postsPerPage);
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = `
                <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
                <span>Página ${currentPage} de ${totalPages}</span>
                <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Próximo</button>
            `;

            // Adiciona eventos aos botões
            document.getElementById('prev-page').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPosts(posts, currentPage);
                }
            });

            document.getElementById('next-page').addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPosts(posts, currentPage);
                }
            });
        }
    }

    // Função para inicializar a busca
    function initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        if (searchInput && searchButton && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '')) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim().toLowerCase();
                const filteredPosts = allPosts.filter(post =>
                    post.title.toLowerCase().includes(query) ||
                    post.summary.toLowerCase().includes(query)
                );
                currentPage = 1; // Reseta para a primeira página
                renderPosts(filteredPosts, currentPage);
            });
        }
    }

    // Função para inicializar compartilhamento
    function initializeShareButtons(post) {
        const shareTwitter = document.getElementById('share-twitter');
        const shareFacebook = document.getElementById('share-facebook');
        const shareWhatsapp = document.getElementById('share-whatsapp');
        const postUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(post.title);

        if (shareTwitter) {
            shareTwitter.href = `https://twitter.com/intent/tweet?text=${postTitle}&url=${postUrl}`;
        }
        if (shareFacebook) {
            shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        }
        if (shareWhatsapp) {
            shareWhatsapp.href = `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`;
        }
    }

    // Função para inicializar comentários
    function initializeComments(postId) {
        const commentForm = document.getElementById('comment-form');
        const commentsList = document.getElementById('comments-list');
        if (commentForm && commentsList) {
            // Carrega comentários existentes do localStorage
            const comments = JSON.parse(localStorage.getItem(`comments_${postId}`)) || [];

            // Renderiza comentários
            function renderComments() {
                commentsList.innerHTML = '';
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <p class="comment-name">${comment.name}</p>
                        <p class="comment-date">${comment.date}</p>
                        <p>${comment.text}</p>
                    `;
                    commentsList.appendChild(commentDiv);
                });
            }

            renderComments();

            // Adiciona evento ao formulário de comentários
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('comment-name').value.trim();
                const email = document.getElementById('comment-email').value.trim();
                const text = document.getElementById('comment-text').value.trim();

                if (!name || !text) {
                    alert('Por favor, preencha os campos obrigatórios (nome e comentário).');
                    return;
                }

                const comment = {
                    name,
                    email,
                    text,
                    date: new Date().toLocaleString('pt-BR')
                };

                comments.push(comment);
                localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
                renderComments();
                commentForm.reset();
            });
        }
    }

    // Função para renderizar posts relacionados
    function renderRelatedPosts(posts, currentPostId) {
        const relatedContainer = document.getElementById('related-posts-container');
        if (relatedContainer) {
            // Filtra posts, excluindo o post atual
            const availablePosts = posts.filter(post => post.id !== currentPostId);
            // Seleciona 3 posts aleatórios
            const shuffled = availablePosts.sort(() => 0.5 - Math.random());
            const selectedPosts = shuffled.slice(0, 3);
            renderPosts(selectedPosts, 1, 'related-posts-container');
        }
    }

    // Carrega os posts do posts.json
    fetch('posts.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts; // Armazena os posts para uso na busca
            // Carrega os posts no index.html
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                renderPosts(posts, currentPage);
            }

            // Carrega o conteúdo do post em post.html
            if (window.location.pathname.includes('post.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const postId = parseInt(urlParams.get('id'));
                const post = posts.find(p => p.id === postId);

                if (post) {
                    document.getElementById('post-title').innerText = post.title;
                    document.getElementById('post-date').innerText = post.date;
                    const contentDiv = document.getElementById('post-content');
                    // Divide o conteúdo em parágrafos
                    const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');
                    const midPoint = Math.ceil(paragraphs.length / 2);
                    let contentHTML = '';
                    paragraphs.forEach((para, index) => {
                        contentHTML += `<p>${para}</p>`;
                        // Insere anúncio após o parágrafo do meio
                        if (index === midPoint - 1) {
                            contentHTML += `
                                <div class="ad-banner post-ad">
                                    <div class="ad-placeholder">Anúncio 728x90</div>
                                </div>
                            `;
                        }
                    });
                    contentDiv.innerHTML = contentHTML;
                    const thumbnail = document.getElementById('post-thumbnail');
                    thumbnail.src = post.thumbnail;
                    thumbnail.alt = `Imagem do ${post.title}`;
                    // Verifica se a imagem carrega corretamente
                    thumbnail.onerror = () => {
                        thumbnail.style.display = 'none'; // Esconde a imagem se não carregar
                        console.error(`Erro ao carregar a imagem: ${post.thumbnail}`);
                    };

                    // Inicializa botões de compartilhamento
                    initializeShareButtons(post);
                    // Inicializa comentários
                    initializeComments(postId);
                    // Renderiza posts relacionados
                    renderRelatedPosts(posts, postId);
                } else {
                    document.getElementById('post-content').innerText = 'Post não encontrado.';
                    document.getElementById('post-thumbnail').style.display = 'none';
                }
            }
        })
        .catch(error => console.error('Erro ao carregar os posts:', error));

    // Validação do formulário de contato em contato.html
    if (window.location.pathname.includes('contato.html')) {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !subject || !message) {
                    alert('Por favor, preencha todos os campos.');
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert('Por favor, insira um e-mail válido.');
                    return;
                }

                // Simula o envio do formulário
                alert('Formulário enviado com sucesso!');
                contactForm.reset();
            });
        }
    }

    console.log('Blog carregado com sucesso!');
});