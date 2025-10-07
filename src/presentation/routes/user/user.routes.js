import { Router } from "express";

import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";
import upload from '../../../infrastructure/database/file-storage/disk-storage.js';

import { roleGuard, sessionGuard } from "../../../infrastructure/middlewares/index.js";

import { UserController } from "../../controllers/user/user.controller.js";
import { UserService } from "../../../infrastructure/services/user/user.service.js";
import { UserRepository, ProfileRepository } from "../../../infrastructure/repositories/index.js";

const userController = new UserController(new UserService(new UserRepository(mysqlClient), new ProfileRepository(mysqlClient)));

const userRouter = Router();

userRouter.get('/me',
    sessionGuard,
    roleGuard(['user', 'artist', 'admin']),
    async (req, res) => await userController.getUserProfile(req, res));

userRouter.put('/profile-image',
    sessionGuard,
    upload.single('profile_image'),
    roleGuard(['user', 'artist', 'admin']),
    async (req, res) => await userController.saveProfileImage(req, res));

export default userRouter;