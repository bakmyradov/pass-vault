import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import csrfProtection from './utils/csrf.js'
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import passwordsRoutes from "./routes/passwordsRoutes.js";

void connectDB();

// Utility function to generate a CSRF token
const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");

// Middleware to generate and set a CSRF token as a cookie
const setCsrfToken = (req, res, next) => {
  if (!req.cookies.csrfToken) {
    const csrfToken = generateCsrfToken();
    res.cookie("csrfToken", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // Token expires in 1 hour
    });
  }
  next();
};

// Middleware to validate CSRF token from requests
// const csrfProtection = (req, res, next) => {
//   // Skip safe methods (GET, HEAD, OPTIONS)
//   if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
//     return next();
//   }
//
//   const csrfTokenFromCookie = req.cookies.csrfToken;
//   const csrfTokenFromHeader = req.headers["x-csrf-token"];
//
//   if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
//     return res.status(403).json({ message: "Invalid CSRF token" });
//   }
//
//   next(); // Tokens match, proceed
// };

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(setCsrfToken); // Attach CSRF token as a cookie

// CSRF token fetch endpoint
app.get("/api/csrf-token", (req, res) => {
  const csrfToken = req.cookies.csrfToken || generateCsrfToken();
  res.cookie("csrfToken", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // Token expires in 1 hour
  });
  res.json({ csrfToken });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/passwords", csrfProtection, passwordsRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`)
);