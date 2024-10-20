// Initial quotes array
let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "The unexamined life is not worth living.", category: "Philosophy" }
];

// Function to load quotes from localStorage if available
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategoryFilter();
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = "<p>No quotes available.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p>${selectedQuote.text}</p>
        <p><em>Category: ${selectedQuote.category}</em></p>
    `;
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategoryFilter();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to populate the category filter
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // reset filter options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');

    if (selectedCategory === "all") {
        showRandomQuote();
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const selectedQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `
                <p>${selectedQuote.text}</p>
                <p><em>Category: ${selectedQuote.category}</em></p>
            `;
        } else {
            quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
        }
    }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('expBTN').addEventListener('click', exportQuotes);

// Load quotes when the page loads
window.onload = function() {
    loadQuotes();
};
