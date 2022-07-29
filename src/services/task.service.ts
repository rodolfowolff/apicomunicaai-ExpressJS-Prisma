import { prisma } from "../database/prismaClient";
import Cache, { cachedTaskKey } from "../lib/cache";

export const findAllTask = async () => {
  const task = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  Cache.set(cachedTaskKey, task, 60 * 10); // cache expire 5 minutes
  return task;
};
