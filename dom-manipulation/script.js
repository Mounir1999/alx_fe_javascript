// Get DOM elements for displaying quotes and buttons
let container = document.getElementById("quoteDisplay"); 
let btn = document.getElementById("newQuote");

// Initialize an array to hold quotes with text and categories
let quoteArray = [
  {
    text: "It takes courage to grow up and become who you really are.— E.E. Cummings",
    category: "motivational",
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

// Function to show a random quote from the array
function showRandomQuote() {
  let randomNum = Math.floor(Math.random() * quoteArray.length);
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`;
}

// Creating form to add new quotes
function createAddQuoteForm() {
  let formContainer = document.createElement("div");
  formContainer.id = "quoteForm";

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

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addQBtn);
  document.body.appendChild(formContainer);

  // Applying the addQuote function to the button
  addQBtn.addEventListener("click", addQuote);
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quoteArray));
}

// Load quotes from local storage
function loadQuotes() {
  let savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quoteArray = JSON.parse(savedQuotes);
  }
}

// Function to add a new quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value;
  let inCategory = document.getElementById("newQuoteCategory").value;
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory });

    // Call saveQuotes function to save the new quote in localStorage
    saveQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("You successfully added a new quote!");
  } else {
    alert("You must fill both quote & category fields.");
  }
}

// Function to export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a download link for the JSON file
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Add an export button in the form
const exportBtn = document.getElementById("expBTN");
exportBtn.addEventListener("click", exportToJsonFile);
document.body.appendChild(exportBtn);

// Function to handle importing quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  // On successful read of the file
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quoteArray.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes: Invalid JSON format.");
    }
  };
  
  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]);
}

// Add file input for importing JSON
const importInput = document.getElementById("importFile");
importInput.onchange = importFromJsonFile;

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = ""; // Clear existing options

  // Create a new array with unique category items from the quoteArray
  const uniqueCategories = [...new Set(quoteArray.map((quote) => quote.category))];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by category and display them
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quoteArray
      : quoteArray.filter((quote) => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  } else {
    quoteDisplay.innerHTML = "No quotes available for this category.";
  }
}

// Load last selected category filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter;
    filterQuotes(); // Apply the last selected filter
  }
}

// Simulate fetching quotes from a server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Simulated server endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const serverQuotes = await response.json(); // Parse JSON response
    return serverQuotes; // Return fetched quotes
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

// Function to sync local quotes with server quotes
async function syncQuotesWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Merge server quotes with local ones (no duplicates)
    const mergedQuotes = [
      ...localQuotes,
      ...serverQuotes.filter(
        (serverQuote) =>
          !localQuotes.some((localQuote) => localQuote.id === serverQuote.id)
      ),
    ];

    // Save merged quotes to local storage
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    console.log("Quotes synced with server!");
  } catch (error) {
    console.error("Error during syncing quotes with the server:", error);
  }
}

// Call sync function periodically to check for new quotes
setInterval(() => {
  syncQuotesWithServer();
}, 15000); // Sync every 15 seconds

// Apply event listeners and initialize the application
onload = function () {
  loadQuotes();
  populateCategories();
  loadLastFilter();
  createAddQuoteForm();
};

// Add event listener for showing a random quote
btn.addEventListener("click", showRandomQuote);
