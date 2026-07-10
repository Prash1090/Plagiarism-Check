// =====================================================
// FINALSCANPRO
// comparisonEngine.js
// Stage 2 - Sentence Similarity Comparison
// =====================================================


// =====================================================
// Normalize Sentence
// =====================================================

function normalizeSentence(sentence) {

    return sentence

        .replace(/\r/g, " ")

        .replace(/\n/g, " ")

        .replace(/\u00A0/g, " ")

        .replace(/-\s+/g, "-")

        .replace(/\s*-\s*/g, "-")

        .replace(/\s+/g, " ")

        .replace(/[^\w\s-]/g, "")

        .toLowerCase()

        .trim();

}

// =====================================================
// Calculate Sentence Similarity
// =====================================================

function calculateSimilarity(sentenceA, sentenceB) {

    const wordsA =

normalizeSentence(sentenceA)

.split(" ")

.filter(word =>

    !STOP_WORDS.has(word)

)

.map(stem);

const wordsB =

normalizeSentence(sentenceB)

.split(" ")

.filter(word =>

    !STOP_WORDS.has(word)

)

.map(stem);

    const uniqueWords =
        [...new Set([...wordsA, ...wordsB])];

    let matches = 0;

    uniqueWords.forEach(word => {

        if (
            wordsA.includes(word) &&
            wordsB.includes(word)
        ) {

            matches++;

        }

    });

    if (uniqueWords.length === 0)
        return 0;

    return Math.round(
        (matches / uniqueWords.length) * 100
    );

}


// =====================================================
// Compare Documents
// =====================================================

// =====================================================
// Compare Documents
// One Best Match Per Main Sentence Per Reference Document
// =====================================================

function compareDocuments(mainDocument, referenceDocuments) {

    console.log("compareDocuments() started");

    const results = [];

    referenceDocuments.forEach(reference => {

        mainDocument.sentences.forEach((mainSentence, mainIndex) => {

            let bestMatch = null;

            reference.sentences.forEach((referenceSentence, referenceIndex) => {

                const similarity =
                    calculateSimilarity(
                        mainSentence,
                        referenceSentence
                    );

                if (

                    bestMatch === null ||

                    similarity > bestMatch.similarity

                ) {

                    bestMatch = {

                        mainSentence,

                        mainSentenceIndex: mainIndex,

                        referenceSentence,

                        referenceSentenceIndex: referenceIndex,

                        referenceFile:
                            reference.fileName,

                        referenceSentenceCount: reference.sentences.length,

			similarity

                    };

                }

            });

            results.push(bestMatch);

        });

    });

    results.sort(

        (a, b) => b.similarity - a.similarity

    );

    return results;

}