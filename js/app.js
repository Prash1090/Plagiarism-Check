const uploadButton = document.getElementById("uploadBtn");
const processButton = document.getElementById("processBtn");
const resetButton = document.getElementById("resetBtn");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const viewer = document.getElementById("viewer");
const statusDiv = document.getElementById("documentStatus");
const resultsSection = document.getElementById("resultsSection");

//processButton.addEventListener("click", processPages);
nextButton.addEventListener("click", nextPage);
prevButton.addEventListener("click", previousPage);
//resetButton.addEventListener("click", resetPages);
viewer.addEventListener("click", viewerClick);

//Global variables
let pages = [];
let highlightedPages = [];
let currentPage = 0;
let isProcessed = 0;

/*
uploadButton.addEventListener("click", () => {
  const fileInput = document.getElementById("file-input");
  fileInput.click();
});
*/

//Upload and load text
function upload_click(e) {
  //override the default action
  //e.preventDefault();
  const fileInput = document.getElementById("file-input");
  fileInput.click();
}

//If there is a change in the input (a file selected)
document.getElementById("file-input").addEventListener("change", function () {
  //If multiple files chosen, get the first file.
  //alert("I am here");
  isProcessed = 0;
  resetViewer();

  var file = this.files[0];
  let fileType = file.type;
  const { name } = file;
  const ext = name.toLowerCase().substring(name.lastIndexOf(".") + 1);

  //alert(file);
  //alert(ext);

  let validExtensionsTxt = ["text/plain"];
  let validExtensionsPdfDoc = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (validExtensionsPdfDoc.includes(fileType)) {
    const docToText = new DocToText();
    docToText
      .extractToText(file, ext)
      .then(function (text) {
        // text
        console.log(text);
        var regex = /(\s|\n|\r)+,/gim;
        var text_processed = text.trim().replace(regex, "\n");
        //contentDiv.textContent = text_processed;
        text = text_processed;
        update_reader(text);
      })
      .catch(function (error) {
        alert(error);
        message_overlay(
          '<i class="fa-solid fa-circle-exclamation"></i>&nbsp;Error reading file!',
        );
      });
  } else if (validExtensionsTxt.includes(fileType)) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      // /var content = reader.result;
      //Here the content has been read successfuly
      //console.log( reader.result);
      //document.getElementById('text').textContent =  reader.result;
      //$("#text").val(reader.result);
      //contentDiv.textContent = reader.result;
      text = text_processed;
      update_reader(text);
    };
  } else {
    //alert("unsupported firmat");
    //message_overlay(
    //  '<i class="fa-solid fa-circle-exclamation"></i>&nbsp;Unsupported file format!',
    //);
  }
});

function update_reader(text) {
  const wordsPerPage = 250;

  pages = [];
  currentPage = 0;

  //alert("I am here");
  // Split document into words
  const words = text.trim().split(/\s+/);

  // Create 250-word pages
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);

    pages.push(pageWords.join(" "));
  }
  //alert(pages);
  showPage();
}

function showPage() {
  document.getElementById("viewer").innerText = pages[currentPage];

  document.getElementById("pageNumber").innerText =
    `Page ${currentPage + 1} of ${pages.length}`;

  document.getElementById("prevButton").disabled = currentPage === 0;

  document.getElementById("nextButton").disabled =
    currentPage === pages.length - 1;
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    if (isProcessed == 1) {
      showProcessedPage();
    } else {
      showPage();
    }
    /*
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    */
  }
}

function previousPage() {
  if (currentPage > 0) {
    currentPage--;
    if (isProcessed == 1) {
      showProcessedPage();
    } else {
      showPage();
    }
    /*
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    */
  }
}

function resetPages() {
  currentPage = 0;
  isProcessed = 0;
  showPage("Please Upload a Document");
  resetViewer();
}

function resetViewer() {
  currentPage = 0;
  isProcessed = 0;
  statusDiv.textContent = "";
  update_reader("Please Upload a Document");
  // Show result panel
  document.getElementById("resultContent").style.display = "none";
  statusDiv.style.display = "none";

  // Show result panel
  document.getElementById("resultHeader").style.display = "block";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processPages() {
  resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  if (isProcessed < 1) {
    statusDiv.style.display = "block";
    statusDiv.className = "status-badge processing";
    statusDiv.textContent = "0% Processed...";
    highlightedPages = [];

    const { mainAnalysis, matches, statistics } = await startScanAsync();

    bestMatches = getBestMatches(matches);

    buildViewer(mainAnalysis, bestMatches);

    /*
    for (let i = 0; i < pages.length; i++) {
      // Simulate processing
      await sleep(100);

      let sentences = analyzePage(pages[i]);
      compareDocuments(sentences, referenceDocuments) 

      highlightedPages.push(addRandomHighlights(pages[i]));

      // Calculate progress
      const percentage = Math.round(((i + 1) / pages.length) * 100);

      statusDiv.textContent = `${percentage}% Processed...`;
    }
    */

    //highlightedPages.push(addHighlights(pages[i], matches));

    currentPage = 0;
    isProcessed = 1;
    //showProcessedPage();
    statusDiv.className = "status-badge match";
    statusDiv.textContent = "18% Match";
  }
}

function showProcessedPage() {
  const viewer = document.getElementById("viewer");

  viewer.innerHTML = highlightedPages[currentPage];

  document.getElementById("pageNumber").textContent =
    `Page ${currentPage + 1} of ${pages.length}`;

  document.getElementById("prevButton").disabled = currentPage === 0;

  document.getElementById("nextButton").disabled =
    currentPage === pages.length - 1;
}

function addRandomHighlights(text) {
  const words = text.split(/\s+/);

  let html = "";
  let i = 0;

  let matchId = 1;

  while (i < words.length) {
    // Randomly decide whether to start a match
    if (Math.random() < 0.08) {
      // Match between 4 and 12 words
      const length = Math.floor(Math.random() * 9) + 4;

      const end = Math.min(i + length, words.length);

      const highlightedText = words.slice(i, end).join(" ");

      // Red or yellow
      const severity = Math.random() < 0.5 ? "high" : "medium";

      // Generate fake similarity score
      const score =
        severity === "high"
          ? Math.floor(Math.random() * 16) + 85
          : Math.floor(Math.random() * 25) + 55;

      html += `
                <span
                    class="plagiarism-match ${severity}"
                    data-match-id="${matchId}"
                    data-score="${score}"
                    data-text="${escapeHtml(highlightedText)}"
                >
                    ${escapeHtml(highlightedText)}
                </span>
            `;

      html += " ";
      matchId++;
      matchId = matchId > 4 ? 1 : matchId;
      i = end;
    } else {
      html += escapeHtml(words[i]) + " ";

      i++;
    }
  }

  return html;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getBestMatches(matches) {
  const bestMatches = new Map();

  matches.forEach((match) => {
    const existing = bestMatches.get(match.mainSentenceIndex);

    if (!existing || match.similarity > existing.similarity) {
      bestMatches.set(match.mainSentenceIndex, match);
    }
  });

  return bestMatches;
}

function buildViewer(mainAnalysis, bestMatches) {
  const sentencesPerPage = 20;

  highlightedPages = [];

  let pageHtml = "";
  let sentenceCount = 0;

  mainAnalysis.sentences.forEach((sentence, index) => {
    const match = bestMatches.get(index);

    // No significant match
    if (!match || match.similarity < 60) {
      pageHtml += escapeHtml(sentence) + " ";
    } else {
      // Decide highlight colour
      const severity = match.similarity >= 80 ? "high" : "medium";

      pageHtml += `
                <span
                    class="plagiarism-match ${severity}"
                    data-sentence-index="${index}"
                >
                    ${escapeHtml(sentence)}
                </span>
            `;

      pageHtml += " ";
    }

    sentenceCount++;

    // Page full
    if (sentenceCount === sentencesPerPage) {
      highlightedPages.push(pageHtml);

      pageHtml = "";
      sentenceCount = 0;
    }
  });

  // Add remaining sentences
  if (pageHtml !== "") {
    highlightedPages.push(pageHtml);
  }

  // Start at first page
  currentPage = 0;

  showProcessedPage();
}

function addHighlights(text, matches) {
  let html = escapeHtml(text);

  const significantMatches = matches.filter((match) => match.similarity >= 60);

  significantMatches.forEach((match, index) => {
    const sentence = match.mainSentence;

    const severity = match.similarity >= 80 ? "high" : "medium";

    const highlightedSentence = `
            <span
                class="plagiarism-match ${severity}"
                data-match-id="${index}"
                data-score="${match.similarity}"
            >
                ${escapeHtml(sentence)}
            </span>
        `;

    html = html.replace(escapeHtml(sentence), highlightedSentence);
  });

  return html;
}

function viewerClick(event) {
  const matchElement = event.target.closest(".plagiarism-match");
  console.log(matchElement);
  if (!matchElement) {
    return;
  }

  const sentenceIndex = Number(matchElement.dataset.sentenceIndex);
  console.log(sentenceIndex);
  const match = bestMatches.get(sentenceIndex);
  console.log(match);
  if (match) {
    showMatchDetails(match);
  }
}

function showMatchDetails(match) {
  if (!match) {
    return;
  }

  // Show result panel
  document.getElementById("resultContent").style.display = "block";

  // Hide default header
  document.getElementById("resultHeader").style.display = "none";

  // Similarity score
  document.getElementById("resultScore").textContent =
    match.similarity + "% Similarity";

  // Source document
  document.getElementById("resultSource").textContent = match.referenceFile;

  // Match type
  let matchType = "";

  if (match.similarity === 100) {
    matchType = "Exact Match";
  } else if (match.similarity >= 80) {
    matchType = "High Similarity";
  } else if (match.similarity >= 60) {
    matchType = "Possible Similarity";
  } else {
    matchType = "Low Similarity";
  }

  document.getElementById("resultType").textContent = matchType;

  // Words matched
  document.getElementById("resultWords").textContent =
    `${countWords(match.mainSentence)} words`;

  // Your text
  document.getElementById("resultYourText").textContent = match.mainSentence;

  // Source text
  document.getElementById("resultSourceText").textContent =
    match.referenceSentence;

  // Badge
  const badge = document.getElementById("resultBadge");

  if (match.similarity >= 80) {
    badge.textContent = "High Similarity";
    badge.className = "badge-high";
  } else {
    badge.textContent = "Possible Similarity";
    badge.className = "badge-medium";
  }
}

function viewerClick1(event) {
  const matchElement = event.target.closest(".plagiarism-match");

  if (matchElement) {
    const matchId = matchElement.dataset.matchId;
    const score = matchElement.dataset.score;
    const text = matchElement.dataset.text;

    const match = matches.find((m) => m.id == matchId);

    if (match) {
      showMatchDetails(match);
    }
  }
}

function showMatchDetails1(match) {
  if (!match) {
    return;
  }

  // Show result panel
  document.getElementById("resultContent").style.display = "block";

  // Show result panel
  document.getElementById("resultHeader").style.display = "none";

  // Similarity score
  document.getElementById("resultScore").textContent =
    match.score + "% Similarity";

  // Source
  document.getElementById("resultSource").textContent = match.source;

  // Match type
  document.getElementById("resultType").textContent = match.type;

  // Words matched
  document.getElementById("resultWords").textContent = match.words;

  // Your text
  document.getElementById("resultYourText").textContent = match.text;

  // Source text
  document.getElementById("resultSourceText").textContent = match.sourceText;

  // Badge
  const badge = document.getElementById("resultBadge");

  if (match.severity === "high") {
    badge.textContent = "High Similarity";
    badge.className = "badge-high";
  } else {
    badge.textContent = "Possible Similarity";
    badge.className = "badge-medium";
  }
}

const matches = [
  {
    id: 1,
    severity: "high",
    score: 94,
    source: "machine-learning-research.pdf",
    type: "High textual similarity",
    words: 24,

    text: `Machine learning is a branch of artificial intelligence that
        enables computer systems to learn patterns from data without
        being explicitly programmed for every possible situation.`,

    sourceText: `Machine learning is an area of artificial intelligence
        that allows computer systems to identify patterns from data without
        being explicitly programmed for each individual situation.`,
  },

  {
    id: 2,
    severity: "medium",
    score: 68,
    source: "natural-language-processing.pdf",
    type: "Similar wording",
    words: 11,

    text: `Natural language processing allows computers to analyse,
        understand and generate human language.`,

    sourceText: `Natural language processing enables computer systems
        to analyse, understand and produce human language.`,
  },

  {
    id: 3,
    severity: "high",
    score: 91,
    source: "cloud-computing-guide.pdf",
    type: "High textual similarity",
    words: 19,

    text: `Cloud platforms provide computing resources that can automatically
        scale depending on the number of users accessing an application.`,

    sourceText: `Cloud computing platforms provide resources that can
        automatically scale according to the number of users accessing
        an application.`,
  },

  {
    id: 4,
    severity: "medium",
    score: 72,
    source: "docker-containers.pdf",
    type: "Paraphrased match",
    words: 20,

    text: `Containers package an application together with its dependencies
        so that the application can run consistently across different
        computing environments.`,

    sourceText: `Containers bundle applications with their required
        dependencies, allowing software to run consistently across
        different computing environments.`,
  },
];
