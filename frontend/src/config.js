// Constants.js
const production = { url: "https://placespeak-djangobackend.vercel.app/" };
const development = { url: "http://127.0.0.1:8000" };
console.log("Running on: ", process.env.NODE_ENV);
export const config =
  process.env.NODE_ENV === "development" ? development : production;
