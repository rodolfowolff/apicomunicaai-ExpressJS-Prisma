import { prisma } from "../database/prismaClient";
import Cache, { cachedUserKey } from "../lib/cache";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  BcryptAdapter,
  DcryptAdapter,
} from "../helpers";

export const create = async (data: any) => {
  const requiredField = ["firstName", "lastName", "password", "telephone"];
  for (const field of requiredField) {
    if (!data[field]) {
      throw new BadRequestError(`${field} is required to create a user`);
    }
  }
  const { firstName, lastName, password, telephone } = data;

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

  const salt = 10;
  const bcryptPassword = new BcryptAdapter(salt);
  const hashedPassword = await bcryptPassword.encrypt(password);

  const telephoneNumber = telephone.replace(/\D/g, "");

  const user = await prisma.user.create({
    data: {
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      password: hashedPassword,
      telephone: telephoneNumber,
    },
  });
  if (!user) throw new BadRequestError("User not created");

  const cachedUsers = await Cache.get(`${cachedUserKey}-${true}`);
  if (cachedUsers) {
    Cache.delPrefix(`${cachedUserKey}-${true}`);
  }

  return "User created successfully";
};

export const login = async (data: any) => {
  const requiredField = ["telephone", "password"];
  for (const field of requiredField) {
    if (!data[field]) {
      throw new BadRequestError(`${field} is required to login`);
    }
  }

  const { password, telephone } = data;
  if (password.length < 6)
    throw new BadRequestError("Password too short, 6 characters minimum");

  const userExists = await prisma.user.findFirst({
    where: {
      telephone: telephone.replace(/\D/g, ""),
      status: true,
    },
    select: { id: true, password: true },
  });

  if (!userExists) throw new NotFoundError("User or password incorrect");

  const isPasswordCorrect = await new DcryptAdapter().decrypt(
    password,
    userExists.password
  );

  if (!isPasswordCorrect) throw new NotFoundError("User or password incorrect");

  return userExists.id;
};

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
      lastName: true,
      telephone: true,
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
      status: true,
    },
  });

  if (!user) throw new NotFoundError("User not found");

  Cache.set(`${cachedUserKey}-${id}`, user, 60 * 10); // cache expire 10 minutes
  return user;
};

export const update = async (
  id: string,
  telephone: string,
  status?: boolean
) => {
  if (!id) throw new BadRequestError("Id are required");
  if (status !== undefined && typeof status !== "boolean")
    throw new BadRequestError("Status must be true or false");

  const userData = await findById(id);

  const telephoneData = telephone ? telephone.replace(/\D/g, "") : null;
  if (telephoneData && telephoneData.length !== 11)
    throw new BadRequestError("Telephone invalid");

  const update = await prisma.user.update({
    where: { id },
    data: {
      telephone: telephoneData || userData.telephone,
      status: status || userData.status,
    },
  });

  if (!update) throw new Error();

  const cachedUserById = await Cache.get(`${cachedUserKey}-${id}`);
  if (cachedUserById) {
    Cache.delPrefix(`${cachedUserKey}-${id}`);
  }

  const cachedUsersStatus = await Cache.get(
    `${cachedUserKey}-${userData.status}`
  );
  if (cachedUsersStatus) {
    Cache.delPrefix(`${cachedUserKey}-${!update.status}`);
  }

  if (userData.status !== update.status) {
    Cache.delPrefix(`${cachedUserKey}-${update.status}`);
  }

  return "User updated";
};

export const disable = async (id: string) => {
  if (!id) throw new BadRequestError("Id are required");

  const userData = await findById(id);
  if (!userData) throw new NotFoundError("User not found");

  if (userData.status === false)
    throw new BadRequestError("User already disabled");

  const disable = await prisma.user.update({
    where: { id: userData.id },
    data: {
      status: false,
    },
  });

  if (!disable) throw new BadRequestError("User not disabled");

  const cachedUser = await Cache.get(`${cachedUserKey}-${id}`);
  if (cachedUser) {
    Cache.delPrefix(`${cachedUserKey}-${id}`);
  }
  Cache.delPrefix(cachedUserKey);

  return "User disabled";
};
