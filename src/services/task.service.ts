import { prisma } from "../database/prismaClient";
import Cache from "../lib/cache";

const cachedTodosKey = "cachedTodos";

export const findAllTodos = async () => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  Cache.set(cachedTodosKey, todos, 60 * 10); // cache expire 5 minutes
  return todos;
};
