import IOredis from "ioredis";

export const cachedTaskKey = "cachedTasks";
export const cachedUserKey = "cachedUsers";

class Cache {
  private redis: IOredis;

  constructor() {
    this.redis = new IOredis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: "cache:",
    });
  }

  async get(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  set(key: string, value: any, timeExp?: number) {
    const time = 60 * 15; // 15 minutes
    return this.redis.set(key, JSON.stringify(value), "EX", timeExp || time);
  }

  del(key: string) {
    return this.redis.del(key);
  }

  async delPrefix(prefix: string): Promise<any> {
    const keysRedis = (await this.redis.keys(`cache:${prefix}`)).map(
      (key) => key.replace("cache:", "") // remove prefix
    );
    return this.redis.del(keysRedis);
  }
}

export default new Cache();
