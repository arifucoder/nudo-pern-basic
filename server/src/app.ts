import express, { Request, Response } from "express";
import cors from "cors";
import { todoRoutes } from "./todo.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server is running" });
});

app.use("/api", todoRoutes);

// Routes (পরে এখানে import করবা)
// app.use("/api/todos", todoRoutes);

export default app;
