import { Buffer } from "buffer";

export const base64Encode = (str: string) => {
  return Buffer.from(str).toString("base64");
};

export const base64Decode = (str: string) => {
  return Buffer.from(str, "base64").toString("ascii");
};
