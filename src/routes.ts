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
router.post('/login', userController.auth);

router.post('/tags', ensureAuthenticated, ensureAdmin, tagController.create);

router.post('/compliments', ensureAuthenticated, complimentController.create);

console.log(`Successfully registered all ${router.length+1} application routes!`);

export { router };