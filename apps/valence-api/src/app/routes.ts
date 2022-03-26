import * as express from "express";
import players from "./player";
import characters from "./character";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to valence-api!" });
});
router.use("/players", players.routes);
router.use("/characters", characters.routes);

export default router;
