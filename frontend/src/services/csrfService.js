let csrfToken = null;

const fetchCsrfToken = async () => {
  // Fetch the CSRF token only if it is not already fetched
  if (!csrfToken) {
    const response = await fetch("/api/csrf-token", {
      method: "GET",
      credentials: "include", // Include HttpOnly cookies
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
  }
  return csrfToken;
};

// Invalidate the CSRF token (e.g., on logout)
export const resetCsrfToken = () => {
  csrfToken = null;
};

export default fetchCsrfToken;
