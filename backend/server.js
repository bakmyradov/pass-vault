import express from "express";
import dotenv from "dotenv";
dotenv.config();
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import passwordsRoutes from "./routes/passwordsRoutes.js";

connectDB();

const csrfProtection = csrf({ cookie: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send CSRF token to the client
});

app.use(csrfProtection);

app.use("/api/users", userRoutes);
app.use("/api/passwords", passwordsRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ message: "Invalid CSRF token" });
  } else {
    next(err);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
