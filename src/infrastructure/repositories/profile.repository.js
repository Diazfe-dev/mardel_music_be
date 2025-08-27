import {InternalServerErrorException} from "../lib/index.js";

export class ProfileRepository {
    constructor(db) {
        this.db = db;
    }

    async findById(id) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE id = ?`,
                [id]
            );
            return rows[0].profile_id ? this.__mapSocialMediaToProfile(rows[0]): null;
        } catch (err) {
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findByUserId(userId) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE user_id = ?`,
                [userId]
            );
           return rows[0].profile_id ? this.__mapSocialMediaToProfile(rows[0]): null;
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async create({user_id, artist_name, bio, avatar_url, verified = false}) {
        const [result] = await this.db.execute(
            'CALL sp_create_profile(user_id, artist_name, bio, avatar_url, verified, social_media) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, artist_name, bio, avatar_url, verified]
        );

        return this.findByUserId(user_id);
    }

    __mapSocialMediaToProfile(row) {
        const splited = row.social_media_links.split(';').map(sm => {
            const platform = sm.split(':')[0].trim();
            const url =sm.substring(sm.indexOf(':')+1, sm.length).trim()
            return {
                platform,
                url
            }
        });
        return {
            ...row,
            profile_verified: row.profile_verified === 1 ? true : false,
            social_media_links: splited
        }
    }
}