import express, { Express } from "express";

// routes
import taskRoutes from "./routes/task.routes";

export default (): Express => {
  const app = express();
  app.set("port", process.env.PORT || 3000);
  app.use(express.json());

  // Routes
  taskRoutes(app);

  return app;
};
