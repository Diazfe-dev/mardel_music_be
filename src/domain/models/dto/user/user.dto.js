import {BaseDto} from "../index.js";

export class UserDto extends BaseDto {
    constructor(row) {
        super();

        this.row = row;
    }

    validate() {

    }

    serialize() {
        return {
            id: this.row.user_id,
            name: this.row.user_name,
            lastName: this.row.user_lastName,
            email: this.row.user_email,
            password: this.row.user_password,
            profile_picture: this.row.user_profile_picture,
            social_login: this.row.user_social_login,
            phone_number: this.row.user_phone_number,
            created_at: this.row.user_created_at,
            updated_at: this.row.user_updated_at,
            role_id: this.row.role_id
        };
    }
}

export class UserDtoWithPermissions extends BaseDto {
    constructor(row) {
        super();

        this.row = row;
    }

    validate() {

    }

    serialize() {
        return {
            id: this.row.user_id,
            name: this.row.user_name,
            lastName: this.row.user_lastName,
            email: this.row.user_email,
            password: this.row.user_password,
            profile_picture: this.row.user_profile_picture,
            social_login: !!this.row.user_social_login,
            phone_number: this.row.user_phone_number,
            created_at: this.row.user_created_at,
            updated_at: this.row.user_updated_at,
            role: {
                id: this.row.role_id,
                name: this.row.role_name,
                permissions: this.row.permissions ? this.row.permissions.split(',') : []
            }
        };
    }


}