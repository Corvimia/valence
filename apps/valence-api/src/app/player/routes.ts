import * as express from 'express';
import controller from "./controller";

const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:playerId', controller.replace);
router.delete('/:playerId', controller.remove);

export default router;
