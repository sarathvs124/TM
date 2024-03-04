module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: ["node_modules/(?!axios)/(?!/vue-template-es2015-compiler)/"],
  coverageDirectory: "coverage",
    coverageReporters: ["html", "text", "text-summary", "cobertura", "lcov"],
  collectCoverage: true,

    transform: {
      // process *.js files with babel-jest
      ".*\\.(js)$": "babel-jest"
    },
    maxWorkers: 4,
  }

