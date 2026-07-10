// =====================================================
// FINALSCANPRO
// upload.js
// Handles file uploads and drag & drop
// =====================================================


// =====================================================
// Global Variables
// =====================================================


let mainDocument = null;

let referenceDocuments = [];

// =====================================================
// DOM Elements
// =====================================================

const mainInput =
    document.getElementById("mainFileInput");

const referenceInput =
    document.getElementById("referenceFileInput");

const mainButton =
    document.getElementById("mainFileButton");

const referenceButton =
    document.getElementById("referenceFileButton");

const mainList =
    document.getElementById("mainFileList");

const referenceList =
    document.getElementById("referenceFileList");

const scanButton =
    document.getElementById("scanButton");

const mainUploadZone =
    document.getElementById("mainUploadZone");

const referenceUploadZone =
    document.getElementById("referenceUploadZone");

const allowedExtensions = ["pdf", "doc", "docx", "txt"];


// =====================================================
// Validation
// =====================================================

function isValidFile(file) {

    const extension = file.name.split(".").pop().toLowerCase();

    return allowedExtensions.includes(extension);

}


// =====================================================
// Open File Dialog Events
// =====================================================

mainButton.addEventListener("click", (event) => {

    event.stopPropagation();

    mainInput.click();

});

referenceButton.addEventListener("click", (event) => {

    event.stopPropagation();

    referenceInput.click();

});


mainUploadZone.addEventListener("click", () => {

    mainInput.click();

});

referenceUploadZone.addEventListener("click", () => {

    referenceInput.click();

});

// =====================================================
// Display Functions
// =====================================================

function displayMainFile() {

    mainList.innerHTML = "";

    const div = document.createElement("div");

    div.className = "file-item";

    div.innerHTML = `
	<span>${mainDocument.name}</span>
        <span class="file-remove">✕</span>
    `;

    div.querySelector(".file-remove")
        .onclick = () => {

            mainDocument = null;

            mainInput.value = "";

            displayMainFile();

            updateScanButton();

        };

    mainList.appendChild(div);

}


function displayReferenceFiles() {

    referenceList.innerHTML = "";

    referenceDocuments.forEach((file,index)=>{

        const div = document.createElement("div");

        div.className = "file-item";

        div.innerHTML = `
            <span>${file.name}</span>
            <span class="file-remove">✕</span>
        `;

        div.querySelector(".file-remove")
            .onclick = ()=>{

                referenceDocuments.splice(index,1);

                displayReferenceFiles();

                updateScanButton();

            };

        referenceList.appendChild(div);

    });

}


function showInvalidFileMessage(fileName) {

    alert(
        `"${fileName}" is not a supported file type.\n\n` +
        "Please upload only PDF, DOC, DOCX or TXT files."
    );

}
// =====================================================
// Scan Button
// =====================================================

function updateScanButton() {

	console.log("Scan function Triggered")

    	console.log("updateScanButton() called");

    	console.log("mainDocument =", mainDocument);

    	console.log("referenceDocuments =", referenceDocuments);
	

    const ready = mainDocument !== null && referenceDocuments.length > 0;

	console.log("ready =", ready);

    scanButton.disabled = !ready;

    scanButton.classList.toggle("enabled",ready);

}



function addReferenceFile(file) {

    if (!isValidFile(file)) {

        showInvalidFileMessage(file.name);
        return;

    }

    if (referenceDocuments.length >= 5)
        return;

    referenceDocuments.push(file);

}

//=====================================================
//Drag & Drop
//=====================================================


//=====================================================1

mainInput.addEventListener("change", async () => {

    if (mainInput.files.length === 0)
        return;

    const file = mainInput.files[0];

    if (!isValidFile(file)) {

        showInvalidFileMessage(file.name);

        mainInput.value = "";

        return;

    }

mainDocument = file;

const text = await readDocument(file);

//console.log(text);

displayMainFile();

updateScanButton();

});

//=====================================================2


referenceInput.addEventListener("change", () => {

	const newFiles = [...referenceInput.files];

	newFiles.forEach(addReferenceFile);

	displayReferenceFiles();

	updateScanButton();

referenceInput.value = "";
	
});

//=====================================================3


mainUploadZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    mainUploadZone.classList.add("drag-over");

});


//=====================================================4

mainUploadZone.addEventListener("dragleave", () => {

    mainUploadZone.classList.remove("drag-over");

});

//=====================================================5

mainUploadZone.addEventListener("drop", async (event) => {

    event.preventDefault();

    mainUploadZone.classList.remove("drag-over");

    if (event.dataTransfer.files.length === 0)
        return;

    const file = event.dataTransfer.files[0];

    if (!isValidFile(file)) {

        showInvalidFileMessage(file.name);

        mainInput.value = "";

        return;

    }

    mainDocument = file;

	const document = await analyzeDocument(file);

	//console.log(document);
	
	console.log(document.fileName);

	console.log(document.wordCount);

	console.log(document.paragraphs);

	console.log(document.filesize)

	
	/*const text = await readDocument(file);

	const cleaned = cleanText(text);

	//console.log(cleaned);

	console.log("Words:", countWords(cleaned));

	console.log("Characters:", countCharacters(cleaned));

	console.log(splitIntoParagraphs(cleaned));

	console.log(splitIntoSentences(cleaned));*/

    displayMainFile();

    updateScanButton();

});

//=====================================================6

referenceUploadZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    referenceUploadZone.classList.add("drag-over");

});

//=====================================================7

referenceUploadZone.addEventListener("dragleave", () => {

    referenceUploadZone.classList.remove("drag-over");

});


//=====================================================8
referenceUploadZone.addEventListener("drop", (event) => {

    event.preventDefault();

    referenceUploadZone.classList.remove("drag-over");

    if (event.dataTransfer.files.length === 0)
        return;

    const droppedFiles = [...event.dataTransfer.files];

	droppedFiles.forEach(addReferenceFile);

	displayReferenceFiles();

	updateScanButton();

});

//=====================================================
