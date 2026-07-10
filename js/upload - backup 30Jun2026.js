// ----------------------------------------------------
// Selected Files
// ----------------------------------------------------

let mainDocument = null;

let referenceDocuments = [];


// ----------------------------------------------------
// Elements
// ----------------------------------------------------

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


// ----------------------------------------------------
// Open File Dialogs
// ----------------------------------------------------

mainButton.addEventListener("click", (event) => {

    event.stopPropagation();

    mainInput.click();

});

referenceButton.addEventListener("click", (event) => {

    event.stopPropagation();

    referenceInput.click();

});


// ----------------------------------------------------
// Main Document
// ----------------------------------------------------

mainInput.addEventListener("change", () => {

    if (mainInput.files.length === 0)
        return;

    const file = mainInput.files[0];

    if (!isValidFile(file)) {

        alert(`"${file.name}" is not a supported file type.\n\nPlease upload only PDF, DOC, DOCX or TXT files.`);

        mainInput.value = "";

        return;

    }

    mainDocument = file;

    displayMainFile();

    updateScanButton();

});


function isValidFile(file) {

    const extension = file.name.split(".").pop().toLowerCase();

	console.log(file.name)
	console.log(file.name.split(".").pop().toLowerCase());


    return allowedExtensions.includes(extension);



}

// ----------------------------------------------------
// Reference Documents
// ----------------------------------------------------

referenceInput.addEventListener("change", () => {

	const newFiles = [...referenceInput.files];

	newFiles.forEach(file => {

    	if (!isValidFile(file)) {

        	alert(`"${file.name}" is not a supported file type.\n\nPlease upload only PDF, DOC, DOCX or TXT files.`);

        	return;
    }

    if (referenceDocuments.length >= 5) {
        return;
    }

    referenceDocuments.push(file);

});

displayReferenceFiles();

updateScanButton();

referenceInput.value = "";

});


// ----------------------------------------------------
// Display Main File
// ----------------------------------------------------

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


// ----------------------------------------------------
// Display Reference Files
// ----------------------------------------------------

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


// ----------------------------------------------------
// Enable Scan Button
// ----------------------------------------------------

function updateScanButton() {

    const ready =
        mainDocument !== null &&
        referenceDocuments.length > 0;

    scanButton.disabled = !ready;

    scanButton.classList.toggle(
        "enabled",
        ready
    );

}

// ----------------------------------------------------
// Main Upload Zone Highlight
// ----------------------------------------------------

mainUploadZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    mainUploadZone.classList.add("drag-over");

});


mainUploadZone.addEventListener("dragleave", () => {

    mainUploadZone.classList.remove("drag-over");

});



mainUploadZone.addEventListener("drop", (event) => {

    event.preventDefault();

    mainUploadZone.classList.remove("drag-over");

    if (event.dataTransfer.files.length === 0)
        return;

    const file = event.dataTransfer.files[0];

    if (!isValidFile(file)) {

        alert(`"${file.name}" is not a supported file type.\n\nPlease upload only PDF, DOC, DOCX or TXT files.`);

        mainInput.value = "";

        return;

    }



    mainDocument = file;

    displayMainFile();

    updateScanButton();

});


mainUploadZone.addEventListener("click", () => {

    mainInput.click();

});





referenceUploadZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    referenceUploadZone.classList.add("drag-over");

});

referenceUploadZone.addEventListener("dragleave", () => {

    referenceUploadZone.classList.remove("drag-over");

});


referenceUploadZone.addEventListener("drop", (event) => {

    event.preventDefault();

    referenceUploadZone.classList.remove("drag-over");

    if (event.dataTransfer.files.length === 0)
        return;

    const droppedFiles = [...event.dataTransfer.files];

    droppedFiles.forEach(file => {

    if (!isValidFile(file)) {

        alert(`"${file.name}" is not a supported file type.\n\nPlease upload only PDF, DOC, DOCX or TXT files.`);

        return;
    }

    if (referenceDocuments.length >= 5) {
        return;
    }

    referenceDocuments.push(file);

});


    displayReferenceFiles();

    updateScanButton();

});

