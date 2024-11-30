const csrfProtection = (req, res, next) => {
    // Skip safe methods (GET, HEAD, OPTIONS)
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }

    const csrfTokenFromCookie = req.cookies.csrfToken;
    const csrfTokenFromHeader = req.headers["x-csrf-token"];

    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next(); // Tokens match, proceed
};

export default csrfProtection;