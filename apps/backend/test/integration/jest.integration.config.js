module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../..",
  testRegex: "test/integration/.*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage/integration",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/integration/setup-env.ts"],
};
