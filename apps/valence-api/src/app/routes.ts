import * as express from 'express';
import players from './player';
import characters from './character';
import skills from './skill';
import rumours from './rumour';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to valence-api!' });
});
router.use('/players', players.routes);
router.use('/characters', characters.routes);
router.use('/skills', skills.routes);
router.use('/rumours', rumours.routes);

export default router;
