import { Express } from "express";
import * as controller from "../controllers/task.controller";

const taskRoutes = (app: Express) => {
  app.route("/tasks").get(controller.findAllTask);

  app.route("/tasks/:id").get(controller.findTaskById);

  app.route("/tasks").post(controller.createTask);
};

export default taskRoutes;
