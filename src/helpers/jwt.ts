import jwt from "jsonwebtoken";

type IJwtToken = {
  id: string;
  exp?: string;
};

export const createToken = ({ id, exp = "2d" }: IJwtToken) => {
  return jwt.sign({ id }, process.env.JWT_SECRET ?? "tokenSecret", {
    expiresIn: exp,
  });
};
