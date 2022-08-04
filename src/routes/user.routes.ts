import { Express } from "express";
import * as controller from "../controllers/user.controller";

const userRoutes = (app: Express) => {
  app.route("/users").get(controller.findAll);

  app.route("/users/:id").get(controller.findById);

  app.route("/users").post(controller.create);

  app.route("/users/:id").put(controller.update);
};

export default userRoutes;
