export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest", // Transforms TypeScript using ts-jest
    "^.+\\.[tj]s$": "babel-jest", // Transforms ES module syntax using Babel
  },
  testMatch: ["**/tests/**/*.test.ts"], // Your test files
};
