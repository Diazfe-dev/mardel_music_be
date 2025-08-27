import * as bcrypt from 'bcrypt';

export class BcryptAdapter {
    constructor() {}

    async hash(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}