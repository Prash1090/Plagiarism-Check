// =====================================================
// FINALSCANPRO
// scanController.js
// Controls the scanning workflow
// =====================================================

// =====================================================
// Scan Button
// =====================================================

//scanButton.addEventListener("click", startScan);

scanButton.addEventListener("click", processPages);

// =====================================================
// Start Scan
// =====================================================

async function startScan() {
  // Ensure required files exist

  if (!mainDocument) {
    alert("Please upload a main document.");

    return;
  }

  if (referenceDocuments.length === 0) {
    alert("Please upload at least one reference document.");

    return;
  }

  console.clear();

  console.log("=================================");
  console.log("FINALSCANPRO");
  console.log("Starting Scan...");
  console.log("=================================");

  // ---------------------------------------------
  // Analyse Main Document
  // ---------------------------------------------

  console.log("Reading Main Document...");

  const mainAnalysis = await analyzeDocument(mainDocument);

  console.log(mainAnalysis);

  // ---------------------------------------------
  // Analyse Reference Documents
  // ---------------------------------------------

  console.log("Reading Reference Documents...");

  const referenceAnalyses = [];

  for (const file of referenceDocuments) {
    const analysis = await analyzeDocument(file);

    referenceAnalyses.push(analysis);
  }

  console.log(referenceAnalyses);

  // ---------------------------------------------
  // Compare Documents
  // ---------------------------------------------

  console.log("Comparing Documents...");

  const matches = compareDocuments(mainAnalysis, referenceAnalyses);
  console.table(matches);

  const statistics = calculateStatistics(matches);

  console.log("This is where the final table shows up");

  console.table(matches);
  renderResults(matches, statistics);

  // ---------------------------------------------
  // Summary
  // ---------------------------------------------

  console.log("=================================");

  console.log("Scan Complete");

  console.log("Main Document:", mainAnalysis.fileName);

  console.log("Reference Documents:", referenceAnalyses.length);

  console.log("Matches Found:", matches.length);

  console.log("=================================");
}

async function startScanAsync() {
  // Ensure required files exist

  if (!mainDocument) {
    alert("Please upload a main document.");

    return;
  }

  if (referenceDocuments.length === 0) {
    alert("Please upload at least one reference document.");

    return;
  }

  console.clear();

  console.log("=================================");
  console.log("FINALSCANPRO");
  console.log("Starting Scan...");
  console.log("=================================");

  // ---------------------------------------------
  // Analyse Main Document
  // ---------------------------------------------

  console.log("Reading Main Document...");

  const mainAnalysis = await analyzeDocument(mainDocument);

  viewer.textContent = mainAnalysis.text;

  console.log(mainAnalysis);

  // ---------------------------------------------
  // Analyse Reference Documents
  // ---------------------------------------------

  console.log("Reading Reference Documents...");

  const referenceAnalyses = [];

  for (const file of referenceDocuments) {
    const analysis = await analyzeDocument(file);

    referenceAnalyses.push(analysis);
  }

  console.log(referenceAnalyses);

  // ---------------------------------------------
  // Compare Documents
  // ---------------------------------------------

  console.log("Comparing Documents...");

  const matches = await compareDocumentsAsync(mainAnalysis, referenceAnalyses);
  console.table(matches);

  const statistics = calculateStatistics(matches);

  console.log("This is where the final table shows up");

  console.table(matches);
  //renderResults(matches, statistics);

  // ---------------------------------------------
  // Summary
  // ---------------------------------------------

  console.log("=================================");

  console.log("Scan Complete");

  console.log("Main Document:", mainAnalysis.fileName);

  console.log("Reference Documents:", referenceAnalyses.length);

  console.log("Matches Found:", matches.length);

  console.log("=================================");

  return {
    mainAnalysis,
    matches,
    statistics,
  };
}
