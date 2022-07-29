import { NextFunction, Request, Response } from "express";
import * as services from "../services/task.service";

export const findAllTask = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await services.findAllTask();
    res.status(201).json(tasks);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const findTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing id" });

  try {
    const task = await services.findTaskById(id);
    res.status(201).json(task);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, text } = req.body;
  if (!title || !text)
    return res.status(400).json({ message: "Missing title or description" });

  try {
    const create = await services.createTask(title, text);
    res.status(201).json(create);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
