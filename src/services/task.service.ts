import { prisma } from "../database/prismaClient";
import Cache, { cachedTaskKey } from "../lib/cache";
import { BadRequestError, NotFoundError } from "..//helpers/apiError";

export const findAll = async () => {
  const cachedTasks = await Cache.get(cachedTaskKey);
  if (cachedTasks) return cachedTasks;

  const task = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  Cache.set(cachedTaskKey, task, 60 * 10); // cache expire 10 minutes
  return task;
};

export const findById = async (id: string) => {
  if (!id) throw new BadRequestError();
  const cachedTask = await Cache.get(`${cachedTaskKey}-${id}`);
  if (cachedTask) return cachedTask;

  const task = await prisma.task.findFirst({
    where: { id },
  });

  if (!task) throw new NotFoundError();

  Cache.set(`${cachedTaskKey}-${id}`, task, 60 * 10); // cache expire 10 minutes
  return task;
};

export const create = async (title: string, text: string) => {
  const create = await prisma.task.create({
    data: {
      title,
      text,
    },
  });

  Cache.delPrefix(cachedTaskKey);
  return create;
};

export const update = async (id: string, data: any) => {
  const { title, text, completed } = data;
  if (!id) throw new BadRequestError();
  if (!title && !text && !completed) throw new BadRequestError();

  const checkIfTaskExists = await findById(id);

  const update = await prisma.task.update({
    where: {
      id: checkIfTaskExists.id,
    },
    data: {
      title,
      text,
      completed,
    },
  });

  const cachedTask = await Cache.get(`${cachedTaskKey}-${id}`);
  if (cachedTask) {
    Cache.delPrefix(`${cachedTaskKey}-${id}`);
  }

  Cache.delPrefix(cachedTaskKey);

  return update;
};
