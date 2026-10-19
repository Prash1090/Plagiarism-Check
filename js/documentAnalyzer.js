// =====================================================
// FINALSCANPRO
// documentAnalyzer.js
// Creates document analysis objects
// =====================================================

async function analyzeDocument(file) {
  // Read document

  const rawText = await readDocument(file);

  // Clean it

  const cleanedText = cleanText(rawText);

  // Break into pieces

  const paragraphs = splitIntoParagraphs(cleanedText);

  const sentences = splitIntoSentences(cleanedText);

  // Build analysis object

  return {
    fileName: file.name,

    fileSize: file.size,

    fileType: file.type,

    text: cleanedText,

    wordCount: countWords(cleanedText),

    characterCount: countCharacters(cleanedText),

    paragraphCount: paragraphs.length,

    sentenceCount: sentences.length,

    paragraphs: paragraphs,

    sentences: sentences,
  };
}

async function analyzePage(text) {
  const sentences = splitIntoSentences(cleanedText);
  return sentences;
}
