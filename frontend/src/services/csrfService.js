let csrfToken = null;
let csrfTokenExpiry = null;
let csrfTokenPromise = null;

const fetchCsrfToken = async () => {
  if (csrfToken && Date.now() <= csrfTokenExpiry) {
    return csrfToken;
  }
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch("/api/csrf-token", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token");
        }
        return response.json();
      })
      .then((data) => {
        csrfToken = data.csrfToken;
        csrfTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        csrfTokenPromise = null;
        return csrfToken;
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        csrfTokenPromise = null;
        throw error;
      });
  }
  return csrfTokenPromise;
};

export const resetCsrfToken = () => {
  csrfToken = null;
  csrfTokenExpiry = null;
  csrfTokenPromise = null;
};

export default fetchCsrfToken;
