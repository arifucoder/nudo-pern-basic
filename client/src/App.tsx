import { useEffect, useState } from "react";
import { api } from "./api";

interface Task {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	const [title, setTitle] = useState("");
	const [editId, setEditId] = useState<number | null>(null);

	// GET - সব task fetch করা
	useEffect(() => {
		const controller = new AbortController();

		const fetchTasks = async () => {
			try {
				const res = await api.get<Task[]>("/todos", {
					signal: controller.signal,
				});
				setTasks(res.data);
			} catch (err) {
				if (!controller.signal.aborted) {
					console.error("Failed to fetch tasks:", err);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchTasks();

		return () => controller.abort();
	}, []);

	// POST / PUT - Add অথবা Update করা
	const handleAddOrUpdate = async () => {
		if (!title.trim()) return;

		try {
			if (editId !== null) {
				// PUT - Update
				const res = await api.put<Task>(`/todos/${editId}`, { title });
				setTasks((prev) => prev.map((task) => (task.id === editId ? res.data : task)));
				setEditId(null);
			} else {
				// POST - Add
				const res = await api.post<Task>("/todos", { title });
				setTasks((prev) => [...prev, res.data]);
			}

			setTitle("");
		} catch (err) {
			console.error("Failed to save task:", err);
		}
	};

	const handleEdit = (task: Task) => {
		setEditId(task.id);
		setTitle(task.title);
	};

	// Completed status টগল করা
	const handleToggleComplete = async (task: Task) => {
		try {
			const res = await api.put<Task>(`/todos/${task.id}`, {
				completed: !task.completed,
			});
			setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
		} catch (err) {
			console.error("Failed to update status:", err);
		}
	};

	// DELETE
	const handleDelete = async (id: number) => {
		try {
			await api.delete(`/todos/${id}`);
			setTasks((prev) => prev.filter((task) => task.id !== id));
			if (editId === id) {
				setEditId(null);
				setTitle("");
			}
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	};

	if (loading) {
		return <p className="text-center mt-10">Loading...</p>;
	}

	return (
		<>
			<div className="max-w-4xl my-5 mx-auto">
				{/* Add / Edit Form */}
				<div>
					<h1>Add Task</h1>
				</div>
				<div className="flex gap-2 mb-4">
					<input
						type="text"
						placeholder="Task Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="input input-bordered w-full"
					/>
					<button
						onClick={handleAddOrUpdate}
						className={`px-4 py-2 rounded-md text-white cursor-pointer whitespace-nowrap ${
							editId !== null ? "bg-green-500" : "bg-blue-500"
						}`}
					>
						{editId !== null ? "Update" : "Add"}
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>SL.</th>
								<th>Task Title</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{tasks.map((task, index) => (
								<tr key={task.id}>
									<th>{index + 1}</th>
									<td>{task.title}</td>
									<td>
										<button
											onClick={() => handleToggleComplete(task)}
											className={`px-2 py-1 rounded-md text-white text-sm cursor-pointer ${
												task.completed ? "bg-green-500" : "bg-gray-400"
											}`}
										>
											{task.completed ? "Completed" : "Pending"}
										</button>
									</td>
									<td>
										<button
											onClick={() => handleEdit(task)}
											className="bg-green-400 text-white px-3 py-1 rounded-md cursor-pointer"
										>
											Edit
										</button>{" "}
										<button
											onClick={() => handleDelete(task.id)}
											className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default App;
