import { Request, Response } from "express";
import * as services from "../services/sector.service";

export const findAll = async (_req: Request, res: Response) => {
  const sectors = await services.findAll();
  res.status(201).json(sectors);
};

export const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const create = await services.create(name);
  res.status(201).json(create);
};
