import {Router} from "express";
import mysqlClient from "../../database/mysql/mysql-client.js";

// Middlewares
import {permissionGuard, roleGuard, sessionGuard, validateDto} from "../../middlewares/index.js";

// Controllers
import {AuthController} from "../../controllers/auth/auth.controller.js";

// Services
import {AuthService} from "../../services/auth/auth.service.js";
import {JsonWebTokenService} from "../../services/jwt/jwt.service.js";
import {BcryptService} from "../../services/bcrypt/bcrypt.service.js";

// Adapters
import {BcryptAdapter, JwtAdapter} from "../../lib/index.js";

// Repositories
import {UserRepository, RoleRepository, ProfileRepository} from "../../repositories/index.js";
// Dtos
import {LoginUserDto, RegisterUserDto} from "../../models/dto/index.js";

const profileRepository = new ProfileRepository(mysqlClient);
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