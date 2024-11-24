// Elementos das seções
const sections = {
    recommendations: document.getElementById('recommended-books'),
    romance: document.getElementById('romance-books'),
    kids: document.getElementById('kids-books'),
    science: document.getElementById('science-books'),
    history: document.getElementById('history-books'),
    languages: document.getElementById('languages-books'),
    bestSellers: document.getElementById('best-sellers'), // Nova seção
};

// URLs das categorias na API Open Library
const categories = {
    recommendations: 'https://openlibrary.org/subjects/science_fiction.json',
    romance: 'https://openlibrary.org/subjects/romance.json',
    kids: 'https://openlibrary.org/subjects/children.json',
    science: 'https://openlibrary.org/subjects/science.json',
    history: 'https://openlibrary.org/subjects/history.json',
    languages: 'https://openlibrary.org/subjects/languages.json',
};

// API do New York Times
const NYT_API_KEY = 'hJ0A7sX7oc59GR9qAfr0sc6BJ5PNqFpL';
const NYT_BESTSELLERS_URL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${NYT_API_KEY}`;

// Função para criar o card do livro
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book';

    // Imagem do livro
    const img = document.createElement('img');
    img.src = book.cover ? book.cover : 'https://via.placeholder.com/150';
    img.alt = book.title;

    // Título do livro
    const title = document.createElement('h3');
    title.textContent = book.title;

    // Autor(es) do livro
    const author = document.createElement('p');
    author.textContent = book.author_name
        ? book.author_name.slice(0, 2).join(', ') + (book.author_name.length > 2 ? '...' : '')
        : 'Autor desconhecido';

    // Botão "Ler Mais"
    const button = document.createElement('button');
    button.textContent = 'Ler mais';
    button.className = 'read-more';
    button.onclick = () => {
        if (book.key) {
            window.open(book.key, '_blank');
        } else {
            alert('Detalhes do livro não disponíveis.');
        }
    };

    // Montar o card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(button);

    return card;
}

// Função para preencher a sessão de livros
async function populateSection(category, element, isRandom = false) {
    try {
        let url = categories[category];

        // Adiciona lógica para gerar livros aleatórios
        if (isRandom) {
            const randomPage = Math.floor(Math.random() * 10) + 1; // Página aleatória de 1 a 10
            url += `?limit=10&page=${randomPage}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        element.innerHTML = ''; // Limpa a seção antes de adicionar novos livros

        data.works.forEach((book) => {
            const bookCard = createBookCard({
                title: book.title,
                author_name: book.authors ? book.authors.map((a) => a.name) : null,
                cover: book.cover_id
                    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
                    : null,
                key: `https://openlibrary.org${book.key}`,
            });
            element.appendChild(bookCard);
        });
    } catch (error) {
        console.error(`Erro ao carregar ${category}:`, error);
    }
}

// Função para carregar os mais vendidos
async function fetchBestSellers() {
    try {
        const response = await fetch(NYT_BESTSELLERS_URL);
        const data = await response.json();

        if (data.results && data.results.books) {
            const bestSellersSection = sections.bestSellers;
            bestSellersSection.innerHTML = ''; // Limpa a seção antes de adicionar novos livros

            data.results.books.forEach((book) => {
                const bookCard = createBookCard({
                    title: book.title,
                    author_name: [book.author],
                    cover: book.book_image,
                    key: book.amazon_product_url,
                });
                bestSellersSection.appendChild(bookCard);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar os Mais Vendidos:', error);
    }
}

// Preenchendo as sessões
Object.keys(sections).forEach((category) => {
    if (category === 'recommendations') {
        populateSection(category, sections[category], true); // Randomiza a seção de recomendações
    } else if (category !== 'bestSellers') {
        populateSection(category, sections[category]);
    }
});

// Carregar os mais vendidos
fetchBestSellers();

// Função para rolar o slider
function handleSliderNavigation(container, direction) {
    const scrollAmount = 300; // Quantidade de rolagem
    container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
    });
}

// Adicionando eventos aos botões de rolagem
document.querySelectorAll('.book-section').forEach((section) => {
    const slider = section.querySelector('.book-slider');
    const prevButton = section.querySelector('.prev');
    const nextButton = section.querySelector('.next');

    prevButton.addEventListener('click', () => handleSliderNavigation(slider, 'prev'));
    nextButton.addEventListener('click', () => handleSliderNavigation(slider, 'next'));
});

// Barra de pesquisa
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Limpa resultados anteriores
    sections.recommendations.innerHTML = ''; // Apenas limpa a seção de recomendações

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        data.docs.slice(0, 10).forEach((book) => {
            const bookCard = createBookCard({
                title: book.title,
                author_name: book.author_name,
                cover: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                    : null,
                key: `https://openlibrary.org${book.key}`,
            });
            sections.recommendations.appendChild(bookCard); // Exibindo na seção de Recomendações
        });
    } catch (error) {
        console.error('Erro ao pesquisar livros:', error);
    }
});
