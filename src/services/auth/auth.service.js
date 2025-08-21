import {
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException
} from "../../lib/exceptions/index.js";

import {randomUUID} from "crypto"

export class AuthService {

    constructor(jwtService, bcryptService, userRepository, roleRepository) {
        this.jwtService = jwtService
        this.bcryptService = bcryptService
        this.userRepository = userRepository
        this.roleRepository = roleRepository
    }

    async validateLoginCredentials(data) {
        const {email, password} = data;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const passwordMatch = await this.bcryptService.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException("Invalid email or password");
        }

        delete user.password;
        return {
            user,
        }
    }

    async registerUser(data, role) {
        const {name, lastName, email, password} = data;
        if (!role) {
            role = await this.roleRepository.findByName('artist');
            if (!role) {
                throw new InternalServerErrorException("Default user role not found");
            }
        }

        if (!name || !lastName || !email || !password) {
            throw new BadRequestException("Missing required fields: name, lastName, email, password");
        }

        const user = await this.userRepository.findByEmail(email);
        if (user) {
            throw new BadRequestException("User with this email already exists");
        }
        const hashedPassword = await this.bcryptService.hash(password);
        const newUser = await this.userRepository.create({
            name,
            lastName,
            email,
            password: hashedPassword,
            role_id: role.id,
        });

        if (!newUser) {
            throw new InternalServerErrorException("User registration failed");
        }

        delete newUser.password;
        return {
            user: newUser
        }
    }

    async generateAccessToken(user) {
        return await this.jwtService.sign({sub: user.id}, '1h');
    }

    generateRefreshToken() {
        return randomUUID().toString()
    }
}