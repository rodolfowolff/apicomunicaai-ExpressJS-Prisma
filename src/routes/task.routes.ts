import { Express } from "express";
import * as controller from "../controllers/task.controller";

const taskRoutes = (app: Express) => {
  app.route("/task").get(controller.findAllTask);
  // app.route("/task/:id").get(controller.findTaskById);
};

export default taskRoutes;
