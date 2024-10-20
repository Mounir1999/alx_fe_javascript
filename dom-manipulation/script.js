let container = document.getElementById("quoteDisplay"); // Get the quote display element
let btn = document.getElementById("newQuote"); // Get the button to show a new quote

// Initialize an array of quote objects
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

// Calculate the index of the quote array
index = quoteArray.length;
let randomNum = Math.floor(Math.random() * index); // Get a random number based on the index

// Function to show a random quote from the array
function showRandomQuote() {
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`;
}

// Creating Form By JS
function createAddQuoteForm() {
  let container = document.createElement("div"); // Create a new div for the quote form
  container.id = "quoteForm"; // Set the id for the container

  // Create input field for new quote text
  let inputText = document.createElement("input");
  inputText.id = "newQuoteText"; // Set id for the input
  inputText.type = "text"; // Set input type to text
  inputText.placeholder = "Enter a new quote"; // Placeholder text

  // Create input field for new quote category
  let inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory"; // Set id for the category input
  inputCategory.type = "text"; // Set input type to text
  inputCategory.placeholder = "Enter quote category"; // Placeholder text

  // Create button to add new quote
  let addQBtn = document.createElement("button");
  addQBtn.id = "addQuoteButton"; // Set id for the button
  addQBtn.textContent = "Add Quote"; // Set button text

  // Append inputs and button to the container
  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addQBtn);
  document.body.appendChild(container); // Append the container to the body

  // Applying the addFunction to the Btn
  addQBtn.addEventListener("click", addQuote); // Event listener for adding a quote
}

// Save Quotes in Local Storage
function saveQuotes() {
  localStorage.setItem("qoutes", JSON.stringify(quoteArray)); // Save quotes to local storage
}

// Load Quotes from Local Storage
function LoadQouts() {
  let savedQoutes = localStorage.getItem("qoutes"); // Get saved quotes from local storage
  if (savedQoutes) {
    quoteArray = JSON.parse(savedQoutes); // Parse and set the quotes array
  }
}

// Function to add a Quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value; // Get new quote text
  let inCategory = document.getElementById("newQuoteCategory").value; // Get new quote category
  if (inQuote && inCategory) {
    // Check if both fields are filled
    quoteArray.push({ text: inQuote, category: inCategory }); // Add new quote to the array

    // Call saveQuotes function to save the new quote in localStorage
    saveQuotes(); // Save updated quotes to local storage
    populateCategories(); // Update category filter

    inQuote = ""; // Clear input field
    inCategory = ""; // Clear category field
    alert("You Successfully add New Qoute"); // Alert user of success
  } else {
    alert("You Must Fill Both Quote & Category Fields"); // Alert user of error
  }
}

// ==========Function to export quotes as JSON=======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2); // Convert quotes to JSON string
  const blob = new Blob([dataStr], { type: "application/json" }); // Create a blob from the JSON string
  const url = URL.createObjectURL(blob); // Create a URL for the blob

  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = url; // Set the href to the blob URL
  downloadLink.download = "qoutes.json"; // Set the download file name
  document.body.appendChild(downloadLink); // Append link to the body
  downloadLink.click(); // Programmatically click the link to trigger download
  document.body.removeChild(downloadLink); // Remove link after download
}

// Add an export button in the form
const exportBtn = document.getElementById("expBTN"); // Get the export button

exportBtn.addEventListener("click", exportToJsonFile); // Add click event listener to export button
document.body.appendChild(exportBtn); // Append the export button to the body

// ===================Function to handle importing quotes from a JSON file==================
function importFromJsonFile(event) {
  const fileReader = new FileReader(); // Create a FileReader object

  // On successful read of the file
  fileReader.onload = function (event) {
    try {
      const importQoutes = JSON.parse(event.target.result); // Parse imported JSON data

      quoteArray.push(...importQoutes); // Add imported quotes to the array

      saveQuotes(); // Save updated quotes to local storage
      alert("Quotes imported successfully!"); // Alert user of success
    } catch (error) {
      alert("Error importing quotes: Invalid JSON format."); // Alert user of error
    }
  };
  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]); // Read the file
}

// Add file input for importing JSON
const importInput = document.getElementById("importFile"); // Get the import file input

importInput.onchange = importFromJsonFile; // Set onchange event for the import input

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter"); // Get the category filter element
  // Create new array with the unique categories from the quoteArray
  const uniqueCategories = [
    ...new Set(quoteArray.map((quote) => quote.category)), // Create a Set to ensure unique categories
  ];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option"); // Create a new option element
    option.value = category; // Set value for the option
    option.textContent = category; // Set text for the option
    categoryFilter.appendChild(option); // Append option to the category filter
  });
}

// Function to filter quotes by category and display them
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value; // Get selected category
  const quoteDisplay = document.getElementById("quoteDisplay"); // Get quote display element
  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quoteArray // Show all quotes if "all" is selected
      : quoteArray.filter((quote) => quote.category === selectedCategory); // Filter quotes by category

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // Get a random index from filtered quotes
    const randomQuote = filteredQuotes[randomIndex]; // Select a random quote
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`; // Display the selected quote

    // Save last selected category filter and last displayed quote
    localStorage.setItem("lastFilter", selectedCategory); // Save the last selected filter
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote)); // Save the last displayed quote
  } else {
    quoteDisplay.innerHTML = "No quotes available for this category."; // Inform user if no quotes available
  }
}

// Load last selected category filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter"); // Get last selected filter from local storage
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter; // Set the filter to the last selected value
    filterQuotes(); // Apply the last selected filter
  }
}

// Simulate fetching quotes from a server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Simulated server endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Handle error for network response
    }
    const serverQuotes = await response.json(); // Parse JSON response
    console.log("Fetched server quotes:", serverQuotes); // Log fetched quotes
    return serverQuotes; // Return fetched quotes
  } catch (error) {
    console.error("Error fetching server quotes:", error); // Log fetch error
  }
}

// Function to sync local quotes with server quotes using async/await
async function syncQuotesWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer(); // Fetch quotes from server
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || []; // Get local quotes from storage

    // Merge server quotes with
