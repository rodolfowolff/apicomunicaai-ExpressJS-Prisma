import express, { Express, NextFunction, Request, Response } from "express";
import "express-async-errors";
import { NotFoundError } from "./helpers/apiError";
import { errorMiddleware } from "./middlewares/errors";

// routes
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import sectorRoutes from "./routes/sector.routes";

export default (): Express => {
  const app = express();
  app.set("port", process.env.PORT || 3000);
  app.use(express.json());

  // Routes
  userRoutes(app);
  taskRoutes(app);
  sectorRoutes(app);

  // Error Handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError());
  });

  app.use(errorMiddleware);

  return app;
};
