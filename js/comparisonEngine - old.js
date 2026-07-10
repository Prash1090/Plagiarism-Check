// =====================================================
// FINALSCANPRO
// comparisonEngine.js
// Stage 1 - Exact sentence comparison
// =====================================================


function compareDocuments(mainDocument, referenceDocuments) {

    const results = [];

    mainDocument.sentences.forEach((mainSentence, mainIndex) => {

        referenceDocuments.forEach(reference => {

            reference.sentences.forEach((referenceSentence, referenceIndex) => {

                if (
                    mainSentence.trim().toLowerCase() ===
                    referenceSentence.trim().toLowerCase()
                ) {

                    results.push({

                        mainSentence,

                        mainSentenceIndex: mainIndex,

                        referenceFile: reference.fileName,

                        referenceSentence,

                        referenceSentenceIndex: referenceIndex,

                        similarity: 100

                    });

                }

            });

        });

    });

    return results;

}