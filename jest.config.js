module.exports = {
  transform: {
    "^.+\\.ts$": "babel-jest",
    "^.+\\.tsx$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!some-module).*/"],
  testEnvironment: "node",
};
