document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Quill.js
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean']
            ]
        },
        placeholder: 'Digite o conteúdo do post aqui...'
    });

    // Sincronizar conteúdo do editor com o campo hidden
    quill.on('text-change', () => {
        document.getElementById('post-content').value = quill.root.innerHTML;
    });

    // Preencher data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('post-date').value = today;

    // Pré-visualização da imagem
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da imagem">`;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
        }
    });

    // Validação do formulário e salvamento no JSON
    const form = document.getElementById('create-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value.trim();
        const summary = document.getElementById('post-summary').value.trim();
        const content = document.getElementById('post-content').value.trim();
        const date = document.getElementById('post-date').value;
        const imageInput = document.getElementById('post-image');
        const imageFile = imageInput.files[0];

        if (!title || !summary || !content) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Converter imagem para base64 (se houver)
        const savePost = (imageBase64 = '') => {
            const post = {
                id: Date.now(), // ID único baseado no timestamp
                title,
                summary,
                content,
                date,
                image: imageBase64
            };

            // Opção 1: Salvar em localStorage
            let posts = JSON.parse(localStorage.getItem('posts') || '[]');
            posts.push(post);
            localStorage.setItem('posts', JSON.stringify(posts));

            // Opção 2: Gerar download de posts.json
            const jsonContent = JSON.stringify(posts, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'posts.json';
            a.click();
            URL.revokeObjectURL(url);

            // Simulação de sucesso
            alert('Post salvo com sucesso! Dados adicionados ao localStorage e posts.json baixado.');
            form.reset();
            quill.setContents([]);
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
            document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => savePost(e.target.result);
            reader.readAsDataURL(imageFile);
        } else {
            savePost();
        }
    });
});