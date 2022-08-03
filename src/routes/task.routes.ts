import { Express } from "express";
import * as controller from "../controllers/task.controller";

const taskRoutes = (app: Express) => {
  app.route("/tasks").get(controller.findAll);

  app.route("/tasks/:id").get(controller.findById);

  app.route("/tasks").post(controller.create);

  app.route("/tasks/:id").put(controller.update);
};

export default taskRoutes;
