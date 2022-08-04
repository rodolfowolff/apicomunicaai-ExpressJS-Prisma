import { Request, Response } from "express";
import * as services from "../services/user.service";

export const findAll = async (req: Request, res: Response) => {
  const { status } = req.query;
  // const { status } = req.body;
  const user = await services.findAll(status as string);
  res.status(201).json(user);
};

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await services.findById(id);
  res.status(201).json(user);
};

export const create = async (req: Request, res: Response) => {
  const create = await services.create(req.body);
  res.status(201).json(create);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { telephone, status } = req.body;
  const update = await services.update(id, telephone, status);
  res.status(201).json(update);
};
