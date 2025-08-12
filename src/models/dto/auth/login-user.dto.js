import {BaseDto} from "../base-dto/index.js";

export class LoginUserDto extends BaseDto {
    emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    constructor({email, password}) {
        super()
        this.email = email;
        this.password = password;
    }

    validate() {
        let errors = [];
        if (!this.email || !this.emailRegex.test(this.email)) {
            errors.push("Email is invalid.");
        }
        if (!this.password || this.password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }
        return errors;
    }

    serialize() {
        return {
            email: this.email,
            password: this.password
        };
    }
}