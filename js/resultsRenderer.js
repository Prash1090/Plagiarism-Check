// =====================================================
// FINALSCANPRO
// resultsRenderer.js
// Displays scan results
// =====================================================

function addTableRow(table, title, values, overall) {

    const row = document.createElement("tr");

    row.innerHTML = `<td>${title}</td>`;

    values.forEach(value => {row.innerHTML += `<td>${value}</td>`;});

    row.innerHTML += `<td><strong>${overall}</strong></td>`;

    table.appendChild(row);

}

function renderSummaryTable(statistics, matches) {

    const resultsContainer = document.getElementById("summaryTable");

    resultsContainer.innerHTML = "";

    const table = document.createElement("table");

    table.className = "results-table";

    const header = document.createElement("tr");

    header.innerHTML = `<th>Statistic</th>`;

    Object.keys(statistics.referenceStatistics)

    .forEach(file => {header.innerHTML += `<th>${file}</th>`;});

    header.innerHTML += `<th>Overall</th>`;

    table.appendChild(header);


// ======================================
// Collect file statistics
// ======================================

const files = Object.keys(statistics.referenceStatistics);

// Reference Sentences

addTableRow(

    table,

    "Reference Sentences",

    files.map(file =>
        statistics.referenceStatistics[file].referenceSentences
    ),

    files.reduce(

        (total, file) =>

            total +

            statistics.referenceStatistics[file].referenceSentences,

        0

    )

);

// Exact Matches

addTableRow(

    table,

    "Exact Matches",

    files.map(file =>
        statistics.referenceStatistics[file].exactMatches
    ),

    statistics.exactMatches

);


// High Matches

addTableRow(

    table,

    "High Matches",

    files.map(file =>
        statistics.referenceStatistics[file].highMatches
    ),

    statistics.highMatches

);


// Medium Matches

addTableRow(

    table,

    "Medium Matches",

    files.map(file =>
        statistics.referenceStatistics[file].mediumMatches
    ),

    statistics.mediumMatches

);


// Low Matches

addTableRow(

    table,

    "Low Matches",

    files.map(file =>
        statistics.referenceStatistics[file].lowMatches
    ),

    statistics.lowMatches

);

// No Matches

addTableRow(

    table,

    "No Matches",

    files.map(file =>
        statistics.referenceStatistics[file].noMatches
    ),

    statistics.noMatches

);


// Highest Similarity

addTableRow(

    table,

    "Highest Similarity",

    files.map(file =>
        statistics.referenceStatistics[file].highestSimilarity + "%"
    ),

    statistics.highestSimilarity + "%"

);


	resultsContainer.appendChild(table);

	const note = document.createElement("p");

	note.className = "comparison-note";

	note.innerHTML = `<strong>Each of the ${matches.length / files.length} sentences in the main document was compared with every sentence in each reference document. </strong>`;

	resultsContainer.appendChild(note);

}



function renderResults(matches, statistics) {

    const resultsSection =
        document.getElementById("resultsSection");

    const matchCount =
        document.getElementById("matchCount");

    const resultsList =
        document.getElementById("resultsList");

resultsList.innerHTML = "";

	const visibleMatches = matches.filter(match => match.similarity >= 10);


    resultsSection.classList.remove("hidden");

renderSummaryTable(statistics, matches);

	matchCount.innerHTML = "";

	matchCount.innerHTML = `

<ul class="snapshot-list">

    <li>
        <strong>Matching Sentences:</strong>
        ${statistics.totalMatches}  out of
    ${statistics.totalComparisons}
    checked
    </li>

    <li>
        <strong>Highest Similarity:</strong>
        ${statistics.highestSimilarity}%
    </li>

    <li>
        <strong>Average Similarity:</strong>
        ${statistics.averageSimilarity}%
    </li>

</ul>

`;


    if (matches.length === 0) {

        resultsList.innerHTML =

            "<p>No matching text found.</p>";

        return;

    }

// ==========================================
// Group matches by reference document
// ==========================================

const groupedMatches = {};

visibleMatches.forEach(match => {

    if (!groupedMatches[match.referenceFile]) {

        groupedMatches[match.referenceFile] = [];

    }

    groupedMatches[match.referenceFile].push(match);

});


// ==========================================
// Display each reference document
// ==========================================

Object.keys(groupedMatches).forEach(file => {

    const heading =
        document.createElement("h3");

    heading.className =
        "reference-heading";

    heading.innerHTML =   `Matching Sentences from 📄<strong>${file}</strong>`;
    

    resultsList.appendChild(heading);


const table =
    document.createElement("table");

table.className =
    "match-table";

table.innerHTML = `

<tr>

    <th>Main Document</th>

    <th>Reference Document</th>

    <th>Similarity</th>

</tr>

`;

groupedMatches[file].forEach(match => {

let colourClass = "";

if (match.similarity === 100)

    colourClass = "similarity-exact";

else if (match.similarity >= 80)

    colourClass = "similarity-very-high";

else if (match.similarity >= 60)

    colourClass = "similarity-high";

else if (match.similarity >= 40)

    colourClass = "similarity-medium";

else if (match.similarity >= 20)

    colourClass = "similarity-low";

else if (match.similarity > 0)

    colourClass = "similarity-very-low";

else

    colourClass = "similarity-none";

    table.innerHTML += `

<tr>

    <td>

        ${match.mainSentence}

    </td>

    <td>

        ${match.referenceSentence}

    </td>

    <td>

        <span class="${colourClass}">

            ${match.similarity}%

        </span>

    </td>

</tr>

`;

});

resultsList.appendChild(table);

});

}

    