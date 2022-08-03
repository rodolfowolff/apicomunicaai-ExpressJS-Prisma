import { NextFunction, Request, Response } from "express";
import * as services from "../services/task.service";

export const findAllTask = async (_req: Request, res: Response) => {
  const tasks = await services.findAllTask();
  res.status(201).json(tasks);
};

export const findTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await services.findTaskById(id);
  res.status(201).json(task);
};

export const createTask = async (req: Request, res: Response) => {
  const { title, text } = req.body;
  const create = await services.createTask(title, text);
  res.status(201).json(create);
};
