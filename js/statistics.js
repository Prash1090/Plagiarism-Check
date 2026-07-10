// =====================================================
// FINALSCANPRO
// statistics.js
// =====================================================

function calculateStatistics(matches) {

    const statistics = {

        totalMatches: matches.length,

        totalComparisons: matches.length,

        highestSimilarity: 0,

        averageSimilarity: 0,

        exactMatches: 0,

        highMatches: 0,

        mediumMatches: 0,

        lowMatches: 0,

        noMatches: 0,

        referenceStatistics: {}

    };

    if (matches.length === 0)
        return statistics;

    let totalSimilarity = 0;

    matches.forEach(match => {

        totalSimilarity += match.similarity;

        if (match.similarity > statistics.highestSimilarity) {

            statistics.highestSimilarity =
                match.similarity;

        }

        // -----------------------------------------
        // Overall statistics
        // -----------------------------------------

        if (match.similarity === 100) {

            statistics.exactMatches++;

        }
        else if (match.similarity >= 80) {

            statistics.highMatches++;

        }
        else if (match.similarity >= 60) {

            statistics.mediumMatches++;

        }
        else if (match.similarity >= 40) {

            statistics.lowMatches++;

        }
        else {

            statistics.noMatches++;

        }

        // -----------------------------------------
        // Per Reference Document
        // -----------------------------------------

        const file =
            match.referenceFile;

        if (!statistics.referenceStatistics[file]) {

            statistics.referenceStatistics[file] = {

    			referenceSentences:
        				match.referenceSentenceCount,

    			exactMatches: 0,

    			highMatches: 0,

    			mediumMatches: 0,

    			lowMatches: 0,

    			noMatches: 0,

    			highestSimilarity: 0

		};

         }

        const fileStats =
            statistics.referenceStatistics[file];

        if (match.similarity === 100) {

            fileStats.exactMatches++;

        }
        else if (match.similarity >= 80) {

            fileStats.highMatches++;

        }
        else if (match.similarity >= 60) {

            fileStats.mediumMatches++;

        }
        else if (match.similarity >= 40) {

            fileStats.lowMatches++;

        }
        else {

            fileStats.noMatches++;

        }

        if (

            match.similarity >

            fileStats.highestSimilarity

        ) {

            fileStats.highestSimilarity =
                match.similarity;

        }

    });

    statistics.averageSimilarity =
        Math.round(
            totalSimilarity / matches.length
        );

    console.log(statistics);

    return statistics;

}