import { BadRequestError } from "../helpers";
import { prisma } from "../database/prismaClient";
import Cache, { cachedSectorKey } from "../lib/cache";

export const findAll = async () => {
  const cachedSectors = await Cache.get(cachedSectorKey);
  if (cachedSectors) return cachedSectors;

  const sectors = await prisma.sector.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  Cache.set(cachedSectorKey, sectors, 60 * 20); // cache expire 20 minutes
  return sectors;
};

export const create = async (name: string) => {
  if (!name) throw new BadRequestError("Name is required");
  const create = await prisma.sector.create({
    data: {
      name,
    },
  });

  Cache.delPrefix(cachedSectorKey);
  return create;
};
