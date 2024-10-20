// Initial quotes array
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Motivation" },
  { text: "The unexamined life is not worth living.", category: "Philosophy" }
];

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the quotes array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save updated quotes to localStorage
    saveQuotes();

    // Clear input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update the DOM to show the added quote (optional)
    alert('New quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `
    <p>${selectedQuote.text}</p>
    <p><em>Category: ${selectedQuote.category}</em></p>
  `;
}

// Load the quotes when the page loads
window.onload = function() {
  loadQuotes();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
};
