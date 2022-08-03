import { prisma } from "../database/prismaClient";
import Cache, { cachedUserKey } from "../lib/cache";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "..//helpers/apiError";

export const findById = async (id: string) => {
  if (!id) throw new BadRequestError();
  const cachedUser = await Cache.get(`${cachedUserKey}-${id}`);
  if (cachedUser) return cachedUser;

  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      telephone: true,
    },
  });

  if (!user) throw new NotFoundError();

  Cache.set(`${cachedUserKey}-${id}`, user, 60 * 10); // cache expire 10 minutes
  return user;
};

export const create = async (data: any) => {
  const { firstName, lastName, password, telephone } = data;
  if (!firstName || !lastName || !password || !telephone)
    throw new BadRequestError();

  const checkIfUserExists = await prisma.user.findFirst({
    where: { telephone: telephone.replace(/\D/g, "") },
  });

  if (checkIfUserExists) throw new ConflictError();

  const nameRegExp = /^[a-zA-Z]+$/;
  if (!nameRegExp.test(firstName) || !nameRegExp.test(lastName))
    throw new BadRequestError();
  const nameRemoval = firstName.replace(/\s/g, "");
  const lastNameRemoval = lastName.replace(/\s/g, "");
  const telephoneNumber = telephone.replace(/\D/g, "");

  const user = await prisma.user.create({
    data: {
      firstName: nameRemoval,
      lastName: lastNameRemoval,
      password: password,
      telephone: telephoneNumber,
    },
  });
  if (!user) throw new BadRequestError();

  return user;
};

export const update = async (id: string, telephone: string) => {
  if (!id || !telephone) throw new BadRequestError();

  const userData = await findById(id);
  if (!userData) throw new NotFoundError();

  const update = await prisma.user.update({
    where: { id: userData.id },
    data: {
      telephone,
    },
  });

  const cachedUser = await Cache.get(`${cachedUserKey}-${id}`);
  if (cachedUser) {
    Cache.delPrefix(`${cachedUserKey}-${id}`);
  }

  return update;
};
