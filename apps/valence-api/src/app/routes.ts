import * as express from "express";
import players from "./player";
import characters from "./character";
import skills from "./skill";

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to valence-api!" });
});
router.use("/players", players.routes);
router.use("/characters", characters.routes);
router.use("/skills", skills.routes);

export default router;
