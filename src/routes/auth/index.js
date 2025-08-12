import {Router} from "express";
import {AuthController} from "../../controllers/auth/auth.controller.js";
import {AuthService} from "../../services/auth/auth.service.js";
import {validateDto} from "../../middlewares/dto-validator.js";
import {LoginUserDto, RegisterUserDto} from "../../models/dto/index.js";

const authService = new AuthService();
const authController = new AuthController(authService);

const authRouter = Router()

authRouter.get("/login",
    validateDto(LoginUserDto),
    async (req, res) => {
        await authController.login(req, res)
    }
)

authRouter.post("/register",
    validateDto(RegisterUserDto),
    async (req, res) => {
        await authController.register(req, res)
    }
)

authRouter.post("/protected",
    async (req, res) => {
        await authController.protectedRoute(req, res)
    }
)


export default authRouter;