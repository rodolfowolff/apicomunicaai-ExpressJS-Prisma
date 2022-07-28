import moment from "moment";
import { NextFunction, Request, Response } from "express";
import redis from "../config/redis";

const WINDOW_SIZE_IN_HOURS = 1;
const MAX_WINDOW_REQUEST_COUNT = 3;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

export const customRedisRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // fetch records of current user using IP address, returns null when no record is found
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!ip) {
      return res.status(400).json({ error: "ip is required" });
    }
    const record = (await redis.get(ip as string)) || null;
    const currentRequestTime = moment();

    //  if no record is found , create a new record for user and store to redis
    if (record === null || record === undefined) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);
      await redis.set(ip as string, JSON.stringify(newRecord));
      next();
    }

    // if record is found, parse it's value and calculate number of requests users has made within the last window
    let data = JSON.parse(record!);

    let windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_HOURS, "hours")
      .unix();

    let requestsWithinWindow = data.filter((entry: any) => {
      console.log(entry.requestTimeStamp > windowStartTimestamp);
      return entry.requestTimeStamp > windowStartTimestamp;
    });

    let totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator: any, entry: any) => {
        return accumulator + entry.requestCount;
      },
      0
    );

    // if number of requests made is greater than or equal to the desired maximum, return error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res
        .status(429)
        .send(
          `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
        );
    } else {
      // if number of requests made is less than allowed maximum, log new entry
      let lastRequestLog = data[data.length - 1];
      let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
        .unix();
      //  if interval has not passed since last request log, increment counter
      if (
        lastRequestLog.requestTimeStamp >
        potentialCurrentWindowIntervalStartTimeStamp
      ) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        //  if interval has passed, log new entry for current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }
      await redis.set(ip as string, JSON.stringify(data));
      next();
    }
  } catch (error) {
    next(error);
  }
};
