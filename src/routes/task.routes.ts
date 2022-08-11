import { Express } from "express";
import * as controller from "../controllers/task.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const taskRoutes = (app: Express) => {
  app.route("/tasks").get(verifyAuthentication, controller.findAll);

  app.route("/tasks/:id").get(verifyAuthentication, controller.findById);

  app.route("/tasks").post(verifyAuthentication, controller.create);

  app.route("/tasks/:id").put(verifyAuthentication, controller.update);
};

export default taskRoutes;
