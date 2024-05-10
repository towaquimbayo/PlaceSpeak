// Constants.js
const production = { url: "https://placespeak.com" };
const development = { url: "http://localhost:8080" };
console.log("Running on: ", process.env.NODE_ENV);
export const config =
  process.env.NODE_ENV === "development" ? development : production;
