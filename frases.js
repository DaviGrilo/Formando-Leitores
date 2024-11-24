const quoteElement = document.getElementById('quote');
const newQuoteButton = document.getElementById('new-quote-button');
let quotes = [];

async function fetchQuotes() {
    try {
        const response = await fetch('https://type.fit/api/quotes');
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        quotes = await response.json();
        displayRandomQuote();
    } catch (error) {
        console.error(error);
        quoteElement.innerHTML = "Erro ao carregar citações. Tente novamente mais tarde.";
    }
}

function displayRandomQuote() {
    if (!quotes.length) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteElement.innerHTML = `"${randomQuote.text}" <br> - ${randomQuote.author || "Anônimo"}`;
}

newQuoteButton.addEventListener('click', displayRandomQuote);
fetchQuotes();
