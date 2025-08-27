import {BaseDto} from "../base-dto/index.js";

export class RegisterUserDto extends BaseDto {
    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor({name, lastName, email, password}) {
        super();
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    validate() {
        let errors = [];
        if (!this.name || this.name.length < 3) errors.push("Name must be at least 3 characters long.");
        if (!this.lastName || this.lastName.length < 3) errors.push("Last name must be at least 3 characters long.");
        if (!this.email || !this.emailRegex.test(this.email)) errors.push("Email is invalid.");
        if (!this.password || this.password.length < 6) errors.push("Password must be at least 6 characters long.");
        return errors;
    }

    serialize() {
        return {
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };
    }
};