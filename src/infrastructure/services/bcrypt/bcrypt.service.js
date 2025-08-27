export class BcryptService {BcryptService
    constructor(bcryptAdapter) {
        this.bcrypt = bcryptAdapter;
    }

    async hash(password) {
        return await this.bcrypt.hash(password);
    }

    async compare(password, hashedPassword) {
        return await this.bcrypt.compare(password, hashedPassword);
    }
}