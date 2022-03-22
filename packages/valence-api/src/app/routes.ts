import * as express from "express";
import players from "./player";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to valence-api!" });
});
router.use("/players", players.routes);

export default router;
