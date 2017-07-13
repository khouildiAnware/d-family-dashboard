'use strict';

const BaseService = require('./BaseService');
const Parse = require('parse/node');

class CategoryService extends BaseService {

    constructor() {
        super('Category');
    }
}

module.exports = new CategoryService();
