document.addEventListener('DOMContentLoaded', function () {
    const quill = new Quill('#create-post-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
            ]
        }
    });

    const form = document.getElementById('create-post-form');
    const contentInput = document.getElementById('create-post-content');
    const imageInput = document.getElementById('create-post-image');
    const imagePreview = document.getElementById('create-post-image-preview');
    const postId = form.dataset.postId;

    // Preencher o editor com o conteúdo existente, se houver
    if (contentInput.value) {
        quill.root.innerHTML = contentInput.value;
    }

    // Mostrar prévia da imagem existente, se houver
    if (imagePreview.querySelector('img')) {
        imagePreview.style.display = 'block';
    }

    // Prévia da nova imagem selecionada
    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Prévia da imagem">`;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    });

    // Enviar formulário via AJAX
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        contentInput.value = quill.root.innerHTML;

        const formData = new FormData(form);
        const url = postId ? `/create-post/${postId}/` : '/create-post/';

        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Post salvo com sucesso!');
                window.location.href = '/';
            } else {
                alert('Erro ao salvar o post: ' + (data.error || 'Tente novamente.'));
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar o post: ' + error.message);
        });
    });
});