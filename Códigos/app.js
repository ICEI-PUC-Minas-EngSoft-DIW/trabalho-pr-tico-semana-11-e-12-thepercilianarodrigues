// ===========================================
// 1. DADOS (JSON) - A lista de livros
// ===========================================
const livrosParaDestaque = [
    {
        id: 1,
        titulo: "O Princípe Cruel",
        autor: "Holly Black",
        resenha: "Uma história de fantasia imperdível, cheia de intrigas e magia.",
        descricaoCompleta: "Detalhes profundos sobre a narrativa, personagens e o mundo de fantasia criado pela autora.",
        imagemURL: "/Imagens/O príncipe cruel capa.jpeg"
    },
    {
        id: 2,
        titulo: "A Hipótese do Amor",
        autor: "Ali Hazelwood",
        resenha: "Comédia romântica no mundo acadêmico que virou febre!",
        descricaoCompleta: "Análise completa dos clichês e da dinâmica de 'enemies-to-lovers' deste best-seller.",
        imagemURL: "/Imagens/A hipotese do amor.jpeg"
    },
    {
        id: 3,
        titulo: "É Assim que Acaba",
        autor: "Colleen Hoover",
        resenha: "Um drama emocionante que aborda temas difíceis com sensibilidade.",
        descricaoCompleta: "Discussão sobre os temas sensíveis abordados, o impacto e a relevância do livro na literatura contemporânea.",
        imagemURL: "/Imagens/É assim que acaba (Edição de colecionador).jpeg"
    }
];

// ===========================================
// 2. LÓGICA DE RENDERIZAÇÃO
// ===========================================

// NOVA FUNÇÃO PARA MONTAR O CARROSSEL DINAMICAMENTE
function renderizarCarrossel() {
    const indicatorsContainer = document.getElementById('carousel-indicators-container');
    const innerContainer = document.getElementById('carousel-inner-container');

    if (!indicatorsContainer || !innerContainer) return;

    let indicatorsHTML = '';
    let innerHTML = '';

    livrosParaDestaque.forEach((livro, index) => {
        const activeClass = index === 0 ? 'active' : ''; // Apenas o primeiro item é 'active'

        // Cria o HTML para os indicadores (as bolinhas)
        indicatorsHTML += `
            <button type="button" data-bs-target="#meuCarrossel" data-bs-slide-to="${index}" class="${activeClass}" aria-current="true" aria-label="Slide ${index + 1}"></button>
        `;

        // Cria o HTML para os slides (imagem + legenda)
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

    // Insere o HTML gerado nos containers
    indicatorsContainer.innerHTML = indicatorsHTML;
    innerContainer.innerHTML = innerHTML;
}


function renderizarCardsNaInicial() {
    const containerCards = document.getElementById('container-cards');
    if (!containerCards) return;

    containerCards.innerHTML = ''; 

    livrosParaDestaque.forEach(livro => {
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

function renderizarDetalhesDoLivro() {
    const detalhesContainer = document.getElementById('detalhes-livro');
    if (!detalhesContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const livroId = parseInt(urlParams.get('id'));
    const livro = livrosParaDestaque.find(item => item.id === livroId);

    if (livro) {
        detalhesContainer.innerHTML = `
            <img src="${livro.imagemURL}" alt="Capa do livro ${livro.titulo}" style="width: 300px; display: block; margin: 20px auto;">
            <h1>${livro.titulo}</h1>
            <h2>Por: ${livro.autor}</h2>
            <p><strong>Resumo:</strong> ${livro.resenha}</p>
            <p><strong>Detalhes Completos:</strong> ${livro.descricaoCompleta}</p>
            <a href="index.html">← Voltar para a página inicial</a>
        `;
    } else {
        detalhesContainer.innerHTML = '<h1>Livro não encontrado.</h1>';
    }
}

// ===========================================
// INICIAÇÃO GERAL
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrossel(); // Chama a nova função do carrossel
    renderizarCardsNaInicial();
    renderizarDetalhesDoLivro();
});