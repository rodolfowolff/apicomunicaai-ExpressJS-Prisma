import { prisma } from "../database/prismaClient";
import Cache, { cachedTaskKey } from "../lib/cache";

export const findAllTask = async () => {
  const cachedTasks = await Cache.get(cachedTaskKey);
  if (cachedTasks) return cachedTasks;

  const task = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  Cache.set(cachedTaskKey, task, 60 * 10); // cache expire 10 minutes
  return task;
};

export const findTaskById = async (id: string) => {
  const cachedTask = await Cache.get(`${cachedTaskKey}-${id}`);
  if (cachedTask) return cachedTask;

  const task = await prisma.task.findFirst({
    where: { id },
  });

  if (!task) throw new Error("Task not found");

  Cache.set(`${cachedTaskKey}-${id}`, task, 60 * 10); // cache expire 10 minutes
  return task;
};

export const createTask = async (title: string, text: string) => {
  const create = await prisma.task.create({
    data: {
      title,
      text,
      completed: false,
    },
  });

  Cache.delPrefix(cachedTaskKey);
  return create;
};
