import IOredis from "ioredis";

const redis = new IOredis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  keyPrefix: "cache:",
});

export default redis;
