import { Router } from "express";
import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";

import { sessionGuard, validateDto } from "../../../infrastructure/middlewares/index.js";

import { AuthController } from "../../controllers/auth/auth.controller.js";

import { AuthService } from "../../../infrastructure/services/auth/auth.service.js";
import { JsonWebTokenService } from "../../../infrastructure/services/jwt/jwt.service.js";
import { BcryptService } from "../../../infrastructure/services/bcrypt/bcrypt.service.js";

import { BcryptAdapter, JwtAdapter } from "../../../infrastructure/lib/index.js";

import { UserRepository, RoleRepository } from "../../../infrastructure/repositories/index.js";

import { LoginUserDto, RegisterUserDto } from "../../../domain/models/dto/index.js";

const roleRepository = new RoleRepository(mysqlClient);
const userRepository = new UserRepository(mysqlClient);
const jwtService = new JsonWebTokenService(new JwtAdapter());
const bcryptService = new BcryptService(new BcryptAdapter());
const authService = new AuthService(
    jwtService,
    bcryptService,
    userRepository,
    roleRepository
);
const authController = new AuthController(authService);

const authRouter = Router()

authRouter.post("/login", validateDto(LoginUserDto), async (req, res) => {
    await authController.login(req, res)
});

authRouter.post("/register", validateDto(RegisterUserDto), async (req, res) => {
    await authController.register(req, res)
});

authRouter.get('/logout', sessionGuard, async (req, res) => {
    await authController.logout(req, res);
});

export default authRouter;