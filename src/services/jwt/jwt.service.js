export class JsonWebTokenService {
    constructor(jwtAdapter) {
        this.jwt = jwtAdapter;
    }

    async sign(payload, expiresIn, secret) {
        return await this.jwt.sign(payload, { expiresIn }, secret);
    }

    async verify(token, secret) {
        return await this.jwt.verify(token, secret);
    }

}