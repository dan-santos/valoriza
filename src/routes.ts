import { Router } from 'express';
import { ComplimentController } from './controllers/ComplimentController';
import { TagController } from './controllers/TagController';
import { UserController } from './controllers/UserController';
import { ensureAdmin } from './middlewares/ensureAdmin';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const router = Router();

const userController = new UserController();
const tagController = new TagController();
const complimentController = new ComplimentController();

router.post('/users', userController.create);
router.get('/users', ensureAuthenticated, ensureAdmin, userController.get);
router.put('/users/:id', ensureAuthenticated, userController.update);
router.delete('/users/:id', ensureAuthenticated, userController.delete);
router.post('/login', userController.auth);

router.post('/tags', ensureAuthenticated, ensureAdmin, tagController.create);
router.get('/tags', ensureAuthenticated, tagController.get);
router.put('/tags/:id', ensureAuthenticated, ensureAdmin, tagController.update);
router.delete('/tags/:id', ensureAuthenticated, ensureAdmin, tagController.delete);

router.post('/compliments', ensureAuthenticated, complimentController.create);
router.get('/compliments', ensureAuthenticated, complimentController.get);
router.put('/compliments/:id', ensureAuthenticated, complimentController.update);
router.delete('/compliments/:id', ensureAuthenticated, complimentController.delete);
router.get('/users/compliments', ensureAuthenticated, complimentController.listByUser);

export { router };