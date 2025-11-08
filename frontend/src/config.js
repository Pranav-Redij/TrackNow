const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://tracknow-backend.onrender.com";
export default BASE_URL;