const fetchCsrfToken = async () => {
  const response = await fetch("/api/csrf-token", {
    method: "GET",
    credentials: "include", // Include cookies
  });
  const data = await response.json();
  return data.csrfToken;
};

export default fetchCsrfToken;
