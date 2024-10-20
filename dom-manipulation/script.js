let container = document.getElementById("quoteDisplay");
let btn = document.getElementById("newQuote");
let exportBtn = document.getElementById("expBTN");

let quoteArray = [
  { text: "It takes courage to grow up and become who you really are.— E.E. Cummings", category: "Motivational" },
  { text: "The best preparation for tomorrow is doing your best today. H. Jackson Brown", category: "Inspirational" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.― Albert Einstein", category: "Humor" },
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

// Function to add a quote to the array
function addQuote() {
  let inQuote = document.getElementById("newQuoteText").value.trim();
  let inCategory = document.getElementById("newQuoteCategory").value.trim();
  if (inQuote && inCategory) {
    quoteArray.push({ text: inQuote, category: inCategory });
    saveQuotes();
    alert("You successfully added a new quote.");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("You must fill both quote & category fields.");
  }
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quoteArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// Initialize on page load
window.onload = function () {
  loadQuotes();
  showRandomQuote(); // Show a random quote on initial load
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  exportBtn.addEventListener("click", exportToJsonFile);
  btn.addEventListener("click", showRandomQuote);
};
