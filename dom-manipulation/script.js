// Get DOM elements for displaying quotes and buttons
let container = document.getElementById("quoteDisplay");
let btn = document.getElementById("newQuote");

// Initialize an array to hold quotes with text and categories
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

// Generate a random index for quote selection
index = quoteArray.length;
let randomNum = Math.floor(Math.random() * index);

// Function to show a random quote from the array
function showRandomQuote() {
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`;
}

// Creating a form to add new quotes dynamically
function createAddQuoteForm() {
  let container = document.createElement("div");
  container.id = "quoteForm";

  let inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote"; // Placeholder for new quote input

  let inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category"; // Placeholder for quote category input

  let addQBtn = document.createElement("button");
  addQBtn.id = "addQuoteButton";
  addQBtn.textContent = "Add Quote"; // Button to add the new quote

  // Append input fields and button to the form container
  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addQBtn);
  document.body.appendChild(container);

  // Applying the addQuote function to the button
  addQBtn.addEventListener("click", addQuote);
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("qoutes", JSON.stringify(quoteArray));
}

// Load quotes from local storage
function LoadQouts() {
  let savedQoutes = localStorage.getItem("qoutes");
  if (savedQoutes) {
    quoteArray = JSON.parse(savedQoutes); // Parse and load saved quotes
  }
}

// Function to add a new quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value;
  let inCategory = document.getElementById("newQuoteCategory").value;
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory }); // Add new quote to the array

    // Call saveQuotes function to save the new quote in localStorage
    saveQuotes();
    populateCategories(); // Update the category filter with new quotes

    inQuote = "";
    inCategory = "";
    alert("You Successfully added a New Quote"); // Notify the user
  } else {
    alert("You Must Fill Both Quote & Category Fields"); // Alert if fields are empty
  }
}

// ========== Function to export quotes as JSON =======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2); // Convert quotes to JSON
  const blob = new Blob([dataStr], { type: "application/json" }); // Create a blob for the JSON data
  const url = URL.createObjectURL(blob); // Create a URL for the blob

  // Create a download link for the JSON file
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "qoutes.json"; // Set the filename for the download
  document.body.appendChild(downloadLink);
  downloadLink.click(); // Trigger download
  document.body.removeChild(downloadLink); // Clean up the link element
}

// Add an export button in the form
const exportBtn = document.getElementById("expBTN");
exportBtn.addEventListener("click", exportToJsonFile); // Add event listener for export button
document.body.appendChild(exportBtn);

// =================== Function to handle importing quotes from a JSON file ===================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  // On successful read of the file
  fileReader.onload = function (event) {
    try {
      const importQoutes = JSON.parse(event.target.result); // Parse imported JSON

      quoteArray.push(...importQoutes); // Add imported quotes to the array

      saveQuotes(); // Save updated quotes to local storage
      alert("Quotes imported successfully!"); // Notify the user
    } catch (error) {
      alert("Error importing quotes: Invalid JSON format."); // Alert on parsing error
    }
  };
  // Read the selected file as text
  fileReader.readAsText(event.target.files[0]);
}

// Add file input for importing JSON
const importInput = document.getElementById("importFile");
importInput.onchange = importFromJsonFile; // Attach change event handler for file input

// Populate the category filter dropdown with unique categories
function populateCategories() {
  let categoryFilter = document.getElementById("categoryFilter");
  // Create a new array with unique category items from the quoteArray
  const uniqueCategories = [
    ...new Set(quoteArray.map((quote) => quote.category)),
  ];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category; // Set the option value
    option.textContent = category; // Set the option text
    categoryFilter.appendChild(option); // Append option to the filter
  });
}

// Function to filter quotes by category and display them
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quoteArray // Show all quotes if "all" is selected
      : quoteArray.filter((quote) => quote.category === selectedCategory); // Filter by category

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`; // Display selected quote

    // Save last selected category filter and last displayed quote
    localStorage.setItem("lastFilter", selectedCategory);
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.innerHTML = "No quotes available for this category."; // Message if no quotes found
  }
}

// Load last selected category filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    document.getElementById("categoryFilter").value = lastFilter; // Set dropdown to last filter
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
    console.log("Fetched server quotes:", serverQuotes);
    return serverQuotes; // Return fetched quotes
  } catch (error) {
    console.error("Error fetching server quotes:", error); // Log fetch errors
  }
}

// Function to sync local quotes with server quotes using async/await
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

// Call sync function periodically to simulate real-time updates
setInterval(() => {
  syncQuotesWithServer();
}, 15000); // Sync every 15 seconds

// Resolve conflicts between server and local quotes
async function resolveConflicts() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const updatedLocalQuotes = localQuotes.map((localQuote) => {
      const serverMatch = serverQuotes.find(
        (serverQuote) => serverQuote.id === localQuote.id
      );
      return serverMatch ? serverMatch : localQuote; // Use server version if there's a conflict
    });

    // Save updated local storage after resolving conflicts
    localStorage.setItem("quotes", JSON.stringify(updatedLocalQuotes));
    console.log("Conflicts resolved and local storage updated.");
  } catch (error) {
    console.error
