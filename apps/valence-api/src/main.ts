/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from "express";
import routes from "./app/routes";

const startServer = () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api", routes);

  app.use((err, req, res, next) => {
    console.error("STACK", err.stack);
    console.error("MESSAGE", err.message);
    res.status(500).send({ error: err.message });
  });

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on("error", console.error);

};
export default startServer;
