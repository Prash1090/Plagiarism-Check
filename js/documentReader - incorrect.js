// =====================================================
// FINALSCANPRO
// documentReader.js
// Reads different document formats
// =====================================================

async function extractText(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    switch (extension) {

        case "txt":

            return await readTxt(file);

        case "docx":

            return await readDocx(file);

        default:

            throw new Error(
                "Unsupported file type."
            );

    }



}


async function readTxt(file) {

    return await file.text();

}

async function readDocx(file) {

    const arrayBuffer =
        await file.arrayBuffer();

    const result =
        await mammoth.extractRawText({

            arrayBuffer

        });

    return result.value;

}
