import { Express } from "express";
import * as controller from "../controllers/user.controller";

const userRoutes = (app: Express) => {
  app.route("/users/create").post(controller.create);

  app.route("/users/login").get(controller.login);

  app.route("/users/findall").get(controller.findAll);

  app.route("/users/:id").get(controller.findById);

  app.route("/users/update/:id").put(controller.update);

  app.route("/users/disable/:id").put(controller.disable);
};

export default userRoutes;
