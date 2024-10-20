let container = document.getElementById("quoteDisplay"); // Get the quote display container
let btn = document.getElementById("newQuote"); // Get the button for showing a new quote

// Array of quotes with their corresponding categories
let quoteArray = [
  {
    text: "It takes courage to grow up and become who you really are.— E.E. Cummings",
    category: "motivational ",
  },
  {
    text: "The best preparation for tomorrow is doing your best today. H. Jackson Brown",
    category: "Inspirational ",
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.― Albert Einstein",
    category: "Humor ",
  },
];

index = quoteArray.length; // Get the length of the quote array
let randomNum = Math.floor(Math.random() * index); // Generate a random index for quotes

// Function to show a random quote from the array
function showRandomQuote() {
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`; // Display the quote and category
}

// Creating Form By JS
function createAddQuoteForm() {
  let container = document.createElement("div"); // Create a new div for the quote form
  container.id = "quoteForm"; // Set the ID for the form container

  // Create input for new quote text
  let inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote"; // Placeholder text

  // Create input for quote category
  let inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category"; // Placeholder text

  // Create button to add the quote
  let addQBtn = document.createElement("button");
  addQBtn.id = "addQuoteButton";
  addQBtn.textContent = "Add Quote"; // Button text

  // Append inputs and button to the form container
  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addQBtn);
  document.body.appendChild(container); // Add the form to the document body

  // Applying the addFunction to the button
  addQBtn.addEventListener("click", addQuote); // Event listener for adding a quote
}

// Save Quotes in Local Storage
function saveQuotes() {
  localStorage.setItem("qoutes", JSON.stringify(quoteArray)); // Save the quotes array to local storage
}

// Load Quotes from Local Storage
function LoadQouts() {
  let savedQoutes = localStorage.getItem("qoutes"); // Get saved quotes from local storage
  if (savedQoutes) {
    quoteArray = JSON.parse(savedQoutes); // Parse and assign to quoteArray if found
  }
}

// Function to add a Quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value; // Get the new quote text
  let inCategory = document.getElementById("newQuoteCategory").value; // Get the new quote category
  if (inQuote && inCategory) { // Check if both fields are filled
    quoteArray.push({ text: inQuote, category: inCategory }); // Add the new quote to the array

    // Call saveQuotes Function to save the new quote in localStorage
    saveQuotes();
    populateCategories(); // Update the categories

    inQuote = ""; // Clear the input fields
    inCategory = "";
    alert("You Successfully added a New Quote"); // Success message
  } else {
    alert("You Must Fill Both Quote & Category Fields"); // Error message
  }
}

// ========== Function to export quotes as JSON =======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2); // Convert quotes array to JSON
  const blob = new Blob([dataStr], { type: "application/json" }); // Create a Blob from JSON
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "qoutes.json"; // Set filename for download
  document.body.appendChild(downloadLink); // Append the link to the document
  downloadLink.click(); // Programmatically click the link to trigger download
  document.body.removeChild(downloadLink); // Remove the link from the document
}

// Add an export button in the form
const exportBtn = document.getElementById("expBTN"); // Get the export button element

exportBtn.addEventListener("click", exportToJsonFile); // Event listener for exporting quotes
document.body.appendChild(exportBtn); // Append the export button to the document

// =================== Function to handle importing quotes from a JSON file ===================
function importFromJsonFile(event) {
  const fileReader = new FileReader(); // Create a new FileReader instance

  // On successful read of the file
  fileReader.onload = function (event) {
    try {
      const importQoutes = JSON.parse(event.target.result); // Parse the imported JSON quotes

      quoteArray.push(...importQoutes); // Add the imported quotes to the array

      saveQuotes(); // Save updated quotes to local storage
      alert("Quotes imported successfully!"); // Success message
    } catch (error) {
      alert("Error importing quotes: Invalid JSON format."); // Error message
    }
  };
  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]);
}

// Add file input for importing JSON
const importInput = document.getElementById("importFile"); // Get the file input element

importInput.onchange = importFromJsonFile; // Event listener for importing quotes from JSON

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter"); // Get the category filter dropdown
  // Create new array with unique category items from the quoteArray
  const uniqueCategories = [
    ...new Set(quoteArray.map((quote) => quote.category)), // Create a set of unique categories
  ];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option"); // Create option element for each category
    option.value = category; // Set the value for the option
    option.textContent = category; // Set the text for the option
    categoryFilter.appendChild(option); // Append the option to the category filter
  });
}

// Function to filter quotes by category and display them
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value; // Get the selected category
  const quoteDisplay = document.getElementById("quoteDisplay"); // Get the quote display element
  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quoteArray
      : quoteArray.filter((quote) => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // Get a random index from filtered quotes
    const randomQuote = filteredQuotes[randomIndex]; // Select a random quote
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`; // Display the quote and category

    // Save last selected category filter and last displayed quote
    localStorage.setItem("lastFilter", selectedCategory);
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.innerHTML = "No quotes available for this category."; // Message if no quotes are available
  }
}

// Load last selected category filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter"); // Get last filter from local storage
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter; // Set the category filter to the last selected value
    filterQuotes(); // Apply the last selected filter
  }
}

// Simulate fetching quotes from a server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Simulated server endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Error handling for failed response
    }
    const serverQuotes = await response.json(); // Parse JSON response
    console.log("Fetched server quotes:", serverQuotes); // Log fetched quotes
    return serverQuotes; // Return fetched quotes
  } catch (error) {
    console.error("Error fetching server quotes:", error); // Log error
  }
}

// Function to sync local quotes with server quotes using async/await
async function syncQuotesWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer(); // Fetch quotes from the server
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || []; // Get local quotes

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
    console.log("Quotes
