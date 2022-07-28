import { PrismaClient } from "@prisma/client";
import express from "express";
import Cache from "./lib/cache";
import { customRedisRateLimiter } from "./middleware/rateLimiter";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;
const cachedTodosKey = "cachedTodos";

app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const cachedTodos = await Cache.get(cachedTodosKey);

    if (cachedTodos) return res.json(cachedTodos);

    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });

    Cache.set(cachedTodosKey, todos, 60 * 5); // cache expire 5 minutes

    return res.json(todos);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "id is required" });

  try {
    const cachedTodo = await Cache.get(`${cachedTodosKey}-${id}`);

    if (cachedTodo) return cachedTodo;

    const todo = await prisma.todo.findFirst({
      where: { id },
    });

    if (!todo) return res.status(404).json({ error: "todo not found" });

    Cache.set(`${cachedTodosKey}-${id}`, todo, 60 * 1); // cache expire 1 minutes

    return res.json(todo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        completed: false,
        createdAt: new Date(),
        text: req.body.text ?? "Empty todo",
      },
    });

    Cache.delPrefix(cachedTodosKey);
    return res.json(todo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/", customRedisRateLimiter, async (req, res) => {
  return res.json({ message: "Hello World" });
  // await customRedisRateLimiter(req, res, () => {
  //   return res.json({ message: "Hello World" });
  // });
});

app.listen(port, () => {
  console.log(`Api listening at http://localhost:${port}`);
});
