let container = document.getElementById("quoteDisplay");
let btn = document.getElementById("newQuote");

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

let index = quoteArray.length;
let randomNum = Math.floor(Math.random() * index);

// Function to show Random Quote from the array
function showRandomQuote() {
  container.innerHTML = `'${quoteArray[randomNum].text}' '${quoteArray[randomNum].category}'`;
}

// Creating Form By JS
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
  // Applying the addFunction to the Btn
  addQBtn.addEventListener("click", addQuote);
}

// Save Quotes in Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quoteArray));
}

// Load Quotes
function LoadQuotes() {
  let savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quoteArray = JSON.parse(savedQuotes);
  }
}

// Function to add a Quote to the array
async function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value;
  let inCategory = document.getElementById("newQuoteCategory").value;
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory });

    // Call saveQuotes Function to save the new quote in localStorage
    saveQuotes();
    populateCategories();

    // Post the new quote to the server
    await addQuoteAndSync({ text: inQuote, category: inCategory });

    document.getElementById("newQuoteText").value = ""; // Clear input
    document.getElementById("newQuoteCategory").value = ""; // Clear input
    alert("You Successfully added a New Quote");
  } else {
    alert("You Must Fill Both Quote & Category Fields");
  }
}

// Function to export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a download link
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
      const importQuotes = JSON.parse(event.target.result);
      quoteArray.push(...importQuotes);
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
  // Create a new array with the categories from the quoteArray
  const uniqueCategories = [
    ...new Set(quoteArray.map((quote) => quote.category)),
  ];

  categoryFilter.innerHTML = ""; // Clear existing options
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

    // Save last selected category filter and last displayed quote
    localStorage.setItem("lastFilter", selectedCategory);
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
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
    console.log("Fetched server quotes:", serverQuotes);
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching server quotes:", error);
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
    console.error("Error during conflict resolution:", error);
  }
}

// Simulate posting a quote to the server using async/await
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify(quote), // Convert the quote object to a JSON string
    });

    if (!response.ok) {
      throw new Error("Error posting quote to the server");
    }

    const data = await response.json(); // Parse JSON response
    console.log("Quote successfully posted:", data); // Log the posted quote
    return data; // Return the response data
  } catch (error) {
    console.error("Error posting quote:", error); // Log any errors
  }
}

// Example: Adding a new quote and syncing with the server
async function
