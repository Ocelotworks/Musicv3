import * as Knex from "knex";

export default class ElasticImport {
    private static db: Knex = Knex(require('../../knexfile.js'));

    constructor(){

    }
}

new ElasticImport();