// ===========================================
// 0. CONFIGURAÇÃO DAS APIs
// ===========================================
const API_URL_LIVROS = 'http://localhost:3000/livros';
const API_URL_USUARIOS = 'http://localhost:3000/usuarios';


// ===========================================
// INICIAÇÃO GERAL - O "Cérebro"
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verifica em qual página estamos e chama as funções certas
    
    // Se for a PÁGINA INICIAL (index.html)
    if (document.getElementById('container-cards') || document.getElementById('carousel-inner-container')) {
        carregarLivrosPaginaInicial();
    }

    // Se for a PÁGINA DE DETALHES (detalhes.html)
    if (document.getElementById('detalhes-livro')) {
        carregarDetalhesDoLivro();
    }
    
    // Se for a PÁGINA DE CADASTRO DE USUÁRIO (cadastro.html)
    const formUsuario = document.getElementById('form-cadastro'); // <-- ID do seu formulário de usuário
    if (formUsuario) {
        formUsuario.addEventListener('submit', cadastrarUsuario);
    }
});


// ===========================================
// FUNÇÕES DOS USUÁRIOS (Para o cadastro.html)
// ===========================================

// ESTA É A FUNÇÃO PARA O SEU PRINT DO POST (ETAPA 3)
async function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // !!! IMPORTANTE: Troque os IDs abaixo pelos IDs reais do seu formulário de usuário !!!
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    // Tentei adivinhar os IDs do seu formulário. Ajuste se for diferente.

    // 2. Monte o objeto do novo usuário
    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha
        // Você pode adicionar 'login: login' se tiver esse campo
    };

    // 3. Envie para o servidor (POST)
    try {
        const response = await fetch(API_URL_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario),
        });

        if (!response.ok) throw new Error('Erro ao cadastrar usuário');

        alert('Usuário cadastrado com sucesso!');
        event.target.reset(); // Limpa o formulário
        
        // Opcional: Redireciona para a home ou login
        // window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Falha ao cadastrar o usuário.');
    }
}


// ===========================================
// FUNÇÕES DOS LIVROS (Para o index.html e detalhes.html)
// ===========================================

// Busca os livros da API e manda renderizar
async function carregarLivrosPaginaInicial() {
    try {
        const response = await fetch(API_URL_LIVROS);
        const livros = await response.json();
        
        // Passa os livros baixados para as funções de renderização
        renderizarCarrossel(livros);
        renderizarCardsNaInicial(livros);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Renderiza o carrossel (código que você já tinha, mas agora recebe 'livros')
function renderizarCarrossel(livros) {
    const indicatorsContainer = document.getElementById('carousel-indicators-container');
    const innerContainer = document.getElementById('carousel-inner-container');
    if (!indicatorsContainer || !innerContainer) return;

    let indicatorsHTML = '';
    let innerHTML = '';

    livros.forEach((livro, index) => {
        const activeClass = index === 0 ? 'active' : '';
        indicatorsHTML += `<button type="button" data-bs-target="#meuCarrossel" data-bs-slide-to="${index}" class="${activeClass}" aria-current="true" aria-label="Slide ${index + 1}"></button>`;
        innerHTML += `
            <div class="carousel-item ${activeClass}">
                <img src="${livro.imagemURL}" class="d-block w-100" alt="Capa do livro ${livro.titulo}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${livro.titulo}</h5>
                    <p>${livro.resenha}</p>
                </div>
            </div>
        `;
    });
    indicatorsContainer.innerHTML = indicatorsHTML;
    innerContainer.innerHTML = innerHTML;
}

// Renderiza os cards (código que você já tinha, mas agora recebe 'livros')
function renderizarCardsNaInicial(livros) {
    const containerCards = document.getElementById('container-cards');
    if (!containerCards) return;
    containerCards.innerHTML = ''; 

    livros.forEach(livro => {
        const cardColuna = document.createElement('div');
        cardColuna.className = 'col-lg-4 col-md-6 mb-4';
        cardColuna.innerHTML = `
            <div class="card h-100">
                <a href="detalhes.html?id=${livro.id}">
                    <img src="${livro.imagemURL}" class="card-img-top" alt="Capa do livro ${livro.titulo}">
                </a>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${livro.titulo}</h5>
                    <p class="card-text text-muted">Autor(a): ${livro.autor}</p>
                    <p class="card-text mt-2 flex-grow-1">${livro.resenha}</p>
                    <a href="detalhes.html?id=${livro.id}" class="btn btn-primary align-self-start mt-auto">Ver Mais Detalhes</a>
                </div>
            </div>
        `;
        containerCards.appendChild(cardColuna);
    });
}

// Busca os detalhes de UM livro para a página detalhes.html
async function carregarDetalhesDoLivro() {
    const detalhesContainer = document.getElementById('detalhes-livro');
    if (!detalhesContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get('id');

    if (!livroId) {
        detalhesContainer.innerHTML = '<h1>Livro não encontrado (ID não fornecido).</h1>';
        return;
    }

    try {
        const response = await fetch(`${API_URL_LIVROS}/${livroId}`);
        if (!response.ok) throw new Error('Livro não encontrado na API');
        
        const livro = await response.json();
        detalhesContainer.innerHTML = `
            <img src="${livro.imagemURL}" alt="Capa do livro ${livro.titulo}" style="width: 300px; display: block; margin: 20px auto;">
            <h1>${livro.titulo}</h1>
            <h2>Por: ${livro.autor}</h2>
            <p><strong>Resumo:</strong> ${livro.resenha}</p>
            <p><strong>Detalhes Completos:</strong> ${livro.descricaoCompleta}</p>
            <a href="index.html">← Voltar para a página inicial</a>
        `;
    } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error);
        detalhesContainer.innerHTML = '<h1>Erro ao carregar o livro.</h1>';
    }
}