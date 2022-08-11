import { Express } from "express";
import * as controller from "../controllers/user.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const userRoutes = (app: Express) => {
  app.route("/users/create").post(controller.create);

  app.route("/users/login").get(controller.login);

  app.route("/users/findall").get(verifyAuthentication, controller.findAll);

  app.route("/users/:id").get(verifyAuthentication, controller.findById);

  app.route("/users/update/:id").put(verifyAuthentication, controller.update);

  app.route("/users/disable/:id").put(verifyAuthentication, controller.disable);
};

export default userRoutes;
