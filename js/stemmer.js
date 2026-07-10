// =====================================================
// FINALSCANPRO
// stemmer.js
// =====================================================

function stem(word) {

    word = word.toLowerCase();

    // Remove punctuation

    word = word.replace(/[^a-z]/g, "");

    // Common endings

    if (word.endsWith("ing") && word.length > 5) {

        word = word.slice(0, -3);

    }

    else if (word.endsWith("ied")) {

        word = word.slice(0, -3) + "y";

    }

    else if (word.endsWith("ed") && word.length > 4) {

        word = word.slice(0, -2);

    }

    else if (word.endsWith("es") && word.length > 4) {

        word = word.slice(0, -2);

    }

    else if (

        word.endsWith("s") &&

        !word.endsWith("ss") &&

        word.length > 3

    ) {

        word = word.slice(0, -1);

    }

    // Fix doubled consonants

    if (

        /(bb|dd|ff|gg|ll|mm|nn|pp|rr|tt)$/.test(word)

    ) {

        word = word.slice(0, -1);

    }

    return word;

}