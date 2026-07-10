// =====================================================
// FINALSCANPRO
// textProcessor.js
// Text cleaning and processing
// =====================================================


// =====================================================
// Clean Text
// =====================================================

function cleanText(text) {

    if (!text)
        return "";

    return text

        // Windows line endings
        .replace(/\r\n/g, "\n")

        // Old Mac line endings
        .replace(/\r/g, "\n")

        // Tabs
        .replace(/\t/g, " ")

        // Multiple spaces
        .replace(/ +/g, " ")

        // Multiple blank lines
        .replace(/\n{2,}/g, "\n\n")

        // Trim whitespace
        .trim();

}


// =====================================================
// Count Words
// =====================================================

function countWords(text) {

    if (!text)
        return 0;

    return text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;

}


// =====================================================
// Count Characters
// =====================================================

function countCharacters(text) {

    if (!text)
        return 0;

    return text.length;

}


// =====================================================
// Split Into Paragraphs
// =====================================================

function splitIntoParagraphs(text) {

    if (!text)
        return [];

    return text

        .split(/\n\s*\n/)

        .map(paragraph => paragraph.trim())

        .filter(paragraph => paragraph.length > 0);

}


// =====================================================
// Split Into Sentences
// =====================================================

function splitIntoSentences(text) {

    if (!text)
        return [];

    return text

        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)

        ?.map(sentence => sentence.trim())

        .filter(sentence => sentence.length > 0)

        || [];

}