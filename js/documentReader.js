// =====================================================
// FINALSCANPRO
// documentReader.js
// Universal Document Reader
// =====================================================


// -----------------------------------------------------
// Get File Extension
// -----------------------------------------------------

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "libraries/pdf.worker.min.js";

function getExtension(fileName) {

    return fileName
        .split(".")
        .pop()
        .toLowerCase();

}

// -----------------------------------------------------
// TXT Reader
// -----------------------------------------------------

async function readTextFile(file) {

    return await file.text();

}


// -----------------------------------------------------
// DOCX Reader
// -----------------------------------------------------

async function readWordFile(file) {

    const arrayBuffer =
        await file.arrayBuffer();

    const result =
        await mammoth.extractRawText({

            arrayBuffer

        });
	
	console.log("We have read Word");

	console.log(result);
    return result.value;

}


// -----------------------------------------------------
// PDF Reader
// -----------------------------------------------------

async function readPdfFile(file) {

    const arrayBuffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({

            data: arrayBuffer

        }).promise;

    let text = "";

    for (

        let pageNumber = 1;

        pageNumber <= pdf.numPages;

        pageNumber++

    ) {

        const page =
            await pdf.getPage(pageNumber);

        const content =
            await page.getTextContent();

        text += content.items

            .map(item => item.str)

            .join(" ");

        text += "\n";

    }

    text = cleanExtractedText(text);

    return text;

}

function cleanExtractedText(text) {

    return text

        // Join words split across lines

        .replace(/-\n/g, "")

        // Join broken lines

        .replace(/\n/g, " ")

        // Remove multiple spaces

        .replace(/\s+/g, " ")

        // Remove page numbers

        .replace(/Page\s+\d+/gi, "")

        // Remove isolated numbers

        .replace(/\b\d+\b/g, "")

        .trim();

}

// -----------------------------------------------------
// Main Reader
// -----------------------------------------------------

async function readDocument(file) {

    switch (getExtension(file.name)) {

        case "txt":

            return await readTextFile(file);

        case "docx":

            return await readWordFile(file);

        case "pdf":

            return await readPdfFile(file);

        default:

            throw new Error(
                "Unsupported document type."
            );

    }

}

console.log("Mammoth loaded:", typeof mammoth);