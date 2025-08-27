import jwt from 'jsonwebtoken';
import envVars from "../../config/env-vars.js";

const {JWT_SECRET} = envVars;

export class JwtAdapter {
    constructor() {
    }

    async sign(payload, options, secret) {
        if(!secret) {
            secret = JWT_SECRET;
        }
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            });
        });
    }

    async verify(token, secret) {
        if (!secret) {
            secret = JWT_SECRET;
        }
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
}