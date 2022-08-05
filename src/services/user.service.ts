import { prisma } from "../database/prismaClient";
import Cache, { cachedUserKey } from "../lib/cache";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "..//helpers/apiError";

export const findAll = async (status: string) => {
  const cachedTasks = await Cache.get(`${cachedUserKey}-${status}`);
  if (cachedTasks) return cachedTasks;

  const users = await prisma.user.findMany({
    where: {
      status: status === "false" ? false : true,
    },
    select: {
      id: true,
      firstName: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!users) throw new NotFoundError("Users not found");

  Cache.set(`${cachedUserKey}-${status}`, users, 60 * 10); // cache expire 10 minutes
  return users;
};

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

  if (!user) throw new NotFoundError("User not found");

  Cache.set(`${cachedUserKey}-${id}`, user, 60 * 10); // cache expire 10 minutes
  return user;
};

export const create = async (data: any) => {
  const { firstName, lastName, password, telephone } = data;
  if (!firstName || !lastName || !password || !telephone)
    throw new BadRequestError(
      "First name, last name, password and telephone are required"
    );
  if (firstName < 2 || lastName < 2)
    throw new BadRequestError(
      "First name and last name must be at least 3 characters"
    );

  const nameRegExp = /^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕ]+$/;
  if (!nameRegExp.test(firstName) || !nameRegExp.test(lastName)) {
    throw new BadRequestError("First name and last name must be letters only");
  }

  if (password.length < 6)
    throw new BadRequestError("Password too short, 6 characters minimum");

  const checkIfUserExists = await prisma.user.findFirst({
    where: { telephone: telephone.replace(/\D/g, "") },
  });

  if (checkIfUserExists) throw new ConflictError();

  const telephoneNumber = telephone.replace(/\D/g, "");

  const user = await prisma.user.create({
    data: {
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      password: password,
      telephone: telephoneNumber,
    },
  });
  if (!user) throw new BadRequestError("User not created");

  Cache.delPrefix(cachedUserKey);
  return user;
};

export const update = async (
  id: string,
  telephone: string,
  status: boolean
) => {
  if (!id) throw new BadRequestError("Id are required");

  if (typeof status !== "boolean")
    throw new BadRequestError("Status must be true or false");

  const userData = await findById(id);
  if (!userData) throw new NotFoundError("User not found");

  const update = await prisma.user.update({
    where: { id: userData.id },
    data: {
      telephone,
      status,
    },
  });

  if (!update) throw new BadRequestError("User not updated");

  const cachedUser = await Cache.get(`${cachedUserKey}-${id}`);
  if (cachedUser) {
    Cache.delPrefix(`${cachedUserKey}-${id}`);
  }
  Cache.delPrefix(cachedUserKey);

  return "User updated";
};
