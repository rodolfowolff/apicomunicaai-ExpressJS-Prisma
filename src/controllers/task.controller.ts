import { Request, Response } from "express";
import * as services from "../services/task.service";
import Cache from "../lib/cache";

const cachedTodosKey = "cachedTodos";

export const findAllTodos = async (_req: Request, res: Response) => {
  try {
    const cachedTodos = await Cache.get(cachedTodosKey);
    if (cachedTodos) return res.json(cachedTodos);

    const todos = await services.findAllTodos();
    return res.json(todos);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
