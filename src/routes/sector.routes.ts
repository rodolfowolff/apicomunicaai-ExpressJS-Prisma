import { Express } from "express";
import * as controller from "../controllers/sector.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const sectorRoutes = (app: Express) => {
  app.route("/sectors").get(controller.findAll);

  app.route("/sectors").post(verifyAuthentication, controller.create);
};

export default sectorRoutes;
