import IOredis from "ioredis";
import redisConfig from "../config/redis";

class Cache {
  private redis: IOredis;

  constructor() {
    this.redis = redisConfig;
  }

  async get(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return JSON.parse(data || "{}");
  }

  set(key: string, value: any, timeExp?: number) {
    const defaultTimeExp = 60 * 15; // 15 minutes
    this.redis.set(key, JSON.stringify(value), "EX", timeExp || defaultTimeExp);
  }

  del(key: string) {
    this.redis.del(key);
  }

  async delPrefix(prefix: string): Promise<any> {
    const keys = (await this.redis.keys(`chace:${prefix}:*`)).map(
      (key) => key.replace("chace:", "") // remove prefix
    );

    return this.redis.del(keys);
  }
}

export default new Cache();
