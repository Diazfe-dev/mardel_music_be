import {InternalServerErrorException} from "../lib/index.js";

export class ArtistRepository {
    constructor(db) {
        this.db = db;
    }

}