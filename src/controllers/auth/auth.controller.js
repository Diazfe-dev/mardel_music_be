export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res) {
        const credentials = req.body.dto;
        const user = this.authService.validateLoginCredentials(credentials)

        res.status(200).json({
            msg: "Login successful",
            credentials: user
        })
    }

    async register(req, res) {
        const credentials = req.body.dto;
        res.status(200).json({
            msg: "Register",
            credentials: credentials
        })
    }

    async protectedRoute(req, res) {
        res.status(200).json({
            msg: "You have accessed a protected route"
        })
    }
}