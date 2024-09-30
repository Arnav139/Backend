import { Router } from 'express';
// import controller from controllers -> user.controller

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
