import * as express from 'express';
import controller from "./controller";

const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:characterId', controller.replace);
router.delete('/:characterId', controller.remove);

export default router;
