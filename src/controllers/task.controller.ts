import { Request, Response } from "express";
import * as services from "../services/task.service";

export const findAll = async (_req: Request, res: Response) => {
  const tasks = await services.findAll();
  res.status(201).json(tasks);
};

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await services.findById(id);
  res.status(201).json(task);
};

export const create = async (req: Request, res: Response) => {
  const { title, text } = req.body;
  const create = await services.create(title, text);
  res.status(201).json(create);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = await services.update(id, req.body);
  res.status(201).json(update);
};
