import {Router} from "express";

import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";

import {sessionGuard, validateDto} from "../../../infrastructure/middlewares/index.js";

import {UserController} from "../../controllers/user/user.controller.js";
import {UserService} from "../../../infrastructure/services/user/user.service.js";
import {UserRepository, ProfileRepository} from "../../../infrastructure/repositories/index.js";
import {FileService} from "../../../infrastructure/services/file-uploader/file-uploader.service.js";

const userController = new UserController(
    new UserService(
        new UserRepository(mysqlClient),
        new ProfileRepository(mysqlClient)),
    new FileService())

const userRouter = Router();
userRouter.get('/me',
    sessionGuard,
    async (req, res) => await userController.getUserProfile(req, res));

userRouter.put(
    '/profile-image',
    sessionGuard,
    async (req, res) => await userController.saveProfileImage(req, res))

export default userRouter;