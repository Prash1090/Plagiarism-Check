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
  const wordsA = normalizeSentence(sentenceA)
    .split(" ")

    .filter((word) => !STOP_WORDS.has(word))

    .map(stem);

  const wordsB = normalizeSentence(sentenceB)
    .split(" ")

    .filter((word) => !STOP_WORDS.has(word))

    .map(stem);

  const uniqueWords = [...new Set([...wordsA, ...wordsB])];

  let matches = 0;

  uniqueWords.forEach((word) => {
    if (wordsA.includes(word) && wordsB.includes(word)) {
      matches++;
    }
  });

  if (uniqueWords.length === 0) return 0;

  return Math.round((matches / uniqueWords.length) * 100);
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

  referenceDocuments.forEach((reference) => {
    mainDocument.sentences.forEach((mainSentence, mainIndex) => {
      let bestMatch = null;

      reference.sentences.forEach((referenceSentence, referenceIndex) => {
        const similarity = calculateSimilarity(mainSentence, referenceSentence);

        if (bestMatch === null || similarity > bestMatch.similarity) {
          bestMatch = {
            mainSentence,

            mainSentenceIndex: mainIndex,

            referenceSentence,

            referenceSentenceIndex: referenceIndex,

            referenceFile: reference.fileName,

            referenceSentenceCount: reference.sentences.length,

            similarity,
          };
        }
      });

      results.push(bestMatch);
    });
  });

  results.sort((a, b) => b.similarity - a.similarity);

  return results;
}

async function compareDocumentsAsync(mainDocument, referenceDocuments) {
  const results = [];

  let processedComparisons = 0;

  const totalComparisons = referenceDocuments.reduce(
    (total, reference) =>
      total + mainDocument.sentences.length * reference.sentences.length,
    0,
  );

  statusDiv.style.display = "block";
  statusDiv.className = "status-badge processing";
  statusDiv.textContent = "0% Processed...";

  for (const reference of referenceDocuments) {
    for (
      let mainIndex = 0;
      mainIndex < mainDocument.sentences.length;
      mainIndex++
    ) {
      const mainSentence = mainDocument.sentences[mainIndex];

      let bestMatch = null;

      for (
        let referenceIndex = 0;
        referenceIndex < reference.sentences.length;
        referenceIndex++
      ) {
        const referenceSentence = reference.sentences[referenceIndex];

        const similarity = calculateSimilarity(mainSentence, referenceSentence);

        // -------------------------
        // Progress
        // -------------------------

        processedComparisons++;

        const percentage = Math.round(
          (processedComparisons / totalComparisons) * 100,
        );

        statusDiv.textContent = `${percentage}% Processed...`;

        // -------------------------
        // Best match
        // -------------------------

        if (bestMatch === null || similarity > bestMatch.similarity) {
          bestMatch = {
            mainSentence,

            mainSentenceIndex: mainIndex,

            referenceSentence,

            referenceSentenceIndex: referenceIndex,

            referenceFile: reference.fileName,

            referenceSentenceCount: reference.sentences.length,

            similarity,
          };
        }

        // Give browser time to repaint
        if (processedComparisons % 100 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      results.push(bestMatch);
    }
  }

  results.sort((a, b) => b.similarity - a.similarity);

  statusDiv.textContent = "100% Processed";

  return results;
}
