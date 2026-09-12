// todo.routes.ts
// Prisma schema assumption (schema.prisma):
//
// model Todo {
//   id        Int      @id @default(autoincrement())
//   title     String
//   completed Boolean  @default(false)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

import { Router, Request, Response } from "express";
import { prisma } from "./lib/prisma";

const router = Router();

interface TodoBody {
	title?: string;
	completed?: boolean;
}

// CREATE - Notun todo add korar jonno
// POST /todos
router.post("/todos", async (req: Request<{}, {}, TodoBody>, res: Response) => {
	try {
		const { title, completed } = req.body;

		if (!title) {
			return res.status(400).json({ error: "title field ta required" });
		}

		const todo = await prisma.todo.create({
			data: {
				title,
				completed: completed ?? false,
			},
		});

		res.status(201).json(todo);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// READ ALL - Shob todo dekhar jonno
// GET /todos
router.get("/todos", async (_req: Request, res: Response) => {
	try {
		const todos = await prisma.todo.findMany({
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json(todos);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// READ ONE - Ekta specific todo dekhar jonno
// GET /todos/:id
router.get("/todos/:id", async (req: Request<{ id: string }>, res: Response) => {
	try {
		const { id } = req.params;

		const todo = await prisma.todo.findUnique({
			where: { id: Number(id) },
		});

		if (!todo) {
			return res.status(404).json({ error: "Todo pawa jay nai" });
		}

		res.status(200).json(todo);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// UPDATE - Todo update korar jonno
// PUT /todos/:id
router.put("/todos/:id", async (req: Request<{ id: string }, {}, TodoBody>, res: Response) => {
	try {
		const { id } = req.params;
		const { title, completed } = req.body;

		const existingTodo = await prisma.todo.findUnique({
			where: { id: Number(id) },
		});

		if (!existingTodo) {
			return res.status(404).json({ error: "Todo pawa jay nai" });
		}

		const updatedTodo = await prisma.todo.update({
			where: { id: Number(id) },
			data: {
				title: title ?? existingTodo.title,
				completed: completed ?? existingTodo.completed,
			},
		});

		res.status(200).json(updatedTodo);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// DELETE - Todo delete korar jonno
// DELETE /todos/:id
router.delete("/todos/:id", async (req: Request<{ id: string }>, res: Response) => {
	try {
		const { id } = req.params;

		const existingTodo = await prisma.todo.findUnique({
			where: { id: Number(id) },
		});

		if (!existingTodo) {
			return res.status(404).json({ error: "Todo pawa jay nai" });
		}

		await prisma.todo.delete({
			where: { id: Number(id) },
		});

		res.status(200).json({ message: "Todo delete kora hoyeche" });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export { router as todoRoutes };
