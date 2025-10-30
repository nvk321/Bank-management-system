import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import branchRoutes from "./routes/branch.js";
import customerRoutes from "./routes/customers.js";
import employeeRoutes from "./routes/employee.js";


dotenv.config();
const app = express();

// Security headers
app.use(helmet());

// Logging (skip in test env)
if (process.env.NODE_ENV !== "test") {
	app.use(morgan("combined"));
}

// CORS - restrict in production
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(cors({ origin: allowedOrigin }));

// body parser with size limit
app.use(express.json({ limit: "50kb" }));

// Basic rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: Number(process.env.RATE_LIMIT_MAX || 200),
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);

// Optionally serve the frontend from the backend.
// Set SERVE_FRONTEND=true or run in production with the built frontend at ../frontend/dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.SERVE_FRONTEND === 'true' || process.env.NODE_ENV === 'production') {
	const staticPath = path.join(__dirname, '..', 'frontend', 'dist');
	app.use(express.static(staticPath));
	// serve index.html for client-side routes, but skip API routes
	app.get('*', (req, res, next) => {
		if (req.path.startsWith('/api/')) return next();
		res.sendFile(path.join(staticPath, 'index.html'), (err) => {
			if (err) next(err);
		});
	});
}

// centralized error handler
app.use((err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error";
	res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
