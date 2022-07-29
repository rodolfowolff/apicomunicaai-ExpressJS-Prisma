import { Request, Response } from "express";
import * as services from "../services/task.service";
import Cache, { cachedTaskKey } from "../lib/cache";

export const findAllTask = async (_req: Request, res: Response) => {
  try {
    const cachedTask = await Cache.get(cachedTaskKey);
    if (cachedTask) return res.json(cachedTask);

    const task = await services.findAllTask();
    return res.json(task);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
