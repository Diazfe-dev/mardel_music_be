import {Router} from "express";
import mysqlClient from "../../database/mysql/mysql-client.js";

import {sessionGuard} from "../../middlewares/index.js";

import {UserController} from "../../controllers/user/user.controller.js";
import {UserService} from "../../services/user/user.service.js";
import {UserRepository, RoleRepository, ProfileRepository} from "../../repositories/index.js";

const userRepository = new UserRepository(mysqlClient);
const profileRepository = new ProfileRepository(mysqlClient);
const userService = new UserService(userRepository, profileRepository);
const userController = new UserController(userService)

const userRouter = Router();
userRouter.get('/me', sessionGuard, async (req, res) => {
    await userController.getUserProfile(req, res);
})

export default userRouter;