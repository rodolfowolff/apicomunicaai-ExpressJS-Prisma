import { Express } from "express";
import * as controller from "../controllers/task.controller";

const taskRoutes = (app: Express) => {
  app.route("/todos").get(controller.findAllTodos);
};

export default taskRoutes;
