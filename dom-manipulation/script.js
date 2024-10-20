let container = document.getElementById("quoteDisplay");
let btn = document.getElementById("newQuote");

let quoteArray = [
  {
    text: "It takes courage to grow up and become who you really are.— E.E. Cummings",
    category: "Motivational",
  },
  {
    text: "The best preparation for tomorrow is doing your best today. H. Jackson Brown",
    category: "Inspirational",
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.― Albert Einstein",
    category: "Humor",
  },
];

// Load quotes from local storage
function loadQuotes() {
  let savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quoteArray = JSON.parse(savedQuotes);
  }
}

// Save quotes in local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quoteArray));
}

// Function to show a random quote from the array
function showRandomQuote() {
  const randomNum = Math.floor(Math.random() * quoteArray.length);
  container.innerHTML = `'${quoteArray[randomNum].text}' - '${quoteArray[randomNum].category}'`;
}

// Creating the form dynamically
function createAddQuoteForm() {
  let container = document.createElement("div");
  container.id = "quoteForm";

  let inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  let inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  let addQBtn = document.createElement("button");
  addQBtn.id = "addQuoteButton";
  addQBtn.textContent = "Add Quote";

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addQBtn);
  document.body.appendChild(container);
  
  // Apply the addQuote function to the button
  addQBtn.addEventListener("click", addQuote);
}

// Function to add a quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value.trim();
  let inCategory = document.getElementById("newQuoteCategory").value.trim();
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory });

    // Call saveQuotes function to save the new quote in localStorage
    saveQuotes();
    alert("You successfully added a new quote.");

    // Clear the input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    
    populateCategories(); // Update categories after adding a new quote
  } else {
    alert("You must fill both quote & category fields.");
  }
}

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = ""; // Clear existing options
  const uniqueCategories = [...new Set(quoteArray.map((quote) => quote.category))];
  
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Initialize on page load
window.onload = function () {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  showRandomQuote(); // Show a random quote on initial load
};

// Adding event listener to the button
btn.addEventListener("click", showRandomQuote);
