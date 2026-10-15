const previewUrl = process.env.PREVIEW_URL;

module.exports = {
  ci: {
    collect: {
      url: [previewUrl || "http://127.0.0.1:4173"],
      numberOfRuns: 3,
      settings: { formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1 }, throttlingMethod: "simulate" },
      ...(previewUrl ? {} : { startServerCommand: "node ./node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 4173", startServerReadyPattern: "Ready in", startServerPort: 4173 }),
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
